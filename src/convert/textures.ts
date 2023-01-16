import { GltfBuilder } from "../gltf";
import { Mbx } from "../mbx";

import { Context } from "./context";
import { toDataUri } from "./utils";

export const convertTextures = async (
  mbx: Mbx.File,
  gltf: GltfBuilder,
  ctx: Context
): Promise<void> => {
  for (const [kind, textures] of Object.entries(mbx.textures["1"] ?? {})) {
    if (kind === "color" && !ctx.options.decals) continue;
    if (kind === "bump" && !ctx.options.bumpMaps) continue;
    if (kind === "normal" && !ctx.options.normalMaps) continue;

    for (const [name, texture] of Object.entries<string>(textures)) {
      await convertTexture(`/textures/${kind}/${name}`, texture, gltf, ctx);
    }
  }

  for (const [kind, textures] of Object.entries(mbx.textures["2"]?.official ?? {})) {
    if (kind === "color" && !ctx.options.decals) continue;
    if (kind === "bump" && !ctx.options.bumpMaps) continue;
    if (kind === "normal" && !ctx.options.normalMaps) continue;

    for (const [name, texture] of Object.entries<string>(textures)) {
      await convertTexture(`/textures/${kind}/${name}`, texture, gltf, ctx);
    }
  }

  for (const [kind, textures] of Object.entries(mbx.textures["2"]?.custom ?? {})) {
    if (kind === "color" && !ctx.options.decals) continue;
    if (kind === "bump" && !ctx.options.bumpMaps) continue;
    if (kind === "normal" && !ctx.options.normalMaps) continue;

    for (const [name, texture] of Object.entries<string>(textures)) {
      await convertTexture(`/textures/${kind}/${name}`, texture, gltf, ctx);
    }
  }
};

const convertTexture = async (
  path: string,
  texture: Mbx.Base64String,
  gltf: GltfBuilder,
  ctx: Context
): Promise<void> => {
  const jimp = ctx.dependencies.jimp!;

  const jimpImage = await jimp.read(Buffer.from(texture, "base64"));
  const dataUri = await jimpImage.flip(false, true).getBase64Async("image/png");
  gltf.addImage(path, { name: path, uri: dataUri });
};
