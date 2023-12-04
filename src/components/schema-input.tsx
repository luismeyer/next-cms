"use client";

import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { JsonSchema7Type } from "zod-to-json-schema";
import { Input } from "./ui/input";
import { ChangeEvent, HTMLInputTypeAttribute } from "react";

type SchemaInputProps = {
  schema: JsonSchema7Type;
  field: ControllerRenderProps<FieldValues, string>;
};

export function SchemaInput({ field, schema }: SchemaInputProps) {
  const type = "type" in schema ? schema.type : "unknown";

  return (
    <Input
      {...field}
      value={field.value ?? ""}
      type={typeFromSchema(type)}
      placeholder={schema.description ?? "type value..."}
      onChange={(e) => {
        const value = onChangeOverride(type, e);
        field.onChange(value);
      }}
    />
  );
}

function onChangeOverride(
  typeSchema: unknown,
  event: ChangeEvent<HTMLInputElement>
) {
  switch (typeSchema) {
    case "number":
      const value = event.target.value;
      const parsed = parseInt(value);

      if (isNaN(parsed)) {
        event.target.value = "";
      } else {
        event.target.value = parsed.toString();
      }

      return parsed;
    default:
      return event;
  }
}

function typeFromSchema(typeSchema: unknown): HTMLInputTypeAttribute {
  switch (typeSchema) {
    case "string":
      return "text";
    case "number":
      return "number";
    default:
      throw new Error(
        `next-cms error: unsupported type in schema: ${typeSchema}. Open an issue or a PR to fix this!`
      );
  }
}
