import TS, { factory } from "typescript";
import { Root, Token } from "./tokenizer";
import { transform } from "./transform";

export { transform } from "./transform";

export interface TranspilerOptions {
  noLambdaTypeToVariable: boolean;
  noWrappedFunction: boolean;
  noImplicitCaptureGlobalVariable: boolean;
}

export function transpile(
  token: Root,
  option: Readonly<TranspilerOptions>
): TS.TypeLiteralNode {
  return merge(token.children, option);
}

export function merge(
  tokens: Token[],
  option: Readonly<TranspilerOptions>
): TS.TypeLiteralNode {
  const uniqueTokens = new Map(tokens.map((t) => [t.type + t.value, t]));
  return factory.createTypeLiteralNode(
    [...uniqueTokens.values()]
      .map((t) => transform(t, option))
      .filter(isTypeElement)
  );
}

function isTypeElement(e: TS.TypeElement | null): e is TS.TypeElement {
  return e != null;
}
