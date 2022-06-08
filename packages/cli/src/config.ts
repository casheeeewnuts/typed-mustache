import {
  TranspilerOptions,
  EmitterOptions,
} from "@casheeeewnuts/typed-mustache-compiler";

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
