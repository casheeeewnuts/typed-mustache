import mustache from "mustache"
import { OpeningAndClosingTags, TemplateSpans } from "./mustache"

export function tokenize(template: string, tags?: OpeningAndClosingTags): Root {
  return {
    type: "root",
    children: mustache.parse(template, tags).map(transform),
  }
}

function transform(span: TemplateSpans[number]): Token {
  const [tag, value, start, end, children, what, e] = span

  if (e && what && typeof children == "string") {
    return {
      type: "partial",
      name: value,
      start,
      end,
      nazo: children,
      nazo2: what,
      nazo3: e,
    }
  } else if (Array.isArray(children)) {
    return {
      type: "section",
      name: value,
      start,
      end,
      children: children.map(transform),
    }
  } else {
    if (tag === "!") {
      return {
        type: "comment",
        value,
        start,
        end,
      }
    } else if (tag === "text") {
      return {
        type: "text",
        value,
        start,
        end,
      }
    } else if (tag === "=") {
      return {
        type: "delimiter",
        value,
        start,
        end,
      }
    } else if (tag === "name" || tag === "&") {
      return {
        type: "variable",
        name: value,
        start,
        end,
      }
    } else {
      throw new Error(`Logic Exception ${[tag]}`)
    }
  }
}

export interface Root {
  type: "root"
  children: Token[]
}

export type Token = RawText | Variable | Section | Comment | Partial | Delimiter

interface RawText extends Atom {
  type: "text"
  value: string
}

interface Variable extends Atom {
  type: "variable"
  name: string
}

interface Section extends Atom {
  type: "section"
  name: string
  children: Token[]
}

interface Comment extends Atom {
  type: "comment"
  value: string
}

interface Partial extends Atom {
  type: "partial"
  name: string
  nazo: string
  nazo2: number
  nazo3: boolean
}

interface Delimiter extends Atom {
  type: "delimiter"
  value: string
}

interface Atom {
  type: string
  start: number
  end: number
}
