import Link from "next/link";
import zodToJsonSchema, { JsonSchema7ObjectType } from "zod-to-json-schema";

import { config } from "../../config";
import { createLink } from "../../next/base-url";
import { parseDynamicParams } from "../../next/dynamic-params";
import { CreateForm } from "./create-form";
import { ListPage, NEW_ITEM_SLUG } from "./list-page";
import { UpdateForm } from "./update-form";

export function contentTypePage({
  contentTypeNames,
  contentTypes,
  name,
  link,
}: ReturnType<typeof config>) {
  return async function ContentTypePage(params: unknown) {
    const [contentTypeName, idOrAction] = parseDynamicParams(params) ?? [];

    const contentType = contentTypeName && contentTypes.get(contentTypeName);

    if (contentType) {
      if (!idOrAction) {
        return <ListPage contentType={contentType} link={link} />;
      }

      const schema = zodToJsonSchema(
        contentType.fieldsSchema
      ) as JsonSchema7ObjectType;

      if (idOrAction === NEW_ITEM_SLUG) {
        return (
          <CreateForm
            contentTypeName={contentType.name}
            fields={schema}
            link={link}
          />
        );
      }

      const entity = await contentType.dbAdapter.api.read(idOrAction);
      if (entity) {
        return (
          <UpdateForm
            contentTypeName={contentType.name}
            fields={schema}
            link={link}
            entity={entity}
          />
        );
      }
    }

    return (
      <div className="grid gap-2">
        <h1 className="text-2xl">{name}</h1>

        <div className="flex gap-2">
          {contentTypeNames.map((contentTypeKey) => (
            <Link
              key={contentTypeKey}
              href={createLink(link.cms, contentTypeKey)}
            >
              {contentTypeKey}
            </Link>
          ))}
        </div>
      </div>
    );
  };
}
