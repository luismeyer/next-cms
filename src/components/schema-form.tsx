"use client";

import { useForm } from "react-hook-form";
import { JsonSchema7ObjectType } from "zod-to-json-schema";

import { ajvResolver } from "@hookform/resolvers/ajv";

import { SchemaField } from "./schema-field";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

type FormProps = {
  fields: JsonSchema7ObjectType;
  apiEndpoint: string;
  onSuccess: () => void;
};

export function SchemaForm({ fields, apiEndpoint, onSuccess }: FormProps) {
  const form = useForm({
    resolver: ajvResolver(fields as any),
    shouldUseNativeValidation: false,
  });

  async function handleSubmit(formData: unknown) {
    const response = await fetch(apiEndpoint, {
      body: JSON.stringify(formData),
      method: "PUT",
    });

    if (response.ok) {
      onSuccess();
      return;
    }

    form.setError("form", {
      message: await response.text(),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-8">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(fields.properties).map(([key, value]) => (
            <FormField
              key={key}
              name={key}
              control={form.control}
              render={(options) => (
                <FormItem className="grid">
                  <FormLabel>
                    {key[0]?.toUpperCase() + key.substring(1)}
                  </FormLabel>

                  <FormControl>
                    <SchemaField schema={value} field={options.field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
