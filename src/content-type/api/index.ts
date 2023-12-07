import { NextRequest } from "next/server";
import { z } from "zod";

import { config } from "../../config";
import { parseDynamicParams } from "../../next/dynamic-params";
import { ContentType } from "..";
import { revalidatePath } from "next/cache";

function getContentType(contentTypes: Map<string, ContentType>, name?: string) {
  if (!name) {
    return;
  }

  return contentTypes.get(name);
}

export function api({ contentTypes, link }: ReturnType<typeof config>) {
  return {
    async PUT(request: NextRequest, params: unknown) {
      const [typeName] = parseDynamicParams(params) ?? [];

      const contentType = getContentType(contentTypes, typeName);
      if (!contentType) {
        return new Response("Not found", { status: 404 });
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
      const [typeName, id] = parseDynamicParams(params) ?? [];

      const contentType = getContentType(contentTypes, typeName);

      if (!contentType || !id) {
        return new Response("Not found", { status: 404 });
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
      const [typeName, id] = parseDynamicParams(params) ?? [];

      const contentType = getContentType(contentTypes, typeName);
      if (!contentType) {
        return new Response("Not found", { status: 404 });
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
        {
          headers: { "content-type": "application/json" },
        }
      );
    },
  };
}
