import mustache from "mustache";

function tokenize(template: string, tags?: OpeningAndClosingTags): TemplateSpans {
  return mustache.parse(template, tags)
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