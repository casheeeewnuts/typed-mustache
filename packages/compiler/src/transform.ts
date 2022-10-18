import { Section, Token, Variable } from "./tokenizer";
import TS, { factory, SyntaxKind, TypeNode } from "typescript";

export interface TransformOptions {
  noLambdaTypeToVariable: boolean;
  noWrappedFunction: boolean;
  /**
   * TODO implement on transformSection
   * Currently, implemented as enabled.
   * So, template "{{#user}} {{name}} {{/user}}" will be compiled to
   *
   * export type TemplateValue = {
   *   user: boolean | {
   *     name: string
   *   }
   * }
   *
   * When disabled noImplicitCaptureGlobalVariable, it will be compiled to
   *
   * export type TemplateValue = {
   *   name?: string,
   *   user: boolean | {
   *     name?: string
   *   }
   * }
   */
  noImplicitCaptureGlobalVariable: boolean;
}

export function transform(option: Readonly<TransformOptions>) {
  return function (token: Token): TS.TypeElement | null {
    switch (token.type) {
      case "variable":
        return transformVariable(token, option);
      case "nonFalseValue":
        return PropertyType(`"${token.value}"`, BoolType());
      case "section":
        return transformSection(token, option);
      case "text":
      case "comment":
      case "delimiter":
      case "partial":
      case "invertedSection":
        return null;
    }
  };
}

export function merge(
  tokens: Token[],
  option: Readonly<TransformOptions>
): TS.TypeLiteralNode {
  const uniqueTokens = new Map(tokens.map((t) => [t.type + t.value, t]));
  return factory.createTypeLiteralNode(
    [...uniqueTokens.values()].map(transform(option)).filter(isTypeElement)
  );
}

function isTypeElement(e: TS.TypeElement | null): e is TS.TypeElement {
  return e != null;
}

function transformVariable(
  token: Variable,
  option: Readonly<Pick<TransformOptions, "noLambdaTypeToVariable">>
) {
  if (option.noLambdaTypeToVariable) {
    return PropertyType(token.value, StringType());
  } else {
    return PropertyType(token.value, UnionType(StringType(), LambdaType()));
  }
}

function transformSection(
  token: Section,
  option: Readonly<TransformOptions>
): any {
  if (token.children.filter((t) => t.type !== "text").length === 0) {
    if (option.noWrappedFunction) {
      return PropertyType(token.value, BoolType());
    } else {
      return PropertyType(token.value, UnionType(BoolType(), LambdaType()));
    }
  } else {
    if (option.noWrappedFunction) {
      return PropertyType(
        token.value,
        UnionType(BoolType(), ArrayType(merge(token.children, option)))
      );
    } else {
      return PropertyType(
        token.value,
        UnionType(
          BoolType(),
          WrappedFunctionType(),
          ArrayType(merge(token.children, option))
        )
      );
    }
  }
}

const StringType = () =>
  factory.createKeywordTypeNode(SyntaxKind.StringKeyword);

const BoolType = () => factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword);

const PropertyType = (name: string, type: TS.TypeNode) =>
  factory.createPropertySignature(undefined, name, undefined, type);

const UnionType = (...types: TypeNode[]) => factory.createUnionTypeNode(types);

const ArrayType = (type: TypeNode) => factory.createArrayTypeNode(type);

const LambdaType = () =>
  factory.createFunctionTypeNode(undefined, [], StringType());

const WrappedFunctionType = () =>
  factory.createFunctionTypeNode(undefined, [], WrappedFunctionReturned());

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
  );
