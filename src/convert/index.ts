import { Mbx } from "../mbx";
import { Gltf, GltfBuilder } from "../gltf";

import { convertFile } from "./file";

export const convertMbxToGltf = (mbx: Mbx.File): Gltf.File => {
  const builder = new GltfBuilder();
  convertFile(mbx, builder);
  return builder.build();
};
