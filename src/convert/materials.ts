import * as uuid from "uuid";

import { Gltf, GltfBuilder } from "../gltf";
import { Mbx } from "../mbx";
import { colors } from "./data/colors";
import { Options } from "./options";

export const convertMaterial = (
  id: number,
  normals: Mbx.TextureRef[] | undefined,
  decoration: Mbx.PartDecoration | undefined,
  gltf: GltfBuilder,
  options: Options
): Gltf.Index<Gltf.Material> | undefined => {
  normals ??= [];
  decoration ??= {};

  const isSimple =
    (!options.normalMaps || normals.length === 0) &&
    (!options.decals || Object.keys(decoration).length === 0);

  const key = `/materials/${isSimple ? id : uuid.v4()}`;

  if (isSimple && gltf.hasMaterial(key)) return gltf.getMaterialIndex(key);

  const color = colors[id];
  if (!color) {
    console.warn("material not found: " + id);
    return undefined;
  }

  let material: Gltf.Material | undefined;
  switch (color.type) {
    case "solid":
      material = {
        name: color.name,
        pbrMetallicRoughness: {
          baseColorFactor: color.color,
          metallicFactor: 0.0,
          roughnessFactor: 0.1,
        },
      };
      break;

    case "transparent":
      material = {
        name: color.name,
        alphaMode: "BLEND",
        pbrMetallicRoughness: {
          baseColorFactor: color.color,
          metallicFactor: 0.0,
          roughnessFactor: 0.0,
        },
      };
      break;

    case "rubber":
      material = {
        name: color.name,
        pbrMetallicRoughness: {
          baseColorFactor: color.color,
          metallicFactor: 0.0,
          roughnessFactor: 0.75,
        },
      };
      break;

    default:
      console.warn("add this material");
      console.warn(color);
  }

  if (!material) return undefined;

  if (options.decals && decoration.uv && decoration.color) {
    delete material.pbrMetallicRoughness!.baseColorFactor;

    material.pbrMetallicRoughness!.baseColorTexture = {
      texCoord: decoration.uv,
      index: gltf.addTexture(key + "#color", {
        name: key + "#color",
        source: gltf.getImageIndex(`/textures/color/${decoration.color.name}`),
        sampler: gltf.addSampler(key + "#color", {
          name: key + "#color",
          wrapS: Gltf.Const.CLAMP_TO_EDGE,
          wrapT: Gltf.Const.CLAMP_TO_EDGE,
        }),
      }),
    };
  }

  if (options.normalMaps && normals[0]) {
    material.normalTexture = {
      texCoord: normals[0].uv,
      index: gltf.addTexture(key + "#normals", {
        name: key + "#normals",
        source: gltf.getImageIndex(`/textures/normal/${normals[0].file}`),
        sampler: gltf.addSampler(key + "#normals", {
          name: key + "#normals",
          wrapS: normals[0].repeat ? Gltf.Const.REPEAT : Gltf.Const.CLAMP_TO_EDGE,
          wrapT: normals[0].repeat ? Gltf.Const.REPEAT : Gltf.Const.CLAMP_TO_EDGE,
        }),
      }),
    };
  }

  return gltf.addMaterial(key, material);
};
