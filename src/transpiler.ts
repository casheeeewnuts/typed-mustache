import TS, {NodeFlags, ScriptTarget, SyntaxKind} from "typescript"
import {TemplateSpans} from "./mustache";

const sourceText = `
type RAW_VALUE = 'text';
type ESCAPED_VALUE = 'name';
type UNESCAPED_VALUE = '&';
`

const a = TS.factory.createTypeAliasDeclaration(undefined, undefined, "PARTIAL", undefined, TS.factory.createLiteralTypeNode(TS.factory.createStringLiteral("&")))
function transpiler(spans?: TemplateSpans) {
  const _source = TS.createSourceFile("", sourceText, ScriptTarget.Latest)
  const source = TS.factory.createSourceFile([..._source.statements, a], TS.factory.createToken(SyntaxKind.EndOfFileToken), NodeFlags.TypeExcludesFlags)
  // so
  // TS.forEachChild(source, console.log)
}

transpiler()