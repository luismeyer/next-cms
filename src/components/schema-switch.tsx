"use client";

import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { JsonSchema7Type } from "zod-to-json-schema";

import { Switch } from "./ui/switch";

type SchemaInputProps = {
  schema: JsonSchema7Type;
  field: ControllerRenderProps<FieldValues, string>;
};

export function SchemaSwitch({ field, schema }: SchemaInputProps) {
  return (
    <Switch
      checked={field.value}
      onCheckedChange={field.onChange}
      defaultChecked={field.value}
    />
  );
}
