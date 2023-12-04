import Link from "next/link";

import { config } from "../../config";
import { createLink } from "../../next/base-url";
import { parseDynamicParams } from "../../next/dynamic-params";
import { ListPage } from "./list-page";
import { CreatePage } from "./create-page";

export function contentTypePage({
  contentTypeNames,
  contentTypes,
  name,
  link,
}: ReturnType<typeof config>) {
  return async function ContentTypePage(params: unknown) {
    const [contentTypeName, action] = parseDynamicParams(params) ?? [];

    const contentType = contentTypeName && contentTypes.get(contentTypeName);

    if (contentType) {
      if (action) {
        return <CreatePage contentType={contentType} link={link} />;
      }

      return <ListPage contentType={contentType} link={link} />;
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
