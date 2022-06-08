import * as fs from "fs/promises";
import * as path from "path";
import * as process from "process";
import yargs from "yargs";
import { compile } from "@casheeeewnuts/typed-mustache-compiler";
import { pascalCase } from "change-case";
import { asyncGlob, readFileAsUtf8Encoded } from "./util/fs";

const DEFAULT_OUTPUT_DIR = path.join(process.cwd(), "./@types/mustache");
const DEFAULT_TARGET_GLOB = "./**/*.mustache";

function parseArgs(): yargs.Argv {
  return yargs.help();
}

async function main() {
  const files = await asyncGlob("./**/*.mustache");

  await Promise.all(
    files.map(async (filePath) => {
      const template = await readFileAsUtf8Encoded(
        path.join(process.cwd(), filePath)
      );
      const { name } = path.parse(filePath);
      const outFilePath = path.join(DEFAULT_OUTPUT_DIR, `${name}.ts`);

      try {
        return await fs.writeFile(
          outFilePath,
          compile(template, `${pascalCase(name)}TemplateValues`)
        );
      } catch (e) {
        if (isIOError(e)) {
          await fs.mkdir(path.dirname(outFilePath), { recursive: true });
          return fs.writeFile(
            outFilePath,
            compile(template, `${pascalCase(name)}TemplateValues`)
          );
        }
        console.log(e);
      }
    })
  );
}

interface IOError {
  errno: number;
  code: string;
  syscall: string;
  path: string;
}

function isIOError(e: any): e is IOError {
  return e && !!e.errno && !!e.code && !!e.syscall && !!e.path;
}

main().catch(console.error);
