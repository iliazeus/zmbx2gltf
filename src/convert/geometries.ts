import { Mbx } from "../mbx";
import { Gltf, GltfBuilder } from "../gltf";

import { toDataUri } from "./utils";

import * as assert from "assert";

export const convertGeometries = (mbx: Mbx.File, gltf: GltfBuilder): void => {
  for (const [index, geometry] of Object.entries(mbx.details.logos)) {
    convertGeometry(`/details/logos/${index}.json`, geometry, gltf);
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
  const headFlags = {
    isQuad: Boolean(geom.faces[0] & Mbx.FaceFlags.QUAD),
    hasMaterial: Boolean(geom.faces[0] & Mbx.FaceFlags.MATERIALS),
    hasUvs: Boolean(geom.faces[0] & Mbx.FaceFlags.UVS),
    hasNormals: Boolean(geom.faces[0] & Mbx.FaceFlags.NORMALS),
    hasColors: Boolean(geom.faces[0] & Mbx.FaceFlags.COLORS),
  };

  const indices: number[] = [];
  const positions = new Float32Array(geom.vertices);
  const normals = headFlags.hasNormals ? new Float32Array(positions.length) : undefined;

  const uvLayerCount = geom.uvs?.length ?? 0;

  let off = 0;
  while (off < geom.faces.length) {
    assert.equal(geom.faces[0] & ~Mbx.FaceFlags.QUAD, geom.faces[off] & ~Mbx.FaceFlags.QUAD);

    const flags = {
      isQuad: Boolean(geom.faces[off] & Mbx.FaceFlags.QUAD),
      hasMaterial: Boolean(geom.faces[off] & Mbx.FaceFlags.MATERIALS),
      hasUvs: Boolean(geom.faces[off] & Mbx.FaceFlags.UVS),
      hasNormals: Boolean(geom.faces[off] & Mbx.FaceFlags.NORMALS),
      hasColors: Boolean(geom.faces[off] & Mbx.FaceFlags.COLORS),
    };

    if (flags.isQuad) {
      off += 1;

      indices.push(geom.faces[off + 0], geom.faces[off + 1], geom.faces[off + 2]);
      indices.push(geom.faces[off + 2], geom.faces[off + 3], geom.faces[off + 0]);
      off += 4;

      if (flags.hasMaterial) {
        off += 1;
      }

      if (flags.hasUvs) {
        off += 4 * uvLayerCount;
      }

      if (flags.hasNormals) {
        normals![indices[indices.length - 6] * 3 + 0] = geom.normals[geom.faces[off + 0] * 3 + 0];
        normals![indices[indices.length - 6] * 3 + 1] = geom.normals[geom.faces[off + 0] * 3 + 1];
        normals![indices[indices.length - 6] * 3 + 2] = geom.normals[geom.faces[off + 0] * 3 + 2];
        normals![indices[indices.length - 5] * 3 + 0] = geom.normals[geom.faces[off + 1] * 3 + 0];
        normals![indices[indices.length - 5] * 3 + 1] = geom.normals[geom.faces[off + 1] * 3 + 1];
        normals![indices[indices.length - 5] * 3 + 2] = geom.normals[geom.faces[off + 1] * 3 + 2];
        normals![indices[indices.length - 4] * 3 + 0] = geom.normals[geom.faces[off + 2] * 3 + 0];
        normals![indices[indices.length - 4] * 3 + 1] = geom.normals[geom.faces[off + 2] * 3 + 1];
        normals![indices[indices.length - 4] * 3 + 2] = geom.normals[geom.faces[off + 2] * 3 + 2];

        normals![indices[indices.length - 3] * 3 + 0] = geom.normals[geom.faces[off + 2] * 3 + 0];
        normals![indices[indices.length - 3] * 3 + 1] = geom.normals[geom.faces[off + 2] * 3 + 1];
        normals![indices[indices.length - 3] * 3 + 2] = geom.normals[geom.faces[off + 2] * 3 + 2];
        normals![indices[indices.length - 2] * 3 + 0] = geom.normals[geom.faces[off + 3] * 3 + 0];
        normals![indices[indices.length - 2] * 3 + 1] = geom.normals[geom.faces[off + 3] * 3 + 1];
        normals![indices[indices.length - 2] * 3 + 2] = geom.normals[geom.faces[off + 3] * 3 + 2];
        normals![indices[indices.length - 1] * 3 + 0] = geom.normals[geom.faces[off + 0] * 3 + 0];
        normals![indices[indices.length - 1] * 3 + 1] = geom.normals[geom.faces[off + 0] * 3 + 1];
        normals![indices[indices.length - 1] * 3 + 2] = geom.normals[geom.faces[off + 0] * 3 + 2];

        off += 4;
      }

      if (flags.hasColors) {
        off += 4;
      }
    } else {
      off += 1;

      indices.push(geom.faces[off + 0], geom.faces[off + 1], geom.faces[off + 2]);
      off += 3;

      if (flags.hasMaterial) {
        off += 1;
      }

      if (flags.hasUvs) {
        off += 3 * uvLayerCount;
      }

      if (flags.hasNormals) {
        normals![indices[indices.length - 3] * 3 + 0] = geom.normals[geom.faces[off + 0] * 3 + 0];
        normals![indices[indices.length - 3] * 3 + 1] = geom.normals[geom.faces[off + 0] * 3 + 1];
        normals![indices[indices.length - 3] * 3 + 2] = geom.normals[geom.faces[off + 0] * 3 + 2];
        normals![indices[indices.length - 2] * 3 + 0] = geom.normals[geom.faces[off + 1] * 3 + 0];
        normals![indices[indices.length - 2] * 3 + 1] = geom.normals[geom.faces[off + 1] * 3 + 1];
        normals![indices[indices.length - 2] * 3 + 2] = geom.normals[geom.faces[off + 1] * 3 + 2];
        normals![indices[indices.length - 1] * 3 + 0] = geom.normals[geom.faces[off + 2] * 3 + 0];
        normals![indices[indices.length - 1] * 3 + 1] = geom.normals[geom.faces[off + 2] * 3 + 1];
        normals![indices[indices.length - 1] * 3 + 2] = geom.normals[geom.faces[off + 2] * 3 + 2];
        off += 3;
      }

      if (flags.hasColors) {
        off += 3;
      }
    }
  }

  const indicesArray = new Uint16Array(indices);

  const positionMin = [positions[0], positions[1], positions[2]];
  const positionMax = [positions[0], positions[1], positions[2]];

  for (let i = 0; i < positions.length; i += 3) {
    positionMin[0] = Math.min(positionMin[0], positions[i + 0]);
    positionMin[1] = Math.min(positionMin[1], positions[i + 1]);
    positionMin[2] = Math.min(positionMin[2], positions[i + 2]);

    positionMax[0] = Math.max(positionMax[0], positions[i + 0]);
    positionMax[1] = Math.max(positionMax[1], positions[i + 1]);
    positionMax[2] = Math.max(positionMax[2], positions[i + 2]);
  }

  gltf.addAccessor(path + "#indices", {
    name: path + "#indices",
    byteOffset: 0,
    count: indicesArray.length,
    type: "SCALAR",
    componentType: Gltf.Const.U16,

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
    count: positions.length / 3,
    type: "VEC3",
    componentType: Gltf.Const.F32,
    min: positionMin,
    max: positionMax,

    bufferView: gltf.addBufferView(path + "#positions", {
      name: path + "#positions",
      byteOffset: 0,
      byteLength: positions.byteLength,
      target: Gltf.Const.ARRAY_BUFFER,

      buffer: gltf.addBuffer(path + "#positions", {
        name: path + "#positions",
        byteLength: positions.byteLength,
        uri: toDataUri("application/octet-stream", positions),
      }),
    }),
  });

  if (normals) {
    gltf.addAccessor(path + "#normals", {
      name: path + "#normals",
      byteOffset: 0,
      count: normals.length / 3,
      type: "VEC3",
      componentType: Gltf.Const.F32,

      bufferView: gltf.addBufferView(path + "#normals", {
        name: path + "#normals",
        byteOffset: 0,
        byteLength: normals.byteLength,
        target: Gltf.Const.ARRAY_BUFFER,

        buffer: gltf.addBuffer(path + "#normals", {
          name: path + "#normals",
          byteLength: normals.byteLength,
          uri: toDataUri("application/octet-stream", normals),
        }),
      }),
    });
  }
};
