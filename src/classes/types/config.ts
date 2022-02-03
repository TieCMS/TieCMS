import Metadata from "./metadata.ts";

export default interface Config {
  entry: unknown;
  key: keyof Metadata;
  type: "string" | "boolean";
  isArray?: boolean;
  required: boolean;
  defaultValue?: string | string[] | boolean;
}
