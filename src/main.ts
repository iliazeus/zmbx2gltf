#!/usr/bin/env node

try {
  require("source-map-support/register");
} catch (error) {}

import { readFile, writeFile } from "fs/promises";
import { convertZmbxToGltf } from "./convert";

const main = async (args: string[]) => {
  if (args.length !== 2) {
    throw new Error("usage: zmbx2gltf <input.zmbx> <output.gltf>");
  }

  const [inputFile, outputFile] = args;

  const input = await readFile(inputFile);

  const output = await convertZmbxToGltf(input);

  await writeFile(outputFile, JSON.stringify(output), "utf-8");
};

main(process.argv.slice(2)).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
