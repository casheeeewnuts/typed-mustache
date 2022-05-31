import mustache from "mustache"
import { OpeningAndClosingTags, TemplateSpans } from "./mustache"

export function tokenize(template: string, tags?: OpeningAndClosingTags): Root {
  return {
    type: "root",
    children: mustache.parse(template, tags).map(transform),
  }
}

function transform(span: TemplateSpans[number]): Token {
  const [tag, value, start, end, children, tagIndex, lineHasNonSpace] = span

  if (
    lineHasNonSpace != null &&
    tagIndex != null &&
    typeof children == "string"
  ) {
    return {
      type: "partial",
      value,
      start,
      end,
      indentation: children,
      tagIndex,
      lineHasNonSpace,
    }
  } else if (Array.isArray(children)) {
    if (value.endsWith("?")) {
      return {
        type: "nonFalseValue",
        value,
        start,
        end,
        children: children.map(transform),
      }
    } else if (tag === "^") {
      return {
        type: "invertedSection",
        value,
        start,
        end,
        children: children.map(transform),
      }
    } else {
      return {
        type: "section",
        value,
        start,
        end,
        children: children.map(transform),
      }
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
        value,
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

export type Token =
  | RawText
  | Variable
  | Section
  | InvertedSection
  | Comment
  | Partial
  | Delimiter
  | NonFalseValue

interface RawText extends Atom {
  type: "text"
}

export interface Variable extends Atom {
  type: "variable"
}

export interface Section extends Atom {
  type: "section"
  children: Token[]
}

export interface InvertedSection extends Atom {
  type: "invertedSection"
  children: Token[]
}

export interface NonFalseValue extends Atom {
  type: "nonFalseValue"
  children: Token[]
}

export interface Comment extends Atom {
  type: "comment"
}

export interface Partial extends Atom {
  type: "partial"
  indentation: string
  tagIndex: number
  lineHasNonSpace: boolean
}

export interface Delimiter extends Atom {
  type: "delimiter"
}

interface Atom {
  type: string
  value: string
  start: number
  end: number
}
