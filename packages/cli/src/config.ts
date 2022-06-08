import {
  TranspilerOptions,
  EmitterOptions,
} from "@casheeeewnuts/typed-mustache-compiler";
import * as path from "path";
import * as process from "process";

type EmitOptions = {
  outDir?: string;
  outFile?: string;
  emitToMonolith?: boolean;
  targets?: string[];
  match?: string | RegExp;
};

export type Options = TranspilerOptions & EmitterOptions & EmitOptions;

export const defaultConfig: Options = {
  noLambdaTypeToVariable: true,
  noWrappedFunction: true,
  noImplicitCaptureGlobalVariable: true,
  noEmitHelpers: false,
  omitTrailingSemicolon: true,
};

export function defineConfig(config: Partial<Options>): Options {
  return {
    ...defaultConfig,
    ...config,
  };
}

export const JSON_CONFIG_FILE_NAME = "typed-mustache.config.json";
export const JS_CONFIG_FILE_NAME = "typed-mustache.config.js";

export async function readConfig(): Promise<Options> {
  const jsonConfigFilePath = path.join(process.cwd(), JSON_CONFIG_FILE_NAME);
  const jsConfigFilePath = path.join(process.cwd(), JS_CONFIG_FILE_NAME);

  return readJsonConfig(jsonConfigFilePath)
    .catch(() => readJsConfig(jsConfigFilePath))
    .catch(() => defaultConfig);
}

async function readJsonConfig(path: string): Promise<Options> {
  try {
    const config = require(path);

    assertConfig(config);

    return config;
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw e;
    } else if (e instanceof Error) {
      throw new IOError(path);
    }
    throw e;
  }
}

async function readJsConfig(path: string): Promise<Options> {
  try {
    const config = import(path);

    assertConfig(config);

    return config;
  } catch (e) {
    throw e;
  }
}

function assertConfig(config: unknown): asserts config is Options {
  throw new Error("Invalid Configuration");
}

class IOError extends Error {
  constructor(path: string) {
    super(`failed to read/write file: ${path}`);
  }
}
