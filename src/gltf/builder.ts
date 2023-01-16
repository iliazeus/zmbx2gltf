import { Gltf } from "./types";

const getStrict = <K, V>(map: Map<K, V>, key: K): V => {
  const value = map.get(key);
  if (value === undefined) throw new RangeError(String(key));
  return value;
};

const setStrict = <K, V>(map: Map<K, V>, key: K, value: V): void => {
  if (map.has(key)) throw new RangeError(String(key));
  map.set(key, value);
};

export class GltfBuilder {
  private _file!: Gltf.File;

  private _imageIndices!: Map<string, number>;
  private _bufferIndices!: Map<string, number>;
  private _bufferViewIndices!: Map<string, number>;
  private _accessorIndices!: Map<string, number>;
  private _meshIndices!: Map<string, number>;
  private _nodeIndices!: Map<string, number>;
  private _sceneIndices!: Map<string, number>;
  private _materialIndices!: Map<string, number>;
  private _textureIndices!: Map<string, number>;
  private _samplerIndices!: Map<string, number>;

  constructor() {
    this.reset();
  }

  reset(): void {
    this._file = { asset: { version: "2.0" } };

    this._imageIndices = new Map();
    this._bufferIndices = new Map();
    this._bufferViewIndices = new Map();
    this._accessorIndices = new Map();
    this._meshIndices = new Map();
    this._nodeIndices = new Map();
    this._sceneIndices = new Map();
    this._materialIndices = new Map();
    this._textureIndices = new Map();
    this._samplerIndices = new Map();
  }

  build(): Gltf.File {
    const file = this._file;
    this.reset();
    return file;
  }

  setMetadata(metadata: Partial<Gltf.Asset>): void {
    Object.assign(this._file.asset, metadata);
  }

  useExtension(extension: string): void {
    this._file.extensionsUsed ??= [];
    this._file.extensionsUsed.push(extension);
  }

  setMainScene(index: Gltf.Index<Gltf.Scene>): void {
    this._file.scene = index;
  }

  getImageIndex(key: string): Gltf.Index<Gltf.Image> {
    return getStrict(this._imageIndices, key);
  }

  getImage(key: string): Gltf.Image {
    const index = this.getImageIndex(key);
    return this._file.images![index];
  }

  addImage(key: string, image: Gltf.Image): Gltf.Index<Gltf.Image> {
    this._file.images ??= [];
    const index = this._file.images.length;
    setStrict(this._imageIndices, key, index);
    this._file.images.push(image);
    return index;
  }

  getBufferIndex(key: string): Gltf.Index<Gltf.Buffer> {
    return getStrict(this._bufferIndices, key);
  }

  addBuffer(key: string, buffer: Gltf.Buffer): Gltf.Index<Gltf.Buffer> {
    this._file.buffers ??= [];
    const index = this._file.buffers.length;
    setStrict(this._bufferIndices, key, index);
    this._file.buffers.push(buffer);
    return index;
  }

  getBufferViewIndex(key: string): Gltf.Index<Gltf.BufferView> {
    return getStrict(this._bufferViewIndices, key);
  }

  addBufferView(key: string, bufferView: Gltf.BufferView): Gltf.Index<Gltf.BufferView> {
    this._file.bufferViews ??= [];
    const index = this._file.bufferViews.length;
    setStrict(this._bufferViewIndices, key, index);
    this._file.bufferViews.push(bufferView);
    return index;
  }

  tryGetAccessorIndex(key: string): Gltf.Index<Gltf.Accessor> | undefined {
    return this._accessorIndices.get(key);
  }

  getAccessorIndex(key: string): Gltf.Index<Gltf.Accessor> {
    return getStrict(this._accessorIndices, key);
  }

  addAccessor(key: string, accessor: Gltf.Accessor): Gltf.Index<Gltf.Accessor> {
    this._file.accessors ??= [];
    const index = this._file.accessors.length;
    setStrict(this._accessorIndices, key, index);
    this._file.accessors.push(accessor);
    return index;
  }

  getMeshIndex(key: string): Gltf.Index<Gltf.Mesh> {
    return getStrict(this._meshIndices, key);
  }

  addMesh(key: string, mesh: Gltf.Mesh): Gltf.Index<Gltf.Mesh> {
    this._file.meshes ??= [];
    const index = this._file.meshes.length;
    setStrict(this._meshIndices, key, index);
    this._file.meshes.push(mesh);
    return index;
  }

  getNodeIndex(key: string): Gltf.Index<Gltf.Node> {
    return getStrict(this._nodeIndices, key);
  }

  addNode(key: string, node: Gltf.Node): Gltf.Index<Gltf.Node> {
    this._file.nodes ??= [];
    const index = this._file.nodes.length;
    setStrict(this._nodeIndices, key, index);
    this._file.nodes.push(node);
    return index;
  }

  getSceneIndex(key: string): Gltf.Index<Gltf.Scene> {
    return getStrict(this._sceneIndices, key);
  }

  addScene(key: string, scene: Gltf.Scene): Gltf.Index<Gltf.Scene> {
    this._file.scenes ??= [];
    const index = this._file.scenes.length;
    setStrict(this._sceneIndices, key, index);
    this._file.scenes.push(scene);
    return index;
  }

  hasMaterial(key: string): boolean {
    return this._materialIndices.has(key);
  }

  getMaterialIndex(key: string): Gltf.Index<Gltf.Material> {
    return getStrict(this._materialIndices, key);
  }

  addMaterial(key: string, material: Gltf.Material): Gltf.Index<Gltf.Material> {
    this._file.materials ??= [];
    const index = this._file.materials.length;
    setStrict(this._materialIndices, key, index);
    this._file.materials.push(material);
    return index;
  }

  getTextureIndex(key: string): Gltf.Index<Gltf.Texture> {
    return getStrict(this._textureIndices, key);
  }

  addTexture(key: string, texture: Gltf.Texture): Gltf.Index<Gltf.Texture> {
    this._file.textures ??= [];
    const index = this._file.textures.length;
    setStrict(this._textureIndices, key, index);
    this._file.textures.push(texture);
    return index;
  }

  getSamplerIndex(key: string): Gltf.Index<Gltf.Sampler> {
    return getStrict(this._samplerIndices, key);
  }

  addSampler(key: string, sampler: Gltf.Sampler): Gltf.Index<Gltf.Sampler> {
    this._file.samplers ??= [];
    const index = this._file.samplers.length;
    setStrict(this._samplerIndices, key, index);
    this._file.samplers.push(sampler);
    return index;
  }
}
