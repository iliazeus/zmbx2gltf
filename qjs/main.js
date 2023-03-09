import * as std from "std";
import * as os from "os";

import { program } from "../../../lib/commander/index.js";
import { readFileSync, writeFileSync } from "../../../lib/fs/index.js";

// @ts-ignore
globalThis.setTimeout = os.setTimeout;
globalThis.clearTimeout = os.clearTimeout;

import "../zmbx2gltf.bundle.mjs";

program.name("zmbx2gltf");
program.version("0.1.6");
program.description("a tool to convert MecaBricks .zmbx files to glTF");

program
  .option("-i --input <input-file>", ".zmbx file to convert; if not present, read stdin")
  .option("-o --output <output-file>", ".gltf file to output; if not present, write to stdout")
  .option("--logos", "whether to keep logos on knobs", false)
  .option("--normal-maps", "whether to convert normal maps", false)
  .option("--decals", "whether to convert decals", true)
  .option("-O --optimize", "whether to try to optimize the glTF file", true)
  .action(async (options) => {
    const { input = "-", output = "-", ...convertOptions } = options;

    const inputBytes = readFileSync(input);
    const outputGltf = await globalThis.convertZmbxToGltf(inputBytes, convertOptions);
    writeFileSync(output, JSON.stringify(outputGltf), "utf-8");
  });

program.parseAsync().catch((error) => {
  std.puts(String(error) + "\n");
  std.puts(error.stack);
  std.exit(1);
});
