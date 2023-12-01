"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Config: () => Config,
  ContentType: () => ContentType,
  ContentTypeList: () => ContentTypeList,
  Form: () => Form,
  TmpDBAdapter: () => TmpDBAdapter,
  UserConfig: () => UserConfig,
  UserFieldsSchema: () => UserFieldsSchema,
  createContentType: () => createContentType,
  createContentTypePage: () => createContentTypePage
});
module.exports = __toCommonJS(src_exports);

// src/init.ts
var Config = class {
  constructor(name, userConfig) {
    this.name = name;
    this.userConfig = userConfig;
  }
  _contentTypes = /* @__PURE__ */ new Map();
  registerContentType(contentType) {
    this._contentTypes.set(contentType.name, contentType);
  }
  get contentTypes() {
    return this._contentTypes;
  }
  get contentTypeNames() {
    return Array.from(this._contentTypes.keys());
  }
};

// src/db/json.ts
var import_fs = require("fs");
var import_promises = require("fs/promises");
var import_os = __toESM(require("os"));
var import_path = __toESM(require("path"));
var TmpDBAdapter = class {
  tmpDir;
  getStoreName(id) {
    return import_path.default.join(this.tmpDir, `./${id}.json`);
  }
  async writeStore(id, value) {
    const sanitizedValue = {
      ...value,
      createdAt: value.createdAt.getTime(),
      updatedAt: value.updatedAt.getTime()
    };
    await (0, import_promises.writeFile)(this.getStoreName(id), JSON.stringify(sanitizedValue));
  }
  async readStore(id) {
    const data = await (0, import_promises.readFile)(this.getStoreName(id), "utf-8");
    const json = JSON.parse(data);
    return {
      ...json,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt)
    };
  }
  constructor(dbName) {
    this.tmpDir = import_path.default.join(import_os.default.tmpdir(), dbName);
    const exists = (0, import_fs.existsSync)(this.tmpDir);
    if (!exists) {
      void (0, import_promises.mkdir)(this.tmpDir, { recursive: true });
    }
  }
  async create(name, fields) {
    const id = String(Math.floor(Math.random() * 1e3));
    const entity = {
      name,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      fields
    };
    await this.writeStore(id, entity);
    return entity;
  }
  read(id) {
    return this.readStore(id);
  }
  async update(id, fields) {
    const entity = await this.readStore(id);
    const updatedEntity = {
      ...entity,
      fields,
      updatedAt: /* @__PURE__ */ new Date()
    };
    await this.writeStore(id, updatedEntity);
    return updatedEntity;
  }
  async list(options) {
    const dir = await (0, import_promises.readdir)(this.tmpDir);
    return Promise.all(
      dir.map((file) => this.readStore(file.replace(".json", "")))
    );
  }
};

// src/user/index.ts
var import_zod = require("zod");
var UserFieldsSchema = import_zod.z.object({
  email: import_zod.z.string(),
  username: import_zod.z.string()
});
var UserConfig = class {
  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
  }
};

// src/content-type/definition.ts
var createContentType = (name, fieldsSchema, dbAdapter) => {
  return new ContentType(name, fieldsSchema, dbAdapter);
};
var ContentType = class {
  constructor(name, fieldsSchema, dbAdapter) {
    this.name = name;
    this.fieldsSchema = fieldsSchema;
    this.dbAdapter = dbAdapter;
  }
};

// src/content-type/react/form.tsx
var import_zod2 = require("zod");
var import_jsx_runtime = require("react/jsx-runtime");
async function Form({ fields }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { children: [
    "Form",
    Object.entries(fields.shape).map(([key, value]) => {
      console.log(value instanceof import_zod2.z.ZodString);
      if (value instanceof import_zod2.z.ZodString) {
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "text", name: key });
      }
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {});
    })
  ] });
}

// src/content-type/react/list.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
async function ContentTypeList({ contentType }) {
  const { name, dbAdapter, fieldsSchema } = contentType;
  const items = await dbAdapter.list();
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "grid gap-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h1", { className: "text-2xl", children: name }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("hr", {}),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ul", { children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: item.id }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: item.name }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: item.createdAt.toDateString() })
    ] }) })) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("hr", {}),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Form, { fields: fieldsSchema })
  ] });
}

// src/content-type/react/page.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function createContentTypePage(config) {
  const [, filename, dynamicSegments] = /\/.*\/(.*)\/\[\[...(.*)\]\]\//.exec(__filename) ?? [];
  return async function ContentTypePage({ params }) {
    const [id] = params[dynamicSegments] ?? [];
    const contentType = id && config.contentTypes.get(id);
    if (contentType) {
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ContentTypeList, { contentType });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h1", { className: "text-2xl", children: config.name }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "flex gap-2", children: config.contentTypeNames.map((contentTypeKey) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("a", { href: `/${filename}/${contentTypeKey}`, children: contentTypeKey }, contentTypeKey)) })
    ] });
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  ContentType,
  ContentTypeList,
  Form,
  TmpDBAdapter,
  UserConfig,
  UserFieldsSchema,
  createContentType,
  createContentTypePage
});
//# sourceMappingURL=index.js.map