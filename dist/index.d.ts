import { z } from 'zod';
import * as react_jsx_runtime from 'react/jsx-runtime';

type Fields = Record<string, number | string | boolean>;
interface Entity {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    fields: Fields;
}
interface DBAdapter {
    create(name: string, fields: Fields): Promise<Entity>;
    read(id: string): Promise<Entity>;
    update(id: string, fields: Fields): Promise<Entity>;
    list(options?: {
        limit?: number;
        offset?: number;
    }): Promise<Entity[]>;
}

declare const UserFieldsSchema: z.ZodObject<{
    email: z.ZodString;
    username: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    username: string;
}, {
    email: string;
    username: string;
}>;
type UserFields = z.infer<typeof UserFieldsSchema>;
declare class UserConfig {
    readonly dbAdapter: DBAdapter;
    constructor(dbAdapter: DBAdapter);
}

type ContentTypeConfig = {
    name: string;
    fieldsSchema: z.ZodType;
    dbAdapter: DBAdapter;
};
declare const createContentType: (name: string, fieldsSchema: z.ZodType, dbAdapter: DBAdapter) => ContentType;
declare class ContentType {
    readonly name: string;
    readonly fieldsSchema: z.ZodType;
    readonly dbAdapter: DBAdapter;
    constructor(name: string, fieldsSchema: z.ZodType, dbAdapter: DBAdapter);
}

declare class Config {
    readonly name: string;
    readonly userConfig: UserConfig;
    private _contentTypes;
    constructor(name: string, userConfig: UserConfig);
    registerContentType(contentType: ContentType): void;
    get contentTypes(): Map<string, ContentType>;
    get contentTypeNames(): string[];
}

declare class TmpDBAdapter<F extends Fields> implements DBAdapter {
    private tmpDir;
    private getStoreName;
    private writeStore;
    private readStore;
    constructor(dbName: string);
    create(name: string, fields: F): Promise<Entity>;
    read(id: string): Promise<Entity>;
    update(id: string, fields: F): Promise<Entity>;
    list(options: {
        limit: number;
        offset: number;
    }): Promise<Entity[]>;
}

type FormProps = {
    fields: z.ZodObject<z.ZodRawShape>;
};
declare function Form({ fields }: FormProps): Promise<react_jsx_runtime.JSX.Element>;

type ListProps = {
    contentType: ContentType;
};
declare function ContentTypeList({ contentType }: ListProps): Promise<react_jsx_runtime.JSX.Element>;

type ListPageProps = {
    params: Record<string, undefined | string[]>;
};
declare function createContentTypePage(config: Config): ({ params }: ListPageProps) => Promise<react_jsx_runtime.JSX.Element>;

export { Config, ContentType, type ContentTypeConfig, ContentTypeList, type DBAdapter, type Entity, type Fields, Form, TmpDBAdapter, UserConfig, type UserFields, UserFieldsSchema, createContentType, createContentTypePage };
