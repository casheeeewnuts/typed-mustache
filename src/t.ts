import TS from "typescript"
import { tokenize } from "./tokenizer"
import { transpile } from "./transpiler"
import { emit } from "./emitter"

const template =
  "{{#users}}hello! {{name}} {{/users}}{{^users}}NO Users{{/users}} {{{license}}} {{#isPremium}}you!{{/isPremium}} {{#isAdmin?}}hi{{/isAdmin?}} {{! this is comment}} {{> element}} {{name}} {{=<m> </m>=}}"
const test = "{{name}}"

// console.log(mustache.parse(template))
// console.log(transpile(tokenize(test)))
const printer = TS.createPrinter({
  newLine: TS.NewLineKind.LineFeed,
})

console.log(emit(printer, transpile(tokenize(test)), "TemplateValues"))
