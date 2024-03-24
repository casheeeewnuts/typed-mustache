type RAW_VALUE = "text";
type ESCAPED_VALUE = "name";
type UNESCAPED_VALUE = "&";
type SECTION = "#";
type INVERTED = "^";
type COMMENT = "!";
type PARTIAL = ">";
type EQUAL = "=";

type TemplateSpanType =
    | RAW_VALUE
    | ESCAPED_VALUE
    | SECTION
    | UNESCAPED_VALUE
    | INVERTED
    | COMMENT
    | PARTIAL
    | EQUAL;

export type TemplateSpans = Array<
    | [TemplateSpanType, string, number, number]
    | [TemplateSpanType, string, number, number, TemplateSpans, number]
    | [TemplateSpanType, string, number, number, string, number, boolean]
>;

export type Token = TemplateSpans[number];

type OpeningTag = string;
type ClosingTag = string;
export type OpeningAndClosingTags = [OpeningTag, ClosingTag];
