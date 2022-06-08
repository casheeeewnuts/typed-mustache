import yargs from "yargs";
import * as fs from "fs/promises";
import * as path from "path";
import * as process from "process";
import { glob } from "glob";
import { promisify } from "util";
import { compile } from "@casheeeewnuts/typed-mustache-compiler";
import { pascalCase } from "change-case";

function parseArgs(): yargs.Argv {
  return yargs.help();
}

const asyncGlob = promisify(glob);

async function main() {
  const outdir = "./@types/mustache";
  const files = await asyncGlob("./**/*.mustache");

  await Promise.all(
    files.map(async (filePath) => {
      const template = (
        await fs.readFile(path.join(process.cwd(), filePath))
      ).toString();
      const { name } = path.parse(filePath);
      const outFilePath = path.join(outdir, `${name}.ts`);

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
