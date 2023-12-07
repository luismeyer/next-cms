import { NextRequest } from "next/server";
import { headers } from "next/headers";

import { config } from "../../config";
import { parseDynamicParams } from "../../next/dynamic-params";
import { ContentType } from "../definition";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { TokenConfig } from "../../token";

function getContentType(contentTypes: Map<string, ContentType>, name?: string) {
  if (!name) {
    return;
  }

  return contentTypes.get(name);
}

async function getAuth(token: TokenConfig) {
  const session = await getServerSession();

  if (session?.user) {
    return { type: "admin" } as const;
  }

  const authHeader = headers().get("Authorization")?.replace("Bearer ", "");

  const { tokens, hash } = token();

  const tokenConfig = tokens.find(
    (token) => hash(authHeader ?? "") === token.hashedValue
  );

  if (tokenConfig) {
    return {
      type: "token",
      token: tokenConfig,
    } as const;
  }

  return { type: "denied" } as const;
}

export function api({ contentTypes, token }: ReturnType<typeof config>) {
  return {
    async PUT(request: NextRequest, params: unknown) {
      const auth = await getAuth(token);

      if (auth.type === "denied") {
        return new Response("Unauthorized", { status: 401 });
      }

      const [typeName] = parseDynamicParams(params) ?? [];

      const contentType = getContentType(contentTypes, typeName);
      if (!contentType) {
        return new Response("Not found", { status: 404 });
      }

      if (
        auth.type === "token" &&
        auth.token.acl.get(contentType) !== "read-write"
      ) {
        return new Response("Unauthorized", { status: 401 });
      }

      // parse input
      const body = await request.json();
      const entity = contentType.fieldsSchema.parse(body);

      // create
      const createdEntity = await contentType.dbAdapter.api.create(entity);

      // revalidate cache
      revalidatePath("/");

      return new Response(JSON.stringify(createdEntity), {
        headers: { "content-type": "application/json" },
      });
    },
    async POST(request: NextRequest, params: unknown) {
      const auth = await getAuth(token);

      if (auth.type === "denied") {
        return new Response("Unauthorized", { status: 401 });
      }

      const [typeName, id] = parseDynamicParams(params) ?? [];

      const contentType = getContentType(contentTypes, typeName);

      if (!contentType || !id) {
        return new Response("Not found", { status: 404 });
      }

      if (
        auth.type === "token" &&
        auth.token.acl.get(contentType) !== "read-write"
      ) {
        return new Response("Unauthorized", { status: 401 });
      }

      // parse input
      const body = await request.json();
      const entity = contentType.fieldsSchema.parse(body);

      // update
      const updatedEntity = await contentType.dbAdapter.api.update(id, entity);

      // revalidate cache
      revalidatePath("/");

      return new Response(JSON.stringify(updatedEntity), {
        headers: { "content-type": "application/json" },
      });
    },
    async GET(_: NextRequest, params: unknown) {
      const auth = await getAuth(token);

      if (auth.type === "denied") {
        return new Response("Unauthorized", { status: 401 });
      }

      const [typeName, id] = parseDynamicParams(params) ?? [];

      const contentType = getContentType(contentTypes, typeName);
      if (!contentType) {
        return new Response("Not found", { status: 404 });
      }

      if (
        auth.type === "token" &&
        auth.token.acl.get(contentType) !== "read" &&
        auth.token.acl.get(contentType) !== "read-write"
      ) {
        return new Response("Unauthorized", { status: 401 });
      }

      if (id) {
        const entity = await contentType.dbAdapter.api.read(id);

        if (!entity) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(JSON.stringify(entity), {
          headers: { "content-type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify(await contentType.dbAdapter.api.list()),
        { headers: { "content-type": "application/json" } }
      );
    },
  };
}
