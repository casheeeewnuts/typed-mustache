import TS, { factory, NodeFlags, SyntaxKind, TypeNode } from "typescript"

export function emit(printer: TS.Printer, statement: TypeNode, name: string) {
  const typeAlias = factory.createTypeAliasDeclaration(
    undefined,
    [factory.createToken(SyntaxKind.ExportKeyword)],
    name,
    undefined,
    statement
  )

  const source = TS.factory.createSourceFile(
    [typeAlias],
    TS.factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.TypeExcludesFlags
  )

  return printer.printFile(source)
}
