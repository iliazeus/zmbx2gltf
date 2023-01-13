#!/usr/bin/env node

try {
  require("source-map-support/register");
} catch (error) {}

import { program } from "commander";
import * as unzipper from "unzipper";

import { createReadStream } from "fs";
import { writeFile } from "fs/promises";
import { pipeline } from "stream/promises";

import { Mbx } from "./mbx/types";
import { convertMbxToGltf } from "./convert";

program
  .name("zmbx2gltf")
  .argument("<input-file>")
  .argument("<output-file>")
  .action(async (inputFile: string, outputFile: string) => {
    const mbx: Mbx.File = await pipeline(
      createReadStream(inputFile),
      unzipper.ParseOne(),
      async (src) => {
        const buffers: Buffer[] = [];
        for await (const buffer of src) buffers.push(buffer);
        const str = Buffer.concat(buffers).toString("utf-8");
        return JSON.parse(str);
      }
    );

    const gltf = convertMbxToGltf(mbx);

    await writeFile(outputFile, JSON.stringify(gltf), "utf-8");
  });

program.parseAsync().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
