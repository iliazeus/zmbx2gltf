#!/usr/bin/env node

try {
  require("source-map-support/register");
} catch (error) {}

import { program } from "commander";
import * as jszip from "jszip";

import { readFile, writeFile } from "fs/promises";

import { convertMbxToGltf } from "./convert";

program
  .name("zmbx2gltf")
  .argument("<input-file>")
  .argument("<output-file>")
  .action(async (inputFile: string, outputFile: string) => {
    const zmbxZip = await jszip.loadAsync(await readFile(inputFile));

    const mbxString = await zmbxZip.file("scene.mbx")?.async("string");
    if (!mbxString) throw new Error("invalid file format");

    const gltf = convertMbxToGltf(JSON.parse(mbxString));
    await writeFile(outputFile, JSON.stringify(gltf), "utf-8");
  });

program.parseAsync().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
