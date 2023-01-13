import { Mbx } from "../mbx";
import { GltfBuilder } from "../gltf";

import { convertTextures } from "./textures";
import { convertGeometries } from "./geometries";
import { convertParts } from "./parts";

export const convertFile = (mbx: Mbx.File, gltf: GltfBuilder): void => {
  convertTextures(mbx, gltf);
  convertGeometries(mbx, gltf);
  convertParts(mbx, gltf);
};
