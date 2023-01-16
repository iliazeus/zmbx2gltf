import { Mbx } from "../mbx";
import { Gltf, GltfBuilder, GltfOptimizer } from "../gltf";

import { convertFile } from "./file";
import { Dependencies, Options, createContext } from "./context";

export { Dependencies, Options } from "./context";

export const convertZmbxToGltf = async (args: {
  zmbx: Uint8Array | Blob | ArrayBuffer;
  options?: Options;
  dependencies?: Dependencies;
}): Promise<Gltf.File> => {
  const ctx = await createContext(args);

  if (!ctx.dependencies.jszip) {
    throw new Error("jszip is required to work with zmbx");
  }

  const zip = await ctx.dependencies.jszip.loadAsync(args.zmbx);

  const mbx = await zip.file("scene.mbx")?.async("string");
  if (!mbx) throw new Error("invalid file format");

  return convertMbxToGltf({ mbx: JSON.parse(mbx), ...ctx });
};

export const convertMbxToGltf = async (args: {
  mbx: Mbx.File;
  options?: Options;
  dependencies?: Dependencies;
}): Promise<Gltf.File> => {
  const ctx = await createContext(args);

  const builder = new GltfBuilder();
  await convertFile(args.mbx, builder, ctx);
  const gltf = builder.build();

  if (!ctx.options.optimize) return gltf;

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
