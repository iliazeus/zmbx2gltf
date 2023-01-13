import { Gltf, GltfBuilder } from "../gltf";
import { colors } from "./data/colors";

export const convertMaterial = (
  id: number,
  gltf: GltfBuilder
): Gltf.Index<Gltf.Material> | undefined => {
  const key = `#/materials/${id}`;
  if (gltf.hasMaterial(key)) return gltf.getMaterialIndex(key);

  const color = colors.find((x) => x.legoId === id);
  if (!color) {
    console.warn("material not found: " + id);
    return undefined;
  }

  switch (color.material) {
    case "Solid":
      return gltf.addMaterial(key, {
        name: color.legoName,
        pbrMetallicRoughness: {
          baseColorFactor: [color.r / 255, color.g / 255, color.b / 255, 1.0],
          metallicFactor: 0.2,
          roughnessFactor: 0.25,
        },
      });

    case "Transparent":
      return gltf.addMaterial(key, {
        name: color.legoName,
        alphaMode: "BLEND",
        doubleSided: true,
        pbrMetallicRoughness: {
          baseColorFactor: [color.r / 255, color.g / 255, color.b / 255, 0.5],
          metallicFactor: 0.4,
          roughnessFactor: 0.25,
        },
      });

    case "Rubber":
      return gltf.addMaterial(key, {
        name: color.legoName,
        pbrMetallicRoughness: {
          baseColorFactor: [color.r / 255, color.g / 255, color.b / 255, 1.0],
          metallicFactor: 0.1,
          roughnessFactor: 0.6,
        },
      });

    default:
      console.warn("add this material");
      console.warn(color);
      return undefined;
  }
};
