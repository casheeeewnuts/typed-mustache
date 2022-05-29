import mustache, { render } from "mustache"

const template = "hello! {{#age}}ki{{/age}}"

console.log(mustache.parse(template))
console.log(
  mustache.render(template, {
    age: () => (text: string, render: (text: string) => string) =>
      `ki${render(text)}ki`,
  })
)
