import mustache from "mustache"
import { OpeningAndClosingTags, TemplateSpans, Token } from "./mustache"

function tokenize(
  template: string,
  tags?: OpeningAndClosingTags
): TemplateSpans {
  return mustache.parse(template, tags)
}

interface Atom {
  type: string
  start: number
  end: number
}

interface RawText extends Atom {
  type: "test"
  value: string
}

interface Variable extends Atom {
  type: "variable"
  name: string
  children: any
  what: any
}

function isRawText([span]: Token): boolean {
  return span === "text"
}

function isEscapedVariable([span]: Token): boolean {
  return span === "name"
}

function isSection([span]: Token): boolean {
  return span === "#"
}

function isInverted([span]: Token): boolean {
  return span === "^"
}

function isComment([span]: Token): boolean {
  return span === "!"
}
