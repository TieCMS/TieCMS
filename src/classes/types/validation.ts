import Config, { Permission } from "./config.ts";

export default interface Validation {
  key: keyof Config | "[permission]" | keyof Permission;
  //entry: unknown;
  type: "string" | "boolean" | "object";
  isArray: boolean;
  required: boolean;
  defaultValue?: string | string[] | boolean;
  nested?: Validation[] | Validation;
}
