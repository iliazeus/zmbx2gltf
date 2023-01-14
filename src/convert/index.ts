import { Mbx } from "../mbx";
import { Gltf, GltfBuilder, GltfOptimizer } from "../gltf";

import { convertFile } from "./file";

import * as jszip from "jszip";
import { Options, getDefaultOptions } from "./options";

export { Options } from "./options";

export const convertZmbxToGltf = async (
  zmbx: Uint8Array | Blob | ArrayBuffer,
  options?: Partial<Options>
): Promise<Gltf.File> => {
  const zip = await jszip.loadAsync(zmbx);
  const mbx = await zip.file("scene.mbx")?.async("string");
  if (!mbx) throw new Error("invalid file format");
  return convertMbxToGltf(JSON.parse(mbx), options);
};

export const convertMbxToGltf = (mbx: Mbx.File, options?: Partial<Options>): Gltf.File => {
  const fullOptions = { ...getDefaultOptions(), ...options };

  const builder = new GltfBuilder();
  convertFile(mbx, builder, fullOptions);
  const gltf = builder.build();

  if (!fullOptions.optimize) return gltf;

  const optimizer = new GltfOptimizer(gltf);

  optimizer.collectUnused({
    textures: true,
    samplers: true,
    images: true,
    texCoords: true,
    accessors: true,
    bufferViews: true,
    buffers: true,
  });

  optimizer.deduplicate({
    buffers: true,
    bufferViews: true,
    accessors: true,
    images: true,
    samplers: true,
    textures: true,
  });

  return optimizer.file;
};
