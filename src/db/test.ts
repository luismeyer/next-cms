import { existsSync } from "fs";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import os from "os";
import path from "path";

import { dbAdapter, DBAdapterApi, Entity } from "./adapter";

const testAdapterApi: DBAdapterApi = (dbName, schema) => {
  const tmpDir = path.join(os.tmpdir(), dbName);
  const exists = existsSync(tmpDir);

  if (!exists) {
    void mkdir(tmpDir, { recursive: true });
  }

  function getStoreName(id: string) {
    return path.join(tmpDir, `./${id}.json`);
  }

  async function writeStore(id: string, value: Entity) {
    const sanitizedValue = {
      ...value,
      createdAt: value.createdAt.getTime(),
      updatedAt: value.updatedAt.getTime(),
    };

    await writeFile(getStoreName(id), JSON.stringify(sanitizedValue));
  }

  async function readStore(id: string): Promise<Entity> {
    const data = await readFile(getStoreName(id), "utf-8");
    const json = JSON.parse(data);

    return {
      ...json,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
    };
  }

  return {
    async create(fields) {
      const id = String(Math.floor(Math.random() * 1000));

      const entity: Entity = {
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        fields,
      };

      await writeStore(id, entity);

      return entity;
    },

    async read(id: string) {
      try {
        return await readStore(id);
      } catch {
        return undefined;
      }
    },

    async update(id, fields) {
      const entity = await readStore(id);

      const updatedEntity = {
        ...entity,
        fields,
        updatedAt: new Date(),
      };

      await writeStore(id, updatedEntity);

      return updatedEntity;
    },

    async list(options) {
      const dir = await readdir(tmpDir);

      return Promise.all(
        dir.map((file) => readStore(file.replace(".json", "")))
      );
    },
  };
};

export const testAdapter = dbAdapter(testAdapterApi);
