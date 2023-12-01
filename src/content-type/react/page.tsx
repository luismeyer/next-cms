import { Config } from "../../init";
import { ContentTypeList } from "./list";

type ListPageProps = {
  params: Record<string, undefined | string[]>;
};

export function createContentTypePage(config: Config) {
  const [, filename, dynamicSegments] =
    /\/.*\/(.*)\/\[\[...(.*)\]\]\//.exec(__filename) ?? [];

  return async function ContentTypePage({ params }: ListPageProps) {
    const [id] = params[dynamicSegments] ?? [];

    const contentType = id && config.contentTypes.get(id);

    if (contentType) {
      // @ts-ignore
      return <ContentTypeList contentType={contentType} />;
    }

    return (
      <div className="grid gap-2">
        <h1 className="text-2xl">{config.name}</h1>

        <div className="flex gap-2">
          {config.contentTypeNames.map((contentTypeKey) => (
            <a key={contentTypeKey} href={`/${filename}/${contentTypeKey}`}>
              {contentTypeKey}
            </a>
          ))}
        </div>
      </div>
    );
  };
}
