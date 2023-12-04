import { ContentType } from "./content-type/definition";
import { UserConfig } from "./user/index";

export function config(options: {
  name: string;
  user: UserConfig;
  contentTypes?: ContentType[];
  link: { api: string; cms: string };
}) {
  const _contentTypes = new Map<string, ContentType>();

  options.contentTypes?.forEach((contentType) => {
    _contentTypes.set(contentType.name, contentType);
  });

  return {
    name: options.name,
    user: options.user,
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
