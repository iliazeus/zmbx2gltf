import { Gltf } from "../gltf";

export const toDataUri = (mime: string, data: string | { buffer: ArrayBufferLike }): string => {
  if (typeof data === "string") return `data:${mime};base64,${data}`;
  return `data:${mime};base64,${Buffer.from(data.buffer).toString("base64")}`;
};

// prettier-ignore
export const transpose = (m: Gltf.Matrix4x4) => [
  m[0], m[4], m[8], m[12],
  m[1], m[5], m[9], m[13],
  m[2], m[6], m[10], m[14],
  m[3], m[7], m[11], m[15],
];
