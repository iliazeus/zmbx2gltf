import { Mbx } from "../mbx";
import { Gltf, GltfBuilder } from "../gltf";

import { Context } from "./context";
import { toDataUri } from "./utils";

import { Vertex, getVertices } from "./vertices";

export const convertGeometries = (mbx: Mbx.File, gltf: GltfBuilder, ctx: Context): void => {
  if (ctx.options.logos) {
    for (const [index, geometry] of Object.entries(mbx.details.logos)) {
      convertGeometry(`/details/logos/${index}.json`, geometry, gltf);
    }
  }

  for (const [index, geometry] of Object.entries(mbx.details.knobs)) {
    convertGeometry(`/details/knobs/${index}.json`, geometry, gltf);
  }

  for (const [index, geometry] of Object.entries(mbx.details.tubes)) {
    convertGeometry(`/details/tubes/${index}.json`, geometry, gltf);
  }

  for (const [index, geometry] of Object.entries(mbx.details.pins)) {
    convertGeometry(`/details/pins/${index}.json`, geometry, gltf);
  }

  for (const [version, geometries] of Object.entries(mbx.geometries)) {
    for (const [name, geometry] of Object.entries(geometries)) {
      convertGeometry(`/geometries/${name}`, geometry, gltf);
    }
  }
};

const convertGeometry = (path: string, geom: Mbx.Geometry, gltf: GltfBuilder): void => {
  const hashVertex: (v: Vertex) => string = (v) => JSON.stringify(v); // good enough for prototype
  const indicesByHash = new Map<string, number>();

  let nextIndex = 0;

  const indices: number[] = [];
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[][] = (geom.uvs ?? []).map(() => []);

  const uvLayerCount = geom.uvs?.length ?? 0;

  for (const vertex of getVertices(geom.faces, uvLayerCount)) {
    const vertexHash = hashVertex(vertex);

    const existingIndex = indicesByHash.get(vertexHash);
    if (existingIndex !== undefined) {
      indices.push(existingIndex);
      continue;
    }

    const index = nextIndex++;
    indices.push(index);
    indicesByHash.set(vertexHash, index);

    positions.push(geom.vertices[vertex.position * 3 + 0]);
    positions.push(geom.vertices[vertex.position * 3 + 1]);
    positions.push(geom.vertices[vertex.position * 3 + 2]);

    for (let i = 0; i < uvLayerCount; i++) {
      uvs[i].push(geom.uvs![i][vertex.uvs[i] * 2 + 0]);
      uvs[i].push(geom.uvs![i][vertex.uvs[i] * 2 + 1]);
    }

    if (vertex.flags & Mbx.FaceFlags.NORMALS) {
      normals.push(geom.normals[vertex.normal * 3 + 0]);
      normals.push(geom.normals[vertex.normal * 3 + 1]);
      normals.push(geom.normals[vertex.normal * 3 + 2]);
    }
  }

  const indicesArray = indices.length < 255 ? new Uint8Array(indices) : new Uint16Array(indices);
  const positionsArray = new Float32Array(positions);
  const normalsArray = new Float32Array(normals);
  const uvArrays = uvs.map((layer) => new Float32Array(layer));

  const positionMin = [positionsArray[0], positionsArray[1], positionsArray[2]];
  const positionMax = [positionsArray[0], positionsArray[1], positionsArray[2]];

  for (let i = 0; i < positions.length; i += 3) {
    positionMin[0] = Math.min(positionMin[0], positionsArray[i + 0]);
    positionMin[1] = Math.min(positionMin[1], positionsArray[i + 1]);
    positionMin[2] = Math.min(positionMin[2], positionsArray[i + 2]);

    positionMax[0] = Math.max(positionMax[0], positionsArray[i + 0]);
    positionMax[1] = Math.max(positionMax[1], positionsArray[i + 1]);
    positionMax[2] = Math.max(positionMax[2], positionsArray[i + 2]);
  }

  gltf.addAccessor(path + "#indices", {
    name: path + "#indices",
    byteOffset: 0,
    count: indicesArray.length,
    type: "SCALAR",
    componentType: indicesArray instanceof Uint8Array ? Gltf.Const.U8 : Gltf.Const.U16,

    bufferView: gltf.addBufferView(path + "#indices", {
      name: path + "#indices",
      byteOffset: 0,
      byteLength: indicesArray.byteLength,
      target: Gltf.Const.ELEMENT_ARRAY_BUFFER,

      buffer: gltf.addBuffer(path + "#indices", {
        name: path + "#indices",
        byteLength: indicesArray.byteLength,
        uri: toDataUri("application/octet-stream", indicesArray),
      }),
    }),
  });

  gltf.addAccessor(path + "#positions", {
    name: path + "#positions",
    byteOffset: 0,
    count: positionsArray.length / 3,
    type: "VEC3",
    componentType: Gltf.Const.F32,
    min: positionMin,
    max: positionMax,

    bufferView: gltf.addBufferView(path + "#positions", {
      name: path + "#positions",
      byteOffset: 0,
      byteLength: positionsArray.byteLength,
      target: Gltf.Const.ARRAY_BUFFER,

      buffer: gltf.addBuffer(path + "#positions", {
        name: path + "#positions",
        byteLength: positionsArray.byteLength,
        uri: toDataUri("application/octet-stream", positionsArray),
      }),
    }),
  });

  if (normals) {
    gltf.addAccessor(path + "#normals", {
      name: path + "#normals",
      byteOffset: 0,
      count: normalsArray.length / 3,
      type: "VEC3",
      componentType: Gltf.Const.F32,

      bufferView: gltf.addBufferView(path + "#normals", {
        name: path + "#normals",
        byteOffset: 0,
        byteLength: normalsArray.byteLength,
        target: Gltf.Const.ARRAY_BUFFER,

        buffer: gltf.addBuffer(path + "#normals", {
          name: path + "#normals",
          byteLength: normalsArray.byteLength,
          uri: toDataUri("application/octet-stream", normalsArray),
        }),
      }),
    });
  }

  for (const [i, uvLayerArray] of uvArrays.entries()) {
    gltf.addAccessor(path + `#uvs/${i}`, {
      name: path + `#uvs/${i}`,
      byteOffset: 0,
      count: uvLayerArray.length / 2,
      type: "VEC2",
      componentType: Gltf.Const.F32,

      bufferView: gltf.addBufferView(path + `#uvs/${i}`, {
        name: path + `#uvs/${i}`,
        byteOffset: 0,
        byteLength: uvLayerArray.byteLength,
        target: Gltf.Const.ARRAY_BUFFER,

        buffer: gltf.addBuffer(path + `#uvs/${i}`, {
          name: path + `#uvs/${i}`,
          byteLength: uvLayerArray.byteLength,
          uri: toDataUri("application/octet-stream", uvLayerArray),
        }),
      }),
    });
  }
};
