export namespace Gltf {
  export type Index<T> = number;

  export type Matrix4x4 = number[];
  export type Vector3 = number[];
  export type Vector4 = number[];

  export type Uri = string;

  export const enum Const {
    I8 = 5120,
    U8 = 5121,
    I16 = 5122,
    U16 = 5123,
    U32 = 5125,
    F32 = 5126,

    NEAREST = 9728,
    LINEAR = 9729,

    REPEAT = 10497,

    NEAREST_MIPMAP_NEAREST = 9984,
    LINEAR_MIPMAP_NEAREST = 9985,
    NEAREST_MIPMAP_LINEAR = 9986,
    LINEAR_MIPMAP_LINEAR = 9987,

    CLAMP_TO_EDGE = 33071,

    MIRRORED_REPEAT = 33648,

    ARRAY_BUFFER = 34962,
    ELEMENT_ARRAY_BUFFER = 34963,
  }

  export interface File {
    asset: Asset;
    scenes?: Scene[];
    scene?: Index<Scene>;
    nodes?: Node[];
    buffers?: Buffer[];
    bufferViews?: BufferView[];
    accessors?: Accessor[];
    meshes?: Mesh[];
    skins?: Skin[];
    textures?: Texture[];
    images?: Image[];
    samplers?: Sampler[];
    materials?: Material[];
    cameras?: Camera[];
    animations?: Animation[];
  }

  export interface Asset {
    name?: string;
    version: string;
    minVersion?: string;
    generator?: string;
    copyright?: string;
    [name: string]: unknown;
  }

  export interface Scene {
    name?: string;
    nodes: Index<Node>[];
  }

  export interface Node {
    name?: string;
    children?: Index<Node>[];
    matrix?: Matrix4x4;
    translation?: Vector3;
    scale?: Vector3;
    rotation?: Vector4;
    mesh?: Index<Mesh>;
    weights?: number[];
    camera?: Index<Camera>;
  }

  export interface Buffer {
    name?: string;
    byteLength: number;
    uri?: Uri;
  }

  export interface BufferView {
    name?: string;
    buffer: Index<Buffer>;
    byteLength: number;
    byteOffset: number;
    byteStride?: number;
    target?: Const.ARRAY_BUFFER | Const.ELEMENT_ARRAY_BUFFER;
  }

  export interface Accessor {
    name?: string;
    bufferView?: Index<BufferView>;
    byteOffset: number;
    count: number;
    type: DataType;
    componentType: ComponentType;
    max?: number[];
    min?: number[];
    sparse?: {
      count: number;
      indices: Accessor;
      values: Accessor;
    };
  }

  export type DataType = "SCALAR" | "VEC2" | "VEC3" | "VEC4" | "MAT2" | "MAT3" | "MAT4";

  export type ComponentType = Const.I8 | Const.U8 | Const.I16 | Const.U16 | Const.U32 | Const.F32;

  export interface Mesh {
    name?: string;
    primitives: Primitive[];
    weights?: number[];
  }

  export interface Primitive {
    attributes: Partial<Record<PrimitiveAttributeName, Index<Accessor>>>;
    indices?: Index<Accessor>;
    material?: Index<Material>;
    mode?: number;
  }

  export type PrimitiveAttributeName =
    | "NORMAL"
    | "POSITION"
    | "TANGENT"
    | `TEXCOORD_${number}`
    | `COLOR_${number}`
    | `JOINTS_${number}`
    | `WEIGHTS_${number}`;

  export interface Skin {
    name?: string;
    joints: Index<Node>[];
    inverseBindMatrices?: Index<Accessor>;
    skeleton?: Index<Node>;
  }

  export interface Texture {
    name?: string;
    source: Index<Image>;
    sampler?: Index<Sampler>;
  }

  export interface Image {
    name?: string;
    uri?: Uri;
    bufferView?: Index<BufferView>;
    mimeType?: string;
  }

  export interface Sampler {
    name?: string;
    magFilter?: SamplerMagFilter;
    minFilter?: SamplerMinFilter;
    wrapS?: SamplerWrap;
    wrapT?: SamplerWrap;
  }

  export type SamplerMagFilter = Const.NEAREST | Const.LINEAR;

  export type SamplerMinFilter =
    | Const.NEAREST
    | Const.LINEAR
    | Const.NEAREST_MIPMAP_NEAREST
    | Const.LINEAR_MIPMAP_NEAREST
    | Const.NEAREST_MIPMAP_LINEAR
    | Const.LINEAR_MIPMAP_LINEAR;

  export type SamplerWrap = Const.CLAMP_TO_EDGE | Const.MIRRORED_REPEAT | Const.REPEAT;

  export interface Material {
    name?: string;

    pbrMetallicRoughness?: {
      baseColorFactor?: Vector4;
      baseColorTexture?: TextureInfo;
      metallicFactor?: number;
      metallicTexture?: TextureInfo;
      roughnessFactor?: number;
      roughnessTexture?: TextureInfo;
    };

    normalFactor?: Vector4;
    normalTexture?: TextureInfo;
    occlusionFactor?: number;
    occlusionTexture?: TextureInfo;
    emissiveFactor?: Vector3;
    emissiveTexture?: TextureInfo;

    alphaMode?: "OPAQUE" | "MASK" | "BLEND";
    doubleSided?: boolean;
  }

  export interface TextureInfo {
    index: Index<Texture>;
    scale?: number;
    texCoord?: number;
  }

  export interface Camera {
    name?: string;
    type: "perspective" | "orthographic";

    perspective?: {
      aspectRatio: number;
      yfov: number;
      znear: number;
      zfar?: number;
    };

    orthographic?: {
      xmag: number;
      ymag: number;
      znear: number;
      zfar: number;
    };
  }

  export interface Animation {
    name?: string;
    channels?: AnimationChannel[];
    samplers?: AnimationSampler[];
  }

  export interface AnimationChannel {
    sampler: Index<AnimationSampler>;
    target: {
      node: Index<Node>;
      path: "translation" | "rotation" | "scale" | "weights";
    };
  }

  export interface AnimationSampler {
    input: Index<Accessor>;
    interpolation: "LINEAR";
    output: Index<Accessor>;
  }
}
