import { Mbx } from "./mbx";
import { MbxExtractor } from "./mbx-extractor";

import { Gltf } from "./gltf";
import { GltfBuilder } from "./gltf-builder";

import * as assert from "assert";

const arrayToDataUrl = (mime: string, array: { buffer: ArrayBufferLike }): string =>
  `data:${mime};base64,${Buffer.from(array.buffer).toString("base64")}`;

const getFaceProperties = (geometry: Mbx.Geometry) => {
  const bits = geometry.faces[0];
  const uvLayerCount = geometry.uvs?.length ?? 0;

  const flags = {
    isQuad: Boolean(bits & Mbx.FaceFlags.QUAD),
    hasMaterial: Boolean(bits & Mbx.FaceFlags.MATERIALS),
    hasUvs: Boolean(bits & Mbx.FaceFlags.UVS),
    hasNormals: Boolean(bits & Mbx.FaceFlags.NORMALS),
    hasColors: Boolean(bits & Mbx.FaceFlags.COLORS),
  };

  const vertexesPerFace = flags.isQuad ? 4 : 3;

  const recordSize =
    1 +
    vertexesPerFace +
    (flags.hasMaterial ? 1 : 0) +
    (flags.hasUvs ? uvLayerCount * vertexesPerFace : 0) +
    (flags.hasNormals ? vertexesPerFace : 0) +
    (flags.hasColors ? vertexesPerFace : 0);

  const faceCount = geometry.faces.length / recordSize;

  return { ...flags, uvLayerCount, vertexesPerFace, recordSize, faceCount };
};

const convertGeometry = (geometry: Mbx.Geometry) => {
  const tmp = geometry.faces[0];

  geometry.faces[0] &= ~Mbx.FaceFlags.QUAD;
  const trigFaceProps = getFaceProperties(geometry);

  geometry.faces[0] |= Mbx.FaceFlags.QUAD;
  const quadFaceProps = getFaceProperties(geometry);

  geometry.faces[0] = tmp;

  const srcFaces = geometry.faces;

  const trigFacesA: number[] = [];
  const trigFacesB: number[] = [];

  let offset = 0;
  while (offset < srcFaces.length) {
    if (!(srcFaces[offset] & Mbx.FaceFlags.QUAD)) {
      trigFacesA.push(...srcFaces.slice(offset + 1, offset + 4));
      offset += trigFaceProps.recordSize;
      continue;
    }

    trigFacesA.push(srcFaces[offset + 1], srcFaces[offset + 2], srcFaces[offset + 3]);
    trigFacesB.push(srcFaces[offset + 3], srcFaces[offset + 4], srcFaces[offset + 1]);

    offset += quadFaceProps.recordSize;
  }

  return { trigFaces: [...trigFacesA, ...trigFacesB] };
};

// const quadsToTrigs = (geometry: Mbx.Geometry) => {
//   const tmp = geometry.faces[0];

//   geometry.faces[0] &= ~Mbx.FaceFlags.QUAD;
//   const trigFaceProps = getFaceProperties(geometry);

//   geometry.faces[0] |= Mbx.FaceFlags.QUAD;
//   const quadFaceProps = getFaceProperties(geometry);

//   geometry.faces[0] = tmp;

//   const srcFaces = geometry.faces;

//   const trigFacesA: number[] = [];
//   const trigFacesB: number[] = [];

//   let offset = 0;

//   while (offset < srcFaces.length) {
//     if (!(srcFaces[offset] & Mbx.FaceFlags.QUAD)) {
//       trigFacesA.push(...srcFaces.slice(offset, offset + trigFaceProps.recordSize));
//       offset += trigFaceProps.recordSize;
//       continue;
//     }

//     trigFacesA.push(srcFaces[offset] & ~Mbx.FaceFlags.QUAD);
//     trigFacesB.push(srcFaces[offset] & ~Mbx.FaceFlags.QUAD);

//     offset += 1;

//     trigFacesA.push(srcFaces[offset + 0], srcFaces[offset + 1], srcFaces[offset + 2]);
//     trigFacesB.push(srcFaces[offset + 2], srcFaces[offset + 3], srcFaces[offset + 0]);

//     offset += 4;

//     if (quadFaceProps.hasMaterial) {
//       trigFacesA.push(srcFaces[offset]);
//       trigFacesB.push(srcFaces[offset]);

//       offset += 1;
//     }

//     if (quadFaceProps.hasUvs) {
//       for (let i = 0; i < quadFaceProps.uvLayerCount; i++) {
//         trigFacesA.push(srcFaces[offset + 0], srcFaces[offset + 1], srcFaces[offset + 2]);
//         trigFacesB.push(srcFaces[offset + 2], srcFaces[offset + 3], srcFaces[offset + 0]);

//         offset += 4;
//       }
//     }

//     if (quadFaceProps.hasNormals) {
//       trigFacesA.push(srcFaces[offset + 0], srcFaces[offset + 1], srcFaces[offset + 2]);
//       trigFacesB.push(srcFaces[offset + 2], srcFaces[offset + 3], srcFaces[offset + 0]);

//       offset += 4;
//     }

//     if (quadFaceProps.hasColors) {
//       trigFacesA.push(srcFaces[offset + 0], srcFaces[offset + 1], srcFaces[offset + 2]);
//       trigFacesB.push(srcFaces[offset + 2], srcFaces[offset + 3], srcFaces[offset + 0]);

//       offset += 4;
//     }
//   }

//   return { ...geometry, faces: [...trigFacesA, ...trigFacesB] };
// };

export function convertMbxToGltf(
  mbx: Mbx.File,
  options?: {
    paranoid?: boolean;
  }
): Gltf.File {
  const extractor = new MbxExtractor(mbx);
  const builder = new GltfBuilder();

  for (let [path, geometry] of extractor.getGeometries()) {
    // geometry = quadsToTrigs(geometry);
    // const faceProps = getFaceProperties(geometry);

    // if (options?.paranoid) {
    //   assert.ok(geometry.vertices.length % 3 === 0);
    //   assert.ok(geometry.normals.length % 3 === 0);
    //   assert.ok(geometry.faces.length % faceProps.recordSize === 0);

    //   for (let i = faceProps.recordSize; i < geometry.faces.length; i += faceProps.recordSize) {
    //     assert.strictEqual(geometry.faces[i - faceProps.recordSize], geometry.faces[i]);
    //   }

    //   // assert.strictEqual(geometry.vertices.length, geometry.normals.length);
    // }

    const vertexArray = new Float32Array(geometry.vertices);
    // const normalArray = new Float32Array(geometry.normals);
    // const faceArray = new Uint16Array(geometry.faces);
    const faceArray = new Uint16Array(convertGeometry(geometry).trigFaces);

    const vertexMin = [vertexArray[0], vertexArray[1], vertexArray[2]];
    const vertexMax = [vertexArray[0], vertexArray[1], vertexArray[2]];

    for (let i = 0; i < vertexArray.length; i += 3) {
      vertexMin[0] = Math.min(vertexMin[0], vertexArray[i + 0]);
      vertexMin[1] = Math.min(vertexMin[1], vertexArray[i + 1]);
      vertexMin[2] = Math.min(vertexMin[2], vertexArray[i + 2]);

      vertexMax[0] = Math.max(vertexMax[0], vertexArray[i + 0]);
      vertexMax[1] = Math.max(vertexMax[1], vertexArray[i + 1]);
      vertexMax[2] = Math.max(vertexMax[2], vertexArray[i + 2]);
    }

    builder.addMesh(path, {
      name: path,
      primitives: [
        {
          indices: builder.addAccessor(path + "/faces", {
            name: path + "/faces",
            byteOffset: 0,
            count: faceArray.length,
            type: "SCALAR",
            componentType: Gltf.Const.U16,

            bufferView: builder.addBufferView(path + "/faces", {
              name: path + "/faces",
              byteOffset: 0,
              byteLength: faceArray.byteLength,
              target: Gltf.Const.ELEMENT_ARRAY_BUFFER,

              buffer: builder.addBuffer(path + "/faces", {
                name: path + "/faces",
                byteLength: faceArray.byteLength,
                uri: arrayToDataUrl("application/octet-stream", faceArray),
              }),
            }),
          }),

          attributes: {
            POSITION: builder.addAccessor(path + "/vertices", {
              name: path + "/vertices",
              byteOffset: 0,
              count: geometry.vertices.length / 3,
              type: "VEC3",
              componentType: Gltf.Const.F32,
              min: vertexMin,
              max: vertexMax,

              bufferView: builder.addBufferView(path + "/vertices", {
                name: path + "/vertices",
                byteOffset: 0,
                byteLength: vertexArray.byteLength,
                target: Gltf.Const.ARRAY_BUFFER,

                buffer: builder.addBuffer(path + "/vertices", {
                  name: path + "/vertices",
                  byteLength: vertexArray.byteLength,
                  uri: arrayToDataUrl("application/octet-stream", vertexArray),
                }),
              }),
            }),

            // NORMAL: builder.addAccessor(path + "/normals", {
            //   name: path + "/normals",
            //   byteOffset: 0,
            //   count: geometry.normals.length / 3,
            //   type: "VEC3",
            //   componentType: Gltf.Const.F32,

            //   bufferView: builder.addBufferView(path + "/normals", {
            //     name: path + "/normals",
            //     byteOffset: 0,
            //     byteLength: normalArray.byteLength,
            //     target: Gltf.Const.ARRAY_BUFFER,

            //     buffer: builder.addBuffer(path + "/normals", {
            //       name: path + "/normals",
            //       byteLength: normalArray.byteLength,
            //       uri: arrayToDataUrl("application/octet-stream", normalArray),
            //     }),
            //   }),
            // }),
          },
        },
      ],
    });
  }

  const nodeIndexes: Gltf.Index<Gltf.Node>[] = [];

  for (const [path, config] of extractor.getConfigurations()) {
    for (const [i, point] of config.points.entries()) {
      nodeIndexes.push(
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
      nodes: nodeIndexes,
    })
  );

  return builder.build();
}
