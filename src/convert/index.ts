import { Mbx } from "../mbx";
import { Gltf, GltfBuilder } from "../gltf";

import { convertFile } from "./file";

import * as jszip from "jszip";

export const convertZmbxToGltf = async (
  zmbx: Uint8Array | Blob | ArrayBuffer
): Promise<Gltf.File> => {
  const zip = await jszip.loadAsync(zmbx);
  const mbx = await zip.file("scene.mbx")?.async("string");
  if (!mbx) throw new Error("invalid file format");
  return convertMbxToGltf(JSON.parse(mbx));
};

export const convertMbxToGltf = (mbx: Mbx.File): Gltf.File => {
  const builder = new GltfBuilder();
  convertFile(mbx, builder);
  return builder.build();
};
