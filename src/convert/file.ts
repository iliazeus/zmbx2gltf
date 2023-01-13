import { Mbx } from "../mbx";
import { GltfBuilder } from "../gltf";

import { convertTextures } from "./textures";
import { convertGeometries } from "./geometries";
import { convertParts } from "./parts";
import { Options } from "./options";

export const convertFile = (mbx: Mbx.File, gltf: GltfBuilder, options: Options): void => {
  convertTextures(mbx, gltf, options);
  convertGeometries(mbx, gltf, options);
  convertParts(mbx, gltf, options);
};
