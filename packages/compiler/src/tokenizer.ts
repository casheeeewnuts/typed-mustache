import mustache from "mustache";
import { OpeningAndClosingTags, Token as MustacheToken } from "./mustache";

export function tokenize(template: string, tags?: OpeningAndClosingTags): Root {
    return {
        children: mustache.parse(template, tags).map(toToken).filter(isToken),
    };
}

function toToken(span: MustacheToken): Token | null {
    const [tag, value, start, end, children, tagIndex, lineHasNonSpace] = span;

    if (value == "") {
        return null;
    }

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
        };
    }

    if (Array.isArray(children)) {
        if (value.endsWith("?")) {
            return {
                type: "nonFalseValue",
                value,
                start,
                end,
                children: children.map(toToken).filter(isToken),
            };
        }

        if (tag === "^") {
            return {
                type: "invertedSection",
                value,
                start,
                end,
                children: children.map(toToken).filter(isToken),
            };
        }

        return {
            type: "section",
            value,
            start,
            end,
            children: children.map(toToken).filter(isToken),
        };
    }

    if (tag === "!") {
        return {
            type: "comment",
            value,
            start,
            end,
        };
    }

    if (tag === "text") {
        return {
            type: "text",
            value,
            start,
            end,
        };
    }

    if (tag === "=") {
        return {
            type: "delimiter",
            value,
            start,
            end,
        };
    }

    if (tag === "name" || tag === "&") {
        return {
            type: "variable",
            value,
            start,
            end,
        };
    }

    throw new Error(`Unreachable Statement`);
}

function isToken(maybeToken: Token | null): maybeToken is Token {
    return maybeToken != null;
}

export interface Root {
    children: Token[];
}

export type Token =
    | RawText
    | Variable
    | Section
    | InvertedSection
    | Comment
    | Partial
    | Delimiter
    | NonFalseValue;

interface Atom {
    type: string;
    value: string;
    start: number;
    end: number;
}

export interface RawText extends Atom {
    type: "text";
}

export interface Variable extends Atom {
    type: "variable";
}

export interface Section extends Atom {
    type: "section";
    children: Token[];
}

export interface InvertedSection extends Atom {
    type: "invertedSection";
    children: Token[];
}

export interface NonFalseValue extends Atom {
    type: "nonFalseValue";
    children: Token[];
}

export interface Comment extends Atom {
    type: "comment";
}

export interface Partial extends Atom {
    type: "partial";
    indentation: string;
    tagIndex: number;
    lineHasNonSpace: boolean;
}

export interface Delimiter extends Atom {
    type: "delimiter";
}
