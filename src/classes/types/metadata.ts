export default interface Metadata {
  name: string;
  version: string;
  author?: string;
  authors?: string[];
  website?: string;
  description?: string;
  permissions?: Record<string, Permission>;
  dependencies?: string[];
  softdependencies?: string[];
}

export interface Permission {
  description?: string;
  default?: boolean;
}
