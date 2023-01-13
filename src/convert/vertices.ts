import { Mbx } from "../mbx";

export interface Vertex {
  flags: number;
  position: number;
  normal: number;
  color: number;
  uvs: number[];
}

const makeVertex = (flags: number): Vertex => ({
  flags,
  position: -1,
  normal: -1,
  color: -1,
  uvs: [],
});

export function* getVertices(faces: number[], uvLayerCount: number): Iterable<Vertex> {
  let off = 0;
  while (off < faces.length) {
    const flags = faces[off];
    off += 1;

    if (flags & Mbx.FaceFlags.QUAD) {
      const v0 = makeVertex(flags);
      const v1 = makeVertex(flags);
      const v2 = makeVertex(flags);
      const v3 = makeVertex(flags);

      v0.position = faces[off + 0];
      v1.position = faces[off + 1];
      v2.position = faces[off + 2];
      v3.position = faces[off + 3];

      off += 4;

      if (flags & Mbx.FaceFlags.MATERIAL) {
        off += 1;
      }

      if (flags & Mbx.FaceFlags.UVS) {
        for (let i = 0; i < uvLayerCount; i++) {
          v0.uvs.push(faces[off + 0]);
          v1.uvs.push(faces[off + 1]);
          v2.uvs.push(faces[off + 2]);
          v3.uvs.push(faces[off + 3]);

          off += 4;
        }
      }

      if (flags & Mbx.FaceFlags.NORMALS) {
        v0.normal = faces[off + 0];
        v1.normal = faces[off + 1];
        v2.normal = faces[off + 2];
        v3.normal = faces[off + 3];

        off += 4;
      }

      if (flags & Mbx.FaceFlags.COLORS) {
        off += 4;
      }

      yield v0;
      yield v1;
      yield v2;

      yield v2;
      yield v3;
      yield v0;
    } else {
      const v0 = makeVertex(flags);
      const v1 = makeVertex(flags);
      const v2 = makeVertex(flags);

      v0.position = faces[off + 0];
      v1.position = faces[off + 1];
      v2.position = faces[off + 2];

      off += 3;

      if (flags & Mbx.FaceFlags.MATERIAL) {
        off += 1;
      }

      if (flags & Mbx.FaceFlags.UVS) {
        for (let i = 0; i < uvLayerCount; i++) {
          v0.uvs.push(faces[off + 0]);
          v1.uvs.push(faces[off + 1]);
          v2.uvs.push(faces[off + 2]);

          off += 3;
        }
      }

      if (flags & Mbx.FaceFlags.NORMALS) {
        v0.normal = faces[off + 0];
        v1.normal = faces[off + 1];
        v2.normal = faces[off + 2];

        off += 3;
      }

      if (flags & Mbx.FaceFlags.COLORS) {
        off += 3;
      }

      yield v0;
      yield v1;
      yield v2;
    }
  }
}
