import { ContentType } from "./content-type/definition";

export type Token = {
  hashedValue: string;
  expiresAt: Date;
  acl: WeakMap<ContentType, "read" | "read-write">;
};

export type TokenOptions = {
  hashedValue: string;
  expiresAt: Date;
  read?: ContentType[];
  write?: ContentType[];
};

export function token(options: TokenOptions): Token {
  const acl = new WeakMap<ContentType, "read" | "read-write">();

  options.read?.forEach((contentType) => {
    acl.set(contentType, "read");
  });

  options.write?.forEach((contentType) => {
    acl.set(contentType, "read-write");
  });

  return {
    hashedValue: options.hashedValue,
    expiresAt: options.expiresAt,
    acl,
  };
}

export type TokenConfigOptions = {
  hash: (value: string) => string;
  tokens: TokenOptions[];
};

export type TokenConfig = () => {
  hash: (value: string) => string;
  tokens: Token[];
};

export function tokenConfig(options: TokenConfigOptions): TokenConfig {
  return () => {
    if (typeof window !== "undefined") {
      throw new Error("Token config is only available on the server");
    }

    return {
      tokens: options.tokens.map(token),
      hash: options.hash,
    };
  };
}
