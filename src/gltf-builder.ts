import { Gltf } from "./gltf";

const getStrict = <K, V>(map: Map<K, V>, key: K): V => {
  const value = map.get(key);
  if (value === undefined) throw new RangeError();
  return value;
};

const setStrict = <K, V>(map: Map<K, V>, key: K, value: V): void => {
  if (map.has(key)) throw new RangeError();
  map.set(key, value);
};

export class GltfBuilder {
  private _file!: Gltf.File;

  private _imageIndexes!: Map<string, number>;
  private _bufferIndexes!: Map<string, number>;
  private _bufferViewIndexes!: Map<string, number>;
  private _accessorIndexes!: Map<string, number>;
  private _meshIndexes!: Map<string, number>;
  private _nodeIndexes!: Map<string, number>;
  private _sceneIndexes!: Map<string, number>;

  constructor() {
    this.reset();
  }

  reset(): void {
    this._file = { asset: { version: "2.0" } };

    this._imageIndexes = new Map();
    this._bufferIndexes = new Map();
    this._bufferViewIndexes = new Map();
    this._accessorIndexes = new Map();
    this._meshIndexes = new Map();
    this._nodeIndexes = new Map();
    this._sceneIndexes = new Map();
  }

  build(): Gltf.File {
    const file = this._file;
    this.reset();
    return file;
  }

  setMetadata(metadata: Partial<Gltf.Asset>): void {
    Object.assign(this._file.asset, metadata);
  }

  setMainScene(index: Gltf.Index<Gltf.Scene>): void {
    this._file.scene = index;
  }

  getImageIndex(key: string): Gltf.Index<Gltf.Image> {
    return getStrict(this._imageIndexes, key);
  }

  addImage(key: string, image: Gltf.Image): Gltf.Index<Gltf.Image> {
    this._file.images ??= [];
    const index = this._file.images.length;
    setStrict(this._imageIndexes, key, index);
    this._file.images.push(image);
    return index;
  }

  getBufferIndex(key: string): Gltf.Index<Gltf.Buffer> {
    return getStrict(this._bufferIndexes, key);
  }

  addBuffer(key: string, buffer: Gltf.Buffer): Gltf.Index<Gltf.Buffer> {
    this._file.buffers ??= [];
    const index = this._file.buffers.length;
    setStrict(this._bufferIndexes, key, index);
    this._file.buffers.push(buffer);
    return index;
  }

  getBufferViewIndex(key: string): Gltf.Index<Gltf.BufferView> {
    return getStrict(this._bufferViewIndexes, key);
  }

  addBufferView(key: string, bufferView: Gltf.BufferView): Gltf.Index<Gltf.BufferView> {
    this._file.bufferViews ??= [];
    const index = this._file.bufferViews.length;
    setStrict(this._bufferViewIndexes, key, index);
    this._file.bufferViews.push(bufferView);
    return index;
  }

  getAccessorIndex(key: string): Gltf.Index<Gltf.Accessor> {
    return getStrict(this._accessorIndexes, key);
  }

  addAccessor(key: string, accessor: Gltf.Accessor): Gltf.Index<Gltf.Accessor> {
    this._file.accessors ??= [];
    const index = this._file.accessors.length;
    setStrict(this._accessorIndexes, key, index);
    this._file.accessors.push(accessor);
    return index;
  }

  getMeshIndex(key: string): Gltf.Index<Gltf.Mesh> {
    return getStrict(this._meshIndexes, key);
  }

  addMesh(key: string, mesh: Gltf.Mesh): Gltf.Index<Gltf.Mesh> {
    this._file.meshes ??= [];
    const index = this._file.meshes.length;
    setStrict(this._meshIndexes, key, index);
    this._file.meshes.push(mesh);
    return index;
  }

  getNodeIndex(key: string): Gltf.Index<Gltf.Node> {
    return getStrict(this._nodeIndexes, key);
  }

  addNode(key: string, node: Gltf.Node): Gltf.Index<Gltf.Node> {
    this._file.nodes ??= [];
    const index = this._file.nodes.length;
    setStrict(this._nodeIndexes, key, index);
    this._file.nodes.push(node);
    return index;
  }

  getSceneIndex(key: string): Gltf.Index<Gltf.Scene> {
    return getStrict(this._sceneIndexes, key);
  }

  addScene(key: string, scene: Gltf.Scene): Gltf.Index<Gltf.Scene> {
    this._file.scenes ??= [];
    const index = this._file.scenes.length;
    setStrict(this._sceneIndexes, key, index);
    this._file.scenes.push(scene);
    return index;
  }
}
