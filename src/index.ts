import { config } from "./config";
import { contentType } from "./content-type/definition";
import { contentTypePage } from "./content-type/react";
import { api } from "./content-type/api";
import { testAdapter } from "./db/test";
import { tokenConfig } from "./token";

export { config, contentType, testAdapter, contentTypePage, api, tokenConfig };

export const n = {
  testAdapter,
  config,
  contentType,
  contentTypePage,
  api,
  tokenConfig,
};

export default n;
