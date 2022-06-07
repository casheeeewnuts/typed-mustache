import TS, { factory, SyntaxKind, TypeElement, TypeNode } from "typescript"
import { Root, Section, Token, Variable } from "./tokenizer"

export interface TranspilerOptions {
  noLambdaTypeToVariable: boolean
  noWrappedFunction: boolean
  noImplicitCaptureGlobalVariable: boolean
}

export function transpile(
  token: Root,
  option: Readonly<TranspilerOptions>
): TS.TypeLiteralNode {
  return merge(token.children, option)
}

function merge(
  tokens: Token[],
  option: Readonly<TranspilerOptions>
): TS.TypeLiteralNode {
  const uniqueTokens = new Map(tokens.map((t) => [t.type + t.value, t]))
  return factory.createTypeLiteralNode(
    [...uniqueTokens.values()]
      .map((t) => transform(t, option))
      .filter((t) => t != null) as TypeElement[]
  )
}

function transform(
  token: Token,
  option: Readonly<TranspilerOptions>
): TS.TypeElement | null {
  switch (token.type) {
    case "variable":
      return transformVariable(token, option)
    case "nonFalseValue":
      return PropertyType(`"${token.value}"`, BoolType())
    case "section":
      return transformSection(token, option)
    case "text":
    case "comment":
    case "delimiter":
    case "partial":
    case "invertedSection":
      return null
    default:
      throw new Error("Logic Exception")
  }
}

function transformVariable(
  token: Variable,
  option: Readonly<Pick<TranspilerOptions, "noLambdaTypeToVariable">>
) {
  if (option.noLambdaTypeToVariable) {
    return PropertyType(token.value, StringType())
  } else {
    return PropertyType(token.value, UnionType(StringType(), LambdaType()))
  }
}

function transformSection(
  token: Section,
  option: Readonly<TranspilerOptions>
): any {
  if (token.children.filter((t) => t.type !== "text").length === 0) {
    if (option.noWrappedFunction) {
      return PropertyType(token.value, BoolType())
    } else {
      return PropertyType(token.value, UnionType(BoolType(), LambdaType()))
    }
  } else {
    if (option.noWrappedFunction) {
      return PropertyType(
        token.value,
        UnionType(BoolType(), ArrayType(merge(token.children, option)))
      )
    } else {
      return PropertyType(
        token.value,
        UnionType(
          BoolType(),
          WrappedFunctionType(),
          ArrayType(merge(token.children, option))
        )
      )
    }
  }
}

const StringType = () => factory.createKeywordTypeNode(SyntaxKind.StringKeyword)
const BoolType = () => factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword)
const PropertyType = (name: string, type: TS.TypeNode) =>
  factory.createPropertySignature(undefined, name, undefined, type)
const UnionType = (...types: TypeNode[]) => factory.createUnionTypeNode(types)
const ArrayType = (type: TypeNode) => factory.createArrayTypeNode(type)
const LambdaType = () =>
  factory.createFunctionTypeNode(undefined, [], StringType())

const WrappedFunctionType = () =>
  factory.createFunctionTypeNode(undefined, [], WrappedFunctionReturned())
const WrappedFunctionReturned = () =>
  factory.createFunctionTypeNode(
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        "text",
        undefined,
        StringType()
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        "render",
        undefined,
        factory.createFunctionTypeNode(
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              "text",
              undefined,
              StringType()
            ),
          ],
          StringType()
        )
      ),
    ],
    StringType()
  )
