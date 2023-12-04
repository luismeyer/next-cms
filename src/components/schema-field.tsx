"use client";

import { JsonSchema7Type } from "zod-to-json-schema";

import { Input } from "./ui/input";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { SchemaInput } from "./schema-input";
import { SchemaSelect } from "./schema-select";
import { SchemaSwitch } from "./schema-switch";

type FormProps = {
  schema: JsonSchema7Type;
  field: ControllerRenderProps<FieldValues, string>;
};

export function SchemaField({ schema, field }: FormProps) {
  const type = "type" in schema ? schema.type : "unknown";

  if ("enum" in schema) {
    return <SchemaSelect field={field} schema={schema} />;
  }

  if (type === "string" || type === "number") {
    return <SchemaInput field={field} schema={schema} />;
  }

  if (type === "boolean") {
    return <SchemaSwitch field={field} schema={schema} />;
  }

  return (
    <Input
      type="text"
      placeholder={schema.description ?? "type value..."}
      {...field}
    />
  );
}
