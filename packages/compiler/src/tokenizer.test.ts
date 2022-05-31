import { describe, it, expect } from "vitest"
import { tokenize } from "./tokenizer"

describe("Test Tokenizer", () => {
  it("should return partial when given '{{> user}}'", () => {
    const tokens = tokenize("{{> user}}")
    const [token] = tokens.children

    expect(token).not.toBeUndefined()
    expect(token.type).toMatch("partial")
  })

  it("should return text when given 'hello!'", () => {
    const [token] = tokenize("hello!").children

    expect(token).not.toBeUndefined()
    expect(token.type).toMatch("text")
    expect(token.value).toMatch("hello!")
  })

  it("should return variable when given '{{ name }}'", () => {
    const [token] = tokenize("{{ name }}").children

    expect(token).not.toBeUndefined()
    expect(token.type).toMatch("variable")
    expect(token.value).toMatch("name")
  })
})
