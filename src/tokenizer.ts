import mustache from "mustache"
import { OpeningAndClosingTags, TemplateSpans } from "./mustache"

export function tokenize(
  template: string,
  tags?: OpeningAndClosingTags
): Token[] {
  return mustache.parse(template, tags).map(transform)
}

function transform(span: TemplateSpans[number]): Token {
  const [tag, value, start, end, children, what, e] = span

  if (children == null) {
    return {
      type: "text",
      value,
      start,
      end,
    }
  } else if (Array.isArray(children)) {
    return {
      type: "variable",
      name: value,
      start,
      end,
      children: children.map(transform),
      what: 0,
    }
  } else {
    return {
      type: "text",
      value,
      start,
      end,
    }
  }
}

type Token = RawText | Variable

interface RawText extends Atom {
  type: "text"
  value: string
}

interface Variable extends Atom {
  type: "variable"
  name: string
  children: Token[]
  what: any
}

interface Atom {
  type: string
  start: number
  end: number
}
