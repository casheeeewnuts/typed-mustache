import { emit } from "./emitter"
import { transpile } from "./transpiler"
import { tokenize } from "./tokenizer"

export type MustacheTemplate = string
export type TypeDeclaration = string

export function compile(
  template: MustacheTemplate,
  name: string,
  tags?: [string, string]
): TypeDeclaration {
  const typeNode = transpile(tokenize(template, tags), {
    noLambdaTypeToVariable: true,
    noWrappedFunction: false,
    noImplicitCaptureGlobalVariable: true,
  })

  return emit({ omitTrailingSemicolon: false, noEmitHelpers: false })(
    typeNode,
    name
  )
}
