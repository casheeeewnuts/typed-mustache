import TS, {
  factory,
  NodeFlags,
  ScriptTarget,
  SyntaxKind,
  TypeNode,
} from "typescript"
import { TemplateSpans } from "./mustache"

const sourceText = `
type RAW_VALUE = 'text';
type ESCAPED_VALUE = 'name';

type UNESCAPED_VALUE = '&';
`

const StringType = () => factory.createKeywordTypeNode(SyntaxKind.StringKeyword)
const LambdaType = () =>
  factory.createFunctionTypeNode(undefined, [], StringType())
const StringLiteralType = (literal: string) =>
  factory.createStringLiteral(literal)
const UnionType = (...types: TypeNode[]) => factory.createUnionTypeNode(types)
const a = TS.factory.createTypeAliasDeclaration(
  undefined,
  undefined,
  "PARTIAL",
  undefined,
  TS.factory.createLiteralTypeNode(TS.factory.createStringLiteral(">"))
)
const b = TS.factory.createTypeAliasDeclaration(
  undefined,
  undefined,
  "Obj",
  undefined,
  TS.factory.createTypeLiteralNode([
    TS.factory.createPropertySignature(
      undefined,
      "a",
      undefined,
      TS.factory.createKeywordTypeNode(TS.SyntaxKind.StringKeyword)
    ),
  ])
)

function transpiler(spans?: TemplateSpans) {
  const printer = TS.createPrinter({ newLine: TS.NewLineKind.LineFeed })
  const _source = TS.createSourceFile("", sourceText, ScriptTarget.Latest)
  const source = TS.factory.createSourceFile(
    [..._source.statements, a, b],
    TS.factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.TypeExcludesFlags
  )

  // so
  // TS.forEachChild(source, console.log)

  return printer.printFile(source)
}

console.log(transpiler())
