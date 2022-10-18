import { emit, EmitterOptions } from "./emitter";
import { transpile, TranspilerOptions } from "./transpiler";
import { tokenize } from "./tokenizer";

export type MustacheTemplate = string;
export type TypeDeclaration = string;
export type CompilerOptions = EmitterOptions & TranspilerOptions;

const DEFAULT_COMPILER_OPTIONS: CompilerOptions = {
  noLambdaTypeToVariable: true,
  noWrappedFunction: false,
  noImplicitCaptureGlobalVariable: true,
  omitTrailingSemicolon: false,
  noEmitHelpers: false,
};

export function compile(
  template: MustacheTemplate,
  name: string,
  options?: CompilerOptions,
  tags?: [string, string]
): TypeDeclaration {
  const typeNode = transpile(tokenize(template, tags), {
    ...DEFAULT_COMPILER_OPTIONS,
    ...options,
  });

  return emit({ ...DEFAULT_COMPILER_OPTIONS, ...options })(typeNode, name);
}
