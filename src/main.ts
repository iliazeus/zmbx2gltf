#!/usr/bin/env node

try {
  require("source-map-support/register");
} catch (error) {}

// import { program } from "commander";
import * as jszip from "jszip";

import { readFile, writeFile } from "fs/promises";

import { convertMbxToGltf } from "./convert";

const main = async (args: string[]) => {
  if (args.length !== 2) {
    throw new Error("usage: zmbx2gltf <input.zmbx> <output.gltf>");
  }

  const [inputFile, outputFile] = args;

  const zmbxZip = await jszip.loadAsync(await readFile(inputFile));

  const mbxString = await zmbxZip.file("scene.mbx")?.async("string");
  if (!mbxString) throw new Error("invalid file format");

  const gltf = convertMbxToGltf(JSON.parse(mbxString));
  await writeFile(outputFile, JSON.stringify(gltf), "utf-8");
};

main(process.argv.slice(2)).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
