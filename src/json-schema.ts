import {
  JsonSchema7BooleanType,
  JsonSchema7EnumType,
  JsonSchema7NumberType,
  JsonSchema7StringType,
  JsonSchema7Type,
} from "zod-to-json-schema";

export function getSchemaType(schema: JsonSchema7Type) {
  return "type" in schema ? schema.type : "unknown";
}

export function isEnumSchema(
  schema: JsonSchema7Type
): schema is JsonSchema7EnumType {
  return "enum" in schema;
}

export function isStringSchema(
  schema: JsonSchema7Type
): schema is JsonSchema7StringType {
  return getSchemaType(schema) === "string";
}

export function isNumberSchema(
  schema: JsonSchema7Type
): schema is JsonSchema7NumberType {
  return getSchemaType(schema) === "number";
}

export function isBooleanSchema(
  schema: JsonSchema7Type
): schema is JsonSchema7BooleanType {
  return getSchemaType(schema) === "boolean";
}
