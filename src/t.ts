import mustache from "mustache"

const template = "hello! {{age}} {{#users}}{{name}}{{/users}} {{^users}}{{/users}} {{user.name}} {{{ kinf }}}"

console.log(mustache.parse(template))
console.log(mustache.render(template, {
  age: "shu",
  users: [
    {
      name: "kei"
    },
    {
      name: "hei"
    }
  ],
  user: {
    name: "mustache"
  }
}))