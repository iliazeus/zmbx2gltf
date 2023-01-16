import { Mbx } from "../mbx";
import { GltfBuilder } from "../gltf";

import { Context } from "./context";

import { convertTextures } from "./textures";
import { convertGeometries } from "./geometries";
import { convertParts } from "./parts";

export const convertFile = async (
  mbx: Mbx.File,
  gltf: GltfBuilder,
  ctx: Context
): Promise<void> => {
  await convertTextures(mbx, gltf, ctx);
  convertGeometries(mbx, gltf, ctx);
  await convertParts(mbx, gltf, ctx);
};
