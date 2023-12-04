"use client";

import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { JsonSchema7Type } from "zod-to-json-schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type SchemaInputProps = {
  schema: JsonSchema7Type;
  field: ControllerRenderProps<FieldValues, string>;
};

export function SchemaSelect({ field, schema }: SchemaInputProps) {
  const options = "enum" in schema ? schema.enum : [];

  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              key={option?.toString()}
              value={option?.toString() ?? ""}
            >
              {option?.toString()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
