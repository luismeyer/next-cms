import { ContentType } from "./content-type/definition";
import { tokenConfig } from "./token";

export function config(options: {
  name: string;
  token: ReturnType<typeof tokenConfig>;
  contentTypes?: ContentType[];
  link: { api: string; cms: string; login: string };
}) {
  const _contentTypes = new Map<string, ContentType>();

  options.contentTypes?.forEach((contentType) => {
    _contentTypes.set(contentType.name, contentType);
  });

  return {
    name: options.name,
    token: options.token,
    link: options.link,
    registerContentType(contentType: ContentType) {
      _contentTypes.set(contentType.name, contentType);
    },

    get contentTypes() {
      return _contentTypes;
    },

    get contentTypeNames() {
      return Array.from(_contentTypes.keys());
    },
  };
}
