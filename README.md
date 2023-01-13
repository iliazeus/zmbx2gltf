# zmbx2gltf

a tool and a library to convert MecaBricks .zmbx files to GlTF

## Node.js usage

```ts
import { convertZmbxToGltf } from "zmbx2gltf";
import { readFile, writeFile } from "fs/promises";

async function main() {
  const inputFile = await readFile("input.zmbx");
  const gltf = await convertZmbxToGltf(inputFile);
  await writeFile("output.gltf", JSON.stringify(gltf));
}
```

## CLI usage

```
zmbx2gltf <input.zmbx> <output.gltf>
```

## Browser usage

Global `convertZmbxToGltf` and `convertMbxToGltf` functions.
They're global because I couldn't be bothered.
