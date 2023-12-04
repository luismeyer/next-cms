import { config } from "./config";
import { contentType } from "./content-type/definition";
import { contentTypePage } from "./content-type/react";
import { api } from "./content-type/api";
import { testAdapter } from "./db/test";
import { userConfig } from "./user";

export { config, contentType, testAdapter, userConfig, contentTypePage, api };

export const n = {
  testAdapter,
  userConfig,
  config,
  contentType,
  contentTypePage,
  api,
};

export default n;
