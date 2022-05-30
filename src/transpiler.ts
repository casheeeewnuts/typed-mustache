import TS, { factory, SyntaxKind, TypeNode } from "typescript"
import { Root, Token } from "./tokenizer"

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

export function transpile(token: Root): TS.TypeLiteralNode
export function transpile(token: Token): any
export function transpile(token: Root | Token): any {
  if (token.type === "root") {
    return factory.createTypeLiteralNode(token.children.map(transpile))
  } else {
    if (token.type === "text") {
      return
    } else if (token.type === "variable") {
      return factory.createPropertySignature(
        undefined,
        token.name,
        undefined,
        factory.createKeywordTypeNode(SyntaxKind.StringKeyword)
      )
    }
  }
}
