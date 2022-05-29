import mustache, { render } from "mustache"
import { tokenize } from "./tokenizer"

const template = "hello! {{#age}}ki{{/age}}"

console.log(JSON.stringify(mustache.parse(template), null, 2))
console.log(JSON.stringify(tokenize(template), null, 2))
// console.log(
//   mustache.render(template, {
//     age: () => (text: string, render: (text: string) => string) =>
//       `ki${render(text)}ki`,
//   })
// )
