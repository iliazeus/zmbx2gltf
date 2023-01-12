import { Mbx } from "./mbx";
import { MbxExtractor } from "./mbx-extractor";

import { Gltf } from "./gltf";
import { GltfBuilder } from "./gltf-builder";

export function convertMbxToGltf(
  mbx: Mbx.File,
  options?: {
    paranoid?: boolean;
  }
): Gltf.File {
  const extractor = new MbxExtractor(mbx);
  const builder = new GltfBuilder();

  builder.setMetadata({ mbx: mbx.metadata });

  for (const [path, data] of extractor.getTextures()) {
    builder.addImage(path, {
      name: path,
      data: "data:image/png;base64," + data,
    });
  }

  for (const [path, array] of extractor.getVertices()) {
    if (array.length % 3 !== 0) throw new RangeError();

    const data = Buffer.from(new Float32Array(array).buffer);

    const bufferIndex = builder.addBuffer(path, {
      byteLength: data.byteLength,
      data: "data:application/octet-stream;base64," + data.toString("base64"),
    });

    const bufferViewIndex = builder.addBufferView(path, {
      buffer: bufferIndex,
      byteOffset: 0,
      byteLength: data.byteLength,
      target: Gltf.Const.ARRAY_BUFFER,
    });

    builder.addAccessor(path, {
      bufferView: bufferViewIndex,
      byteOffset: 0,
      count: array.length / 3,
      type: "VEC3",
      componentType: Gltf.Const.F32,
    });
  }

  for (const [path, array] of extractor.getFaces()) {
    if (array.length === 0) throw new RangeError();

    const isQuad = Boolean(array[0] & Mbx.FaceFlags.QUAD);
    const hasMaterial = Boolean(array[0] & Mbx.FaceFlags.MATERIALS);
    const hasUvs = Boolean(array[0] & Mbx.FaceFlags.UVS);
    const hasNormals = Boolean(array[0] & Mbx.FaceFlags.NORMALS);
    const hasColors = Boolean(array[0] & Mbx.FaceFlags.COLORS);

    const vertexesPerFace = isQuad ? 4 : 3;

    const recordSize =
      1 +
      vertexesPerFace +
      (hasMaterial ? 1 : 0) +
      (hasUvs ? 3 * vertexesPerFace : 0) +
      (hasNormals ? vertexesPerFace : 0) +
      (hasColors ? vertexesPerFace : 0);

    const recordCount = array.length / recordSize;

    if (!Number.isInteger(recordCount)) throw new RangeError();

    if (options?.paranoid) {
      // must have same face flags
      for (let i = recordSize; i < array.length; i += recordSize) {
        if (array[i - recordSize] !== array[i]) throw new RangeError();
      }

      // must have same material
      if (hasMaterial) {
        for (let i = recordSize + vertexesPerFace + 1; i < array.length; i += recordSize) {
          if (array[i - recordSize] !== array[i]) throw new RangeError();
        }
      }
    }

    const bufferBytes = Buffer.from(new Uint16Array(array).buffer);

    const bufferIndex = builder.addBuffer(path, {
      name: path,
      byteLength: bufferBytes.byteLength,
      data: "data:application/octet-stream;base64," + bufferBytes.toString("base64"),
    });

    // TODO
  }

  return builder.build();
}
