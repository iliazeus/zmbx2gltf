export namespace Mbx {
  export type Vector3 = number[];
  export type Vector4 = number[];
  export type Matrix4x4 = number[];

  export type Vector3Array = number[];

  export type Base64String = string;

  export interface File {
    metadata: FileMetadata;
    parts: Part[];
    configurations: { [index: string]: { [name: string]: Configuration } };
    geometries: { [index: string]: { [name: string]: Geometry } };
    textures: {
      "1"?: TexturePack;
      "2"?: { official: TexturePack; custom: TexturePack };
    };
    details: {
      logos: { [index: string]: Geometry };
      knobs: { [index: string]: Geometry };
      tubes: { [index: string]: Geometry };
      pins: { [index: string]: Geometry };
    };
  }

  export interface FileMetadata {
    version: [number, number, number];
    date: string;
    generator: string;
  }

  export interface Part {
    type: "solid";
    version: number;
    scope: "official";
    id: number;
    configuration: string;
    matrix: Matrix4x4;
    objectIndex: number;
    material: {
      base: [number]; // TODO
      decoration: {}; // TODO
    };
  }

  export interface Configuration {
    type: "part" | "solid";
    version: number;
    name: string;
    geometry: ConfigurationGeometry;
    points: ConfigurationPoint[];
    normals?: TextureRef[];
    bumps?: TextureRef[];
    roughness?: ConfigurationRoughness[];
    materials?: []; // TODO
    decorationUvs?: number[]; // TODO
  }

  export interface ConfigurationGeometry {
    file: string;
    extras: {
      knobs: ConfigurationExtra[];
      pins: ConfigurationExtra[];
      tubes: ConfigurationExtra[];
      logos: ConfigurationExtra[];
    };
  }

  export interface ConfigurationPoint {
    transform: Transform;
  }

  export interface ConfigurationExtra {
    type: number;
    transform: Transform;
  }

  export interface ConfigurationRoughness {
    scale: number;
    strength: number;
    mask?: TextureRef;
  }

  export interface TextureRef {
    file: string;
    uv: number;
    bevel?: boolean;
    repeat?: boolean;
    channel?: "r";
  }

  export interface Transform {
    position: Vector3;
    quaternion: Vector4;
  }

  export interface Geometry {
    metadata?: IoThreeGeometryMetadata | BlenderGeometryMetadata;
    vertices: Vector3Array;
    faces: number[];
    normals: Vector3Array;
    uvs?: number[][]; // TODO
  }

  export const enum FaceFlags {
    QUAD = 0x01,
    MATERIALS = 0x02,
    UVS = 0x08,
    NORMALS = 0x20,
    COLORS = 0x80,
  }

  export interface IoThreeGeometryMetadata {
    version: number;
    type: "Geometry";
    generator: "io_three";
    vertices: number;
    faces: number;
    normals: number;
  }

  export interface BlenderGeometryMetadata {
    formatVersion: number;
    generatedBy: string;
    vertices: number;
    faces: number;
    normals: number;
    colors: number;
    uvs: []; // TODO
    materials: number;
    morphTargets: number;
    bones: number;
  }

  export interface TexturePack {
    decoration?: { [name: string]: Base64String };
    bump?: { [name: string]: Base64String };
    metalness?: { [name: string]: Base64String };
    normal?: { [name: string]: Base64String };
    mask?: { [name: string]: Base64String };
    color?: { [name: string]: Base64String };
    data?: { [name: string]: Base64String };
  }
}
