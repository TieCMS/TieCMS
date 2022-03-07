export default interface Config {
  name: string;
  version: string;
  authors: string[];
  website?: string;
  description?: string;
  permissions?: Record<string, Permission>[];
  dependencies?: string[];
  router?: Router;
}

export interface Permission {
  description?: string;
  default?: boolean;
}

export interface Router {
  prefix?: string;
}
