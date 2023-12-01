import { existsSync } from "fs";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import os from "os";
import path from "path";

import { DBAdapter, Entity, Fields } from "./adapter";

export class TmpDBAdapter<F extends Fields> implements DBAdapter {
  private tmpDir: string;

  private getStoreName(id: string) {
    return path.join(this.tmpDir, `./${id}.json`);
  }

  private async writeStore(id: string, value: Entity) {
    const sanitizedValue = {
      ...value,
      createdAt: value.createdAt.getTime(),
      updatedAt: value.updatedAt.getTime(),
    };

    await writeFile(this.getStoreName(id), JSON.stringify(sanitizedValue));
  }

  private async readStore(id: string): Promise<Entity> {
    const data = await readFile(this.getStoreName(id), "utf-8");
    const json = JSON.parse(data);

    return {
      ...json,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
    };
  }

  constructor(dbName: string) {
    this.tmpDir = path.join(os.tmpdir(), dbName);
    const exists = existsSync(this.tmpDir);

    if (!exists) {
      void mkdir(this.tmpDir, { recursive: true });
    }
  }

  async create(name: string, fields: F): Promise<Entity> {
    const id = String(Math.floor(Math.random() * 1000));

    const entity: Entity = {
      name,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      fields,
    };

    await this.writeStore(id, entity);

    return entity;
  }

  read(id: string): Promise<Entity> {
    return this.readStore(id);
  }

  async update(id: string, fields: F): Promise<Entity> {
    const entity = await this.readStore(id);

    const updatedEntity = {
      ...entity,
      fields,
      updatedAt: new Date(),
    };

    await this.writeStore(id, updatedEntity);

    return updatedEntity;
  }

  async list(options: { limit: number; offset: number }): Promise<Entity[]> {
    const dir = await readdir(this.tmpDir);

    return Promise.all(
      dir.map((file) => this.readStore(file.replace(".json", "")))
    );
  }
}
