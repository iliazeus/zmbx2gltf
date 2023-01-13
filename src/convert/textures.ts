import { GltfBuilder } from "../gltf";
import { Mbx } from "../mbx";
import { toDataUri } from "./utils";

export const convertTextures = (mbx: Mbx.File, gltf: GltfBuilder): void => {
  for (const [kind, textures] of Object.entries(mbx.textures["1"] ?? {})) {
    for (const [name, texture] of Object.entries<string>(textures)) {
      convertTexture(`/textures/${kind}/${name}`, texture, gltf);
    }
  }

  for (const [kind, textures] of Object.entries(mbx.textures["2"]?.official ?? {})) {
    for (const [name, texture] of Object.entries<string>(textures)) {
      convertTexture(`/textures/${kind}/${name}`, texture, gltf);
    }
  }

  for (const [kind, textures] of Object.entries(mbx.textures["2"]?.custom ?? {})) {
    for (const [name, texture] of Object.entries<string>(textures)) {
      convertTexture(`/textures/${kind}/${name}`, texture, gltf);
    }
  }
};

const convertTexture = (path: string, texture: Mbx.Base64String, gltf: GltfBuilder): void => {
  gltf.addImage(path, { name: path, uri: toDataUri("image/png", texture) });
};
