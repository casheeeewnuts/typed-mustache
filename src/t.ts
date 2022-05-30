import TS from "typescript"
import { tokenize } from "./tokenizer"
import { compile } from "./compiler"
import { emit } from "./emitter"
import mustache from "mustache"

const template =
  "{{#users}}hello! {{name}} {{/users}}{{^users}}NO Users{{/users}} {{{license}}} {{#isPremium}}you!{{/isPremium}} {{#isAdmin?}}hi{{/isAdmin?}} {{! this is comment}} {{> element}} {{name}} {{=<m> </m>=}}"

const printer = TS.createPrinter({
  newLine: TS.NewLineKind.LineFeed,
  omitTrailingSemicolon: true,
  noEmitHelpers: false,
})

console.log(
  emit(
    printer,
    compile(tokenize(template), {
      noLambdaTypeToVariable: true,
      noLambdaTypeToSection: true,
      noImplicitCaptureGlobalVariable: true,
    }),
    "TemplateValues"
  )
)
