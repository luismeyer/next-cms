export type Fields = Record<string, number | string | boolean>;

export interface Entity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  fields: Fields;
}

export interface DBAdapter {
  create(name: string, fields: Fields): Promise<Entity>;
  read(id: string): Promise<Entity>;
  update(id: string, fields: Fields): Promise<Entity>;
  list(options?: { limit?: number; offset?: number }): Promise<Entity[]>;
}
