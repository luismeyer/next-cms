import { UserConfig } from "./user";
import { ContentType } from "./content-type/definition";

export class Config {
  private _contentTypes = new Map<string, ContentType>();

  constructor(
    public readonly name: string,
    public readonly userConfig: UserConfig
  ) {}

  registerContentType(contentType: ContentType) {
    this._contentTypes.set(contentType.name, contentType);
  }

  get contentTypes() {
    return this._contentTypes;
  }

  get contentTypeNames() {
    return Array.from(this._contentTypes.keys());
  }
}
