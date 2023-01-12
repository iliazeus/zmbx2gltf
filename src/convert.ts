import { Mbx } from "./mbx";
import { MbxExtractor } from "./mbx-extractor";

import { Gltf } from "./gltf";
import { GltfBuilder } from "./gltf-builder";

import * as assert from "assert/strict";

const arrayToDataUrl = (mime: string, array: { buffer: ArrayBufferLike }): string =>
  `data:${mime};base64,${Buffer.from(array.buffer).toString("base64")}`;

const parseFaceFlags = (flags: number) => ({
  isQuad: Boolean(flags & Mbx.FaceFlags.QUAD),
  hasMaterial: Boolean(flags & Mbx.FaceFlags.MATERIALS),
  hasUvs: Boolean(flags & Mbx.FaceFlags.UVS),
  hasNormals: Boolean(flags & Mbx.FaceFlags.NORMALS),
  hasColors: Boolean(flags & Mbx.FaceFlags.COLORS),
});

const convertGeometry = (mbx: Mbx.Geometry) => {
  // TODO: indexed geometry?

  const positions: number[] = [];
  const normals: number[] = [];

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

      positions.push(
        mbx.vertices[mbx.faces[off + 0] * 3 + 0],
        mbx.vertices[mbx.faces[off + 0] * 3 + 1],
        mbx.vertices[mbx.faces[off + 0] * 3 + 2],
        mbx.vertices[mbx.faces[off + 1] * 3 + 0],
        mbx.vertices[mbx.faces[off + 1] * 3 + 1],
        mbx.vertices[mbx.faces[off + 1] * 3 + 2],
        mbx.vertices[mbx.faces[off + 2] * 3 + 0],
        mbx.vertices[mbx.faces[off + 2] * 3 + 1],
        mbx.vertices[mbx.faces[off + 2] * 3 + 2]
      );
      positions.push(
        mbx.vertices[mbx.faces[off + 2] * 3 + 0],
        mbx.vertices[mbx.faces[off + 2] * 3 + 1],
        mbx.vertices[mbx.faces[off + 2] * 3 + 2],
        mbx.vertices[mbx.faces[off + 3] * 3 + 0],
        mbx.vertices[mbx.faces[off + 3] * 3 + 1],
        mbx.vertices[mbx.faces[off + 3] * 3 + 2],
        mbx.vertices[mbx.faces[off + 0] * 3 + 0],
        mbx.vertices[mbx.faces[off + 0] * 3 + 1],
        mbx.vertices[mbx.faces[off + 0] * 3 + 2]
      );
      off += 4;

      if (flags.hasMaterial) {
        off += 1;
      }

      if (flags.hasUvs) {
        off += 4 * uvLayerCount;
      }

      if (flags.hasNormals) {
        normals.push(
          mbx.normals[mbx.faces[off + 0] * 3 + 0],
          mbx.normals[mbx.faces[off + 0] * 3 + 1],
          mbx.normals[mbx.faces[off + 0] * 3 + 2],
          mbx.normals[mbx.faces[off + 1] * 3 + 0],
          mbx.normals[mbx.faces[off + 1] * 3 + 1],
          mbx.normals[mbx.faces[off + 1] * 3 + 2],
          mbx.normals[mbx.faces[off + 2] * 3 + 0],
          mbx.normals[mbx.faces[off + 2] * 3 + 1],
          mbx.normals[mbx.faces[off + 2] * 3 + 2]
        );
        normals.push(
          mbx.normals[mbx.faces[off + 2] * 3 + 0],
          mbx.normals[mbx.faces[off + 2] * 3 + 1],
          mbx.normals[mbx.faces[off + 2] * 3 + 2],
          mbx.normals[mbx.faces[off + 3] * 3 + 0],
          mbx.normals[mbx.faces[off + 3] * 3 + 1],
          mbx.normals[mbx.faces[off + 3] * 3 + 2],
          mbx.normals[mbx.faces[off + 0] * 3 + 0],
          mbx.normals[mbx.faces[off + 0] * 3 + 1],
          mbx.normals[mbx.faces[off + 0] * 3 + 2]
        );
        off += 4;
      }

      if (flags.hasColors) {
        off += 4;
      }
    } else {
      off += 1;

      positions.push(
        mbx.vertices[mbx.faces[off + 0] * 3 + 0],
        mbx.vertices[mbx.faces[off + 0] * 3 + 1],
        mbx.vertices[mbx.faces[off + 0] * 3 + 2],
        mbx.vertices[mbx.faces[off + 1] * 3 + 0],
        mbx.vertices[mbx.faces[off + 1] * 3 + 1],
        mbx.vertices[mbx.faces[off + 1] * 3 + 2],
        mbx.vertices[mbx.faces[off + 2] * 3 + 0],
        mbx.vertices[mbx.faces[off + 2] * 3 + 1],
        mbx.vertices[mbx.faces[off + 2] * 3 + 2]
      );
      off += 3;

      if (flags.hasMaterial) {
        off += 1;
      }

      if (flags.hasUvs) {
        off += 3 * uvLayerCount;
      }

      if (flags.hasNormals) {
        normals.push(
          mbx.normals[mbx.faces[off + 0] * 3 + 0],
          mbx.normals[mbx.faces[off + 0] * 3 + 1],
          mbx.normals[mbx.faces[off + 0] * 3 + 2],
          mbx.normals[mbx.faces[off + 1] * 3 + 0],
          mbx.normals[mbx.faces[off + 1] * 3 + 1],
          mbx.normals[mbx.faces[off + 1] * 3 + 2],
          mbx.normals[mbx.faces[off + 2] * 3 + 0],
          mbx.normals[mbx.faces[off + 2] * 3 + 1],
          mbx.normals[mbx.faces[off + 2] * 3 + 2]
        );
        off += 3;
      }

      if (flags.hasColors) {
        off += 3;
      }
    }
  }

  return {
    positionsArray: new Float32Array(positions),
    normalsArray: normals.length > 0 ? new Float32Array(normals) : undefined,
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
    const { positionsArray, normalsArray } = convertGeometry(geometry);

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
                  uri: arrayToDataUrl("application/octet-stream", positionsArray),
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
                    uri: arrayToDataUrl("application/octet-stream", normalsArray),
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
