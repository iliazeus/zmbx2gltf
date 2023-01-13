import * as uuid from "uuid";

import { Gltf, GltfBuilder } from "../gltf";
import { Mbx } from "../mbx";
import { colors } from "./data/colors";

export const convertMaterial = (
  id: number,
  normals: Mbx.TextureRef[] | undefined,
  gltf: GltfBuilder
): Gltf.Index<Gltf.Material> | undefined => {
  normals ??= [];

  const isSimple = normals.length === 0;

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
        extensions: {
          KHR_materials_ior: {
            ior: 1.54,
          },
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
        extensions: {
          KHR_materials_ior: {
            ior: 1.54,
          },
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
        extensions: {
          KHR_materials_ior: {
            ior: 1.5,
          },
        },
      };
      break;

    default:
      console.warn("add this material");
      console.warn(color);
  }

  if (!material) return undefined;

  if (normals[0]) {
    material.normalTexture = {
      texCoord: normals[0].uv,
      index: gltf.addTexture(key, {
        name: key,
        source: gltf.getImageIndex(`/textures/normal/${normals[0].file}`),
        sampler: gltf.addSampler(key, {
          name: key,
          wrapS: normals[0].repeat ? Gltf.Const.REPEAT : Gltf.Const.CLAMP_TO_EDGE,
          wrapT: normals[0].repeat ? Gltf.Const.REPEAT : Gltf.Const.CLAMP_TO_EDGE,
        }),
      }),
    };
  }

  return gltf.addMaterial(key, material);
};
