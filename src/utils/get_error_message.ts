import { validator } from "../../deps.ts";

export function getErrorMessage(errors: validator.ValidationErrors) {
  const attrErrors = errors[Object.keys(errors)[0]];
  return attrErrors[Object.keys(attrErrors)[0]] as string;
}
