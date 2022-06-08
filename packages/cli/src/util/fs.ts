import fs from "fs/promises";
import { promisify } from "util";
import { glob } from "glob";

export const asyncGlob = promisify(glob);

export async function readFileAsUtf8Encoded(path: string): Promise<string> {
  return fs.readFile(path, { encoding: "utf8" });
}

export const readFile = fs.readFile;
