import TS from "typescript";
import { Root } from "./tokenizer";
import { merge, transform, TransformOptions } from "./transform";

export { transform } from "./transform";

export type TranspilerOptions = TransformOptions;

export function transpile(
  token: Root,
  option: Readonly<TranspilerOptions>
): TS.TypeLiteralNode {
  return merge(token.children, option);
}
