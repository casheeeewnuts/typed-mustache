import { tokenize } from "./tokenizer"
import { compile } from "./compiler"
import { emit } from "./emitter"

const template =
  "{{#users}}hello! {{name}} {{/users}}{{^users}}NO Users{{/users}} {{{license}}} {{#isPremium}}you!{{/isPremium}} {{#isAdmin?}}hi{{/isAdmin?}} {{! this is comment}} {{> element}} {{name}} {{=<m> </m>=}}"

console.log(
  emit({
    omitTrailingSemicolon: true,
    noEmitHelpers: false,
  })(
    compile(tokenize(template), {
      noLambdaTypeToVariable: true,
      noWrappedFunction: false,
      noImplicitCaptureGlobalVariable: true,
    }),
    "TemplateValues"
  )
)
