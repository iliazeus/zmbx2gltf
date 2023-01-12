import { Mbx } from "./mbx";
import { MbxExtractor } from "./mbx-extractor";

import { Gltf } from "./gltf";
import { GltfBuilder } from "./gltf-builder";

import * as assert from "assert/strict";

const arrayToDataUri = (mime: string, array: { buffer: ArrayBufferLike }): string =>
  `data:${mime};base64,${Buffer.from(array.buffer).toString("base64")}`;

const convertGeometry = (mbx: Mbx.Geometry) => {
  const headFlags = {
    isQuad: Boolean(mbx.faces[0] & Mbx.FaceFlags.QUAD),
    hasMaterial: Boolean(mbx.faces[0] & Mbx.FaceFlags.MATERIALS),
    hasUvs: Boolean(mbx.faces[0] & Mbx.FaceFlags.UVS),
    hasNormals: Boolean(mbx.faces[0] & Mbx.FaceFlags.NORMALS),
    hasColors: Boolean(mbx.faces[0] & Mbx.FaceFlags.COLORS),
  };

  const indices: number[] = [];
  const positions = new Float32Array(mbx.vertices);
  const normals = headFlags.hasNormals ? new Float32Array(positions.length) : undefined;

  const uvLayerCount = mbx.uvs?.length ?? 0;

  let off = 0;
  while (off < mbx.faces.length) {
    assert.equal(mbx.faces[0] & ~Mbx.FaceFlags.QUAD, mbx.faces[off] & ~Mbx.FaceFlags.QUAD);

    const flags = {
      isQuad: Boolean(mbx.faces[off] & Mbx.FaceFlags.QUAD),
      hasMaterial: Boolean(mbx.faces[off] & Mbx.FaceFlags.MATERIALS),
      hasUvs: Boolean(mbx.faces[off] & Mbx.FaceFlags.UVS),
      hasNormals: Boolean(mbx.faces[off] & Mbx.FaceFlags.NORMALS),
      hasColors: Boolean(mbx.faces[off] & Mbx.FaceFlags.COLORS),
    };

    if (flags.isQuad) {
      off += 1;

      indices.push(mbx.faces[off + 0], mbx.faces[off + 1], mbx.faces[off + 2]);
      indices.push(mbx.faces[off + 2], mbx.faces[off + 3], mbx.faces[off + 0]);
      off += 4;

      if (flags.hasMaterial) {
        off += 1;
      }

      if (flags.hasUvs) {
        off += 4 * uvLayerCount;
      }

      if (flags.hasNormals) {
        normals![indices[indices.length - 6] * 3 + 0] = mbx.normals[mbx.faces[off + 0] * 3 + 0];
        normals![indices[indices.length - 6] * 3 + 1] = mbx.normals[mbx.faces[off + 0] * 3 + 1];
        normals![indices[indices.length - 6] * 3 + 2] = mbx.normals[mbx.faces[off + 0] * 3 + 2];
        normals![indices[indices.length - 5] * 3 + 0] = mbx.normals[mbx.faces[off + 1] * 3 + 0];
        normals![indices[indices.length - 5] * 3 + 1] = mbx.normals[mbx.faces[off + 1] * 3 + 1];
        normals![indices[indices.length - 5] * 3 + 2] = mbx.normals[mbx.faces[off + 1] * 3 + 2];
        normals![indices[indices.length - 4] * 3 + 0] = mbx.normals[mbx.faces[off + 2] * 3 + 0];
        normals![indices[indices.length - 4] * 3 + 1] = mbx.normals[mbx.faces[off + 2] * 3 + 1];
        normals![indices[indices.length - 4] * 3 + 2] = mbx.normals[mbx.faces[off + 2] * 3 + 2];

        normals![indices[indices.length - 3] * 3 + 0] = mbx.normals[mbx.faces[off + 2] * 3 + 0];
        normals![indices[indices.length - 3] * 3 + 1] = mbx.normals[mbx.faces[off + 2] * 3 + 1];
        normals![indices[indices.length - 3] * 3 + 2] = mbx.normals[mbx.faces[off + 2] * 3 + 2];
        normals![indices[indices.length - 2] * 3 + 0] = mbx.normals[mbx.faces[off + 3] * 3 + 0];
        normals![indices[indices.length - 2] * 3 + 1] = mbx.normals[mbx.faces[off + 3] * 3 + 1];
        normals![indices[indices.length - 2] * 3 + 2] = mbx.normals[mbx.faces[off + 3] * 3 + 2];
        normals![indices[indices.length - 1] * 3 + 0] = mbx.normals[mbx.faces[off + 0] * 3 + 0];
        normals![indices[indices.length - 1] * 3 + 1] = mbx.normals[mbx.faces[off + 0] * 3 + 1];
        normals![indices[indices.length - 1] * 3 + 2] = mbx.normals[mbx.faces[off + 0] * 3 + 2];

        off += 4;
      }

      if (flags.hasColors) {
        off += 4;
      }
    } else {
      off += 1;

      indices.push(mbx.faces[off + 0], mbx.faces[off + 1], mbx.faces[off + 2]);
      off += 3;

      if (flags.hasMaterial) {
        off += 1;
      }

      if (flags.hasUvs) {
        off += 3 * uvLayerCount;
      }

      if (flags.hasNormals) {
        normals![indices[indices.length - 3] * 3 + 0] = mbx.normals[mbx.faces[off + 0] * 3 + 0];
        normals![indices[indices.length - 3] * 3 + 1] = mbx.normals[mbx.faces[off + 0] * 3 + 1];
        normals![indices[indices.length - 3] * 3 + 2] = mbx.normals[mbx.faces[off + 0] * 3 + 2];
        normals![indices[indices.length - 2] * 3 + 0] = mbx.normals[mbx.faces[off + 1] * 3 + 0];
        normals![indices[indices.length - 2] * 3 + 1] = mbx.normals[mbx.faces[off + 1] * 3 + 1];
        normals![indices[indices.length - 2] * 3 + 2] = mbx.normals[mbx.faces[off + 1] * 3 + 2];
        normals![indices[indices.length - 1] * 3 + 0] = mbx.normals[mbx.faces[off + 2] * 3 + 0];
        normals![indices[indices.length - 1] * 3 + 1] = mbx.normals[mbx.faces[off + 2] * 3 + 1];
        normals![indices[indices.length - 1] * 3 + 2] = mbx.normals[mbx.faces[off + 2] * 3 + 2];
        off += 3;
      }

      if (flags.hasColors) {
        off += 3;
      }
    }
  }

  return {
    indicesArray: new Uint16Array(indices),
    positionsArray: positions,
    normalsArray: normals,
  };
};

export function convertMbxToGltf(
  mbx: Mbx.File,
  options?: {
    paranoid?: boolean;
  }
): Gltf.File {
  const extractor = new MbxExtractor(mbx);
  const builder = new GltfBuilder();

  for (let [path, geometry] of extractor.getGeometries()) {
    const { indicesArray, positionsArray, normalsArray } = convertGeometry(geometry);

    const positionMin = [positionsArray[0], positionsArray[1], positionsArray[2]];
    const positionMax = [positionsArray[0], positionsArray[1], positionsArray[2]];

    for (let i = 0; i < positionsArray.length; i += 3) {
      positionMin[0] = Math.min(positionMin[0], positionsArray[i + 0]);
      positionMin[1] = Math.min(positionMin[1], positionsArray[i + 1]);
      positionMin[2] = Math.min(positionMin[2], positionsArray[i + 2]);

      positionMax[0] = Math.max(positionMax[0], positionsArray[i + 0]);
      positionMax[1] = Math.max(positionMax[1], positionsArray[i + 1]);
      positionMax[2] = Math.max(positionMax[2], positionsArray[i + 2]);
    }

    builder.addMesh(path, {
      name: path,
      primitives: [
        {
          indices: builder.addAccessor(path + "/faces", {
            name: path + "/faces",
            byteOffset: 0,
            count: indicesArray.length,
            type: "SCALAR",
            componentType: Gltf.Const.U16,

            bufferView: builder.addBufferView(path + "/faces", {
              name: path + "/faces",
              byteOffset: 0,
              byteLength: indicesArray.byteLength,
              target: Gltf.Const.ELEMENT_ARRAY_BUFFER,

              buffer: builder.addBuffer(path + "/faces", {
                name: path + "/faces",
                byteLength: indicesArray.byteLength,
                uri: arrayToDataUri("application/octet-stream", indicesArray),
              }),
            }),
          }),

          attributes: {
            POSITION: builder.addAccessor(path + "/vertices", {
              name: path + "/vertices",
              byteOffset: 0,
              count: positionsArray.length / 3,
              type: "VEC3",
              componentType: Gltf.Const.F32,
              min: positionMin,
              max: positionMax,

              bufferView: builder.addBufferView(path + "/vertices", {
                name: path + "/vertices",
                byteOffset: 0,
                byteLength: positionsArray.byteLength,
                target: Gltf.Const.ARRAY_BUFFER,

                buffer: builder.addBuffer(path + "/vertices", {
                  name: path + "/vertices",
                  byteLength: positionsArray.byteLength,
                  uri: arrayToDataUri("application/octet-stream", positionsArray),
                }),
              }),
            }),

            NORMAL:
              normalsArray &&
              builder.addAccessor(path + "/normals", {
                name: path + "/normals",
                byteOffset: 0,
                count: normalsArray.length / 3,
                type: "VEC3",
                componentType: Gltf.Const.F32,

                bufferView: builder.addBufferView(path + "/normals", {
                  name: path + "/normals",
                  byteOffset: 0,
                  byteLength: normalsArray.byteLength,
                  target: Gltf.Const.ARRAY_BUFFER,

                  buffer: builder.addBuffer(path + "/normals", {
                    name: path + "/normals",
                    byteLength: normalsArray.byteLength,
                    uri: arrayToDataUri("application/octet-stream", normalsArray),
                  }),
                }),
              }),
          },
        },
      ],
    });
  }

  const nodeIndices: Gltf.Index<Gltf.Node>[] = [];

  for (const [path, config] of extractor.getConfigurations()) {
    for (const [i, point] of config.points.entries()) {
      nodeIndices.push(
        builder.addNode(path + `/points/${i}`, {
          name: path + `/points/${i}`,
          translation: point.transform.position,
          // TODO!
          mesh: builder.getMeshIndex(`#/geometries/${config.version}/${config.geometry.file}`),
        })
      );
    }
  }

  builder.setMainScene(
    builder.addScene("#", {
      name: "#",
      nodes: nodeIndices,
    })
  );

  return builder.build();
}
