import * as uuid from "uuid";

import { Mbx } from "../mbx";
import { Gltf, GltfBuilder } from "../gltf";

import { Context } from "./context";
import { colors } from "./data/colors";

export const convertMaterial = async (
  id: number,
  normals: Mbx.TextureRef[] | undefined,
  decoration: Mbx.PartDecoration | undefined,
  gltf: GltfBuilder,
  ctx: Context
): Promise<Gltf.Index<Gltf.Material> | undefined> => {
  normals ??= [];
  decoration ??= {};

  const isSimple =
    (!ctx.options.normalMaps || normals.length === 0) &&
    (!ctx.options.decals || Object.keys(decoration).length === 0);

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

  if (ctx.options.decals && decoration.uv && decoration.color) {
    const jimp = ctx.dependencies.jimp;
    if (!jimp) throw new Error("jimp is required for decal support");

    const gltfColor = material.pbrMetallicRoughness!.baseColorFactor!;
    const byteColor = gltfColor.map((x) => Math.round(x * 255));

    const gltfImage = gltf.getImage(`/textures/color/${decoration.color.name}`);
    const jimpImage = await jimp.read(Buffer.from(gltfImage.uri!.split(",")[1], "base64"));

    const bitmap = jimpImage.bitmap.data;
    for (let i = 0; i < bitmap.length; i++) {
      const alpha = bitmap[i * 4 + 3] / 255;
      bitmap[i * 4 + 0] = Math.round(bitmap[i * 4 + 0] * alpha + byteColor[0] * (1 - alpha));
      bitmap[i * 4 + 1] = Math.round(bitmap[i * 4 + 1] * alpha + byteColor[1] * (1 - alpha));
      bitmap[i * 4 + 2] = Math.round(bitmap[i * 4 + 2] * alpha + byteColor[2] * (1 - alpha));
      bitmap[i * 4 + 3] = 0xff;
    }

    const newDataUri = await jimpImage.getBase64Async("image/png");

    delete material.pbrMetallicRoughness!.baseColorFactor;

    material.pbrMetallicRoughness!.baseColorTexture = {
      texCoord: decoration.uv,
      index: gltf.addTexture(key + "#color", {
        name: key + "#color",
        source: gltf.addImage(key + "#color", {
          name: key + "#color",
          uri: newDataUri,
        }),
        sampler: gltf.addSampler(key + "#color", {
          name: key + "#color",
          wrapS: Gltf.Const.REPEAT,
          wrapT: Gltf.Const.REPEAT,
        }),
      }),
    };
  }

  if (ctx.options.normalMaps && normals[0]) {
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
