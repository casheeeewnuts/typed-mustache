import TS, { factory, NodeFlags, SyntaxKind, TypeNode } from "typescript";

export function emit(printerOptions: EmitterOptions) {
  const printer = TS.createPrinter(printerOptions);

  return function (statement: TypeNode, name: string) {
    const typeAlias = factory.createTypeAliasDeclaration(
      undefined,
      [Export()],
      name,
      undefined,
      statement
    );

    const source = TS.factory.createSourceFile(
      [typeAlias],
      TS.factory.createToken(SyntaxKind.EndOfFileToken),
      NodeFlags.TypeExcludesFlags
    );

    return printer.printFile(source);
  };
}

export type EmitterOptions = Omit<
  TS.PrinterOptions,
  "removeComments" | "newLine"
>;

const Export = () => factory.createToken(SyntaxKind.ExportKeyword);
