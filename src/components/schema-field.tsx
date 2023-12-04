"use client";

import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { JsonSchema7Type } from "zod-to-json-schema";

import {
  getSchemaType,
  isBooleanSchema,
  isEnumSchema,
  isNumberSchema,
  isStringSchema,
} from "../json-schema";
import { SchemaInput } from "./schema-input";
import { SchemaSelect } from "./schema-select";
import { SchemaSwitch } from "./schema-switch";

type FormProps = {
  schema: JsonSchema7Type;
  field: ControllerRenderProps<FieldValues, string>;
};

export function SchemaField({ schema, field }: FormProps) {
  if (isEnumSchema(schema)) {
    return <SchemaSelect field={field} schema={schema} />;
  }

  if (isStringSchema(schema) || isNumberSchema(schema)) {
    return <SchemaInput field={field} schema={schema} />;
  }

  if (isBooleanSchema(schema)) {
    return <SchemaSwitch field={field} schema={schema} />;
  }

  throw new Error(`Unsupported schema type: ${getSchemaType(schema)}`);
}
