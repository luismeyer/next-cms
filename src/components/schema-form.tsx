"use client";

import { useForm } from "react-hook-form";
import { JsonSchema7ObjectType, JsonSchema7Type } from "zod-to-json-schema";

import { ajvResolver } from "@hookform/resolvers/ajv";

import { isBooleanSchema } from "../json-schema";
import { SchemaField } from "./schema-field";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";
import { cn } from "./ui/utils";

type FormProps = {
  defaults?: Record<string, unknown>;
  fields: JsonSchema7ObjectType;
  onSubmit: (data: unknown) => void;
};

export function SchemaForm({ fields, onSubmit, defaults }: FormProps) {
  const defaultValues: Record<string, any> = defaults ?? {};

  const firstRow: { key: string; value: JsonSchema7Type }[] = [];
  const rows: { key: string; value: JsonSchema7Type }[] = [];

  Object.entries(fields.properties).forEach(([key, value]) => {
    if (!defaultValues[key]) {
      defaultValues[key] = value.default ?? "";
    }

    if (isBooleanSchema(value)) {
      firstRow.push({ key, value });
    } else {
      rows.push({ key, value });
    }
  });

  const form = useForm({
    resolver: ajvResolver(fields as any),
    shouldUseNativeValidation: false,
    defaultValues,
  });

  function renderRowItem(key: string, value: JsonSchema7Type) {
    const description = formDescription(value);

    return (
      <FormField
        key={key}
        name={key}
        control={form.control}
        render={(options) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>
              {key[0]?.toUpperCase() + key.substring(1)}{" "}
              {fields.required?.includes(key) ? "(required)" : null}
            </FormLabel>

            <FormControl>
              <SchemaField schema={value} field={options.field} />
            </FormControl>

            {description.length > 0 ? (
              <FormDescription
                className={cn(
                  "flex justify-between",
                  options.fieldState.error && "text-destructive"
                )}
              >
                {description}
              </FormDescription>
            ) : null}
          </FormItem>
        )}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
        <div className="grid gap-6">
          <div className="flex gap-12 flex-wrap">
            {firstRow.map(({ key, value }) => renderRowItem(key, value))}
          </div>

          <div className="grid gap-6">
            {rows.map(({ key, value }) => renderRowItem(key, value))}
          </div>
        </div>

        <Button type="submit" className="justify-self-end">
          Submit
        </Button>
      </form>
    </Form>
  );
}

function formDescription(schema: JsonSchema7Type) {
  let result: string[] = [];

  if ("minLength" in schema) {
    result = [...result, `Minimum length: ${schema.minLength}`];
  }

  if ("maxLength" in schema) {
    result = [...result, `Maximum length: ${schema.maxLength}`];
  }

  if ("minimum" in schema) {
    result = [...result, `Minimum value: ${schema.minimum}`];
  }

  if ("maximum" in schema) {
    result = [...result, `Maximum value: ${schema.maximum}`];
  }

  return result.map((item) => <span key={item}>{item}</span>);
}
