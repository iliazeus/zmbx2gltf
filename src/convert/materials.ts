import { Gltf, GltfBuilder } from "../gltf";
import { colors } from "./data/colors";

export const convertMaterial = (
  id: number,
  gltf: GltfBuilder
): Gltf.Index<Gltf.Material> | undefined => {
  const key = `#/materials/${id}`;
  if (gltf.hasMaterial(key)) return gltf.getMaterialIndex(key);

  const color = colors[id];
  if (!color) {
    console.warn("material not found: " + id);
    return undefined;
  }

  switch (color.type) {
    case "solid":
      return gltf.addMaterial(key, {
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
      });

    case "transparent":
      return gltf.addMaterial(key, {
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
      });

    case "rubber":
      return gltf.addMaterial(key, {
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
      });

    default:
      console.warn("add this material");
      console.warn(color);
      return undefined;
  }
};
