import { Gltf } from "./types";

const addIfPresent = <T>(set: Set<T>, value: T | undefined): void => {
  if (value !== undefined) set.add(value);
};

interface Ref<T> {
  get(): T;
  set(value: T): T;
  debug(): void;
}

const memberRef = <O, K extends keyof O>(o: O, k: K): Ref<O[K]> => ({
  get: () => o[k],
  set: (v) => (o[k] = v),
  debug: () => console.log(o),
});

export class GltfOptimizer {
  constructor(readonly file: Gltf.File) {}

  private _collectUnused<T>(
    arrayRef: Ref<T[] | undefined>,
    indexRefs: () => Iterable<Ref<number | undefined>>
  ): void {
    const array = arrayRef.get();
    if (!array) return;

    const used = new Set<number>();
    for (const ref of indexRefs()) {
      const value = ref.get();
      if (value !== undefined) used.add(value);
    }

    if (used.size === 0) {
      arrayRef.set(undefined);
      return;
    }

    const indexMap = new Map<number, number>();
    let i = 0;
    for (const u of used) indexMap.set(u, i++);

    for (const ref of indexRefs()) {
      const value = ref.get();
      if (value !== undefined) ref.set(indexMap.get(value));
    }

    const newArray = array.slice(0, indexMap.size);
    for (const [oldIndex, newIndex] of indexMap) {
      newArray[newIndex] = array[oldIndex];
    }

    arrayRef.set(newArray);
  }

  private *_textureIndexRefs(): Iterable<Ref<Gltf.Index<Gltf.Texture>>> {
    for (const m of this.file.materials ?? []) {
      if (m.emissiveTexture) yield memberRef(m.emissiveTexture, "index");
      if (m.normalTexture) yield memberRef(m.normalTexture, "index");
      if (m.occlusionTexture) yield memberRef(m.occlusionTexture, "index");

      const pbr = m.pbrMetallicRoughness;
      if (pbr?.baseColorTexture) yield memberRef(pbr.baseColorTexture, "index");
      if (pbr?.metallicTexture) yield memberRef(pbr.metallicTexture, "index");
      if (pbr?.roughnessTexture) yield memberRef(pbr.roughnessTexture, "index");
    }
  }

  private *_samplerIndexRefs(): Iterable<Ref<Gltf.Index<Gltf.Sampler> | undefined>> {
    for (const t of this.file.textures ?? []) {
      yield memberRef(t, "sampler");
    }
  }

  private *_imageIndexRefs(): Iterable<Ref<Gltf.Index<Gltf.Image> | undefined>> {
    for (const t of this.file.textures ?? []) {
      yield memberRef(t, "source");
    }
  }

  private *_accessorIndexRefs(): Iterable<Ref<Gltf.Index<Gltf.Accessor> | undefined>> {
    for (const m of this.file.meshes ?? []) {
      for (const p of m.primitives) {
        yield memberRef(p, "indices");
        for (const attr in p.attributes) yield memberRef(p.attributes, attr as any);
      }
    }

    for (const s of this.file.skins ?? []) {
      yield memberRef(s, "inverseBindMatrices");
    }

    for (const a of this.file.animations ?? []) {
      for (const s of a.samplers ?? []) {
        yield memberRef(s, "input");
        yield memberRef(s, "output");
      }
    }
  }

  private *_bufferViewIndexRefs(): Iterable<Ref<Gltf.Index<Gltf.BufferView> | undefined>> {
    for (const a of this.file.accessors ?? []) {
      yield memberRef(a, "bufferView");
    }

    for (const im of this.file.images ?? []) {
      yield memberRef(im, "bufferView");
    }
  }

  private *_bufferIndexRefs(): Iterable<Ref<Gltf.Index<Gltf.Buffer> | undefined>> {
    for (const bv of this.file.bufferViews ?? []) {
      yield memberRef(bv, "buffer");
    }
  }

  removeUnusedTextures(): void {
    this._collectUnused(memberRef(this.file, "textures"), () => this._textureIndexRefs());
  }

  removeUnusedSamplers(): void {
    this._collectUnused(memberRef(this.file, "samplers"), () => this._samplerIndexRefs());
  }

  removeUnusedImages(): void {
    this._collectUnused(memberRef(this.file, "images"), () => this._imageIndexRefs());
  }

  removeUnusedTexCoords(): void {
    for (const mesh of this.file.meshes ?? []) {
      for (const prim of mesh.primitives) {
        const mat = prim.material ? this.file.materials?.[prim.material] : undefined;

        const usedTexCoords = new Set();

        addIfPresent(usedTexCoords, mat?.emissiveTexture?.texCoord);
        addIfPresent(usedTexCoords, mat?.normalTexture?.texCoord);
        addIfPresent(usedTexCoords, mat?.occlusionTexture?.texCoord);

        addIfPresent(usedTexCoords, mat?.pbrMetallicRoughness?.baseColorTexture?.texCoord);
        addIfPresent(usedTexCoords, mat?.pbrMetallicRoughness?.metallicTexture?.texCoord);
        addIfPresent(usedTexCoords, mat?.pbrMetallicRoughness?.roughnessTexture?.texCoord);

        const usedTexCoordAttrs = new Set([...usedTexCoords].map((n) => `TEXCOORD_${n}`));

        for (const attr in prim.attributes) {
          if (attr.startsWith("TEXCOORD_") && !usedTexCoordAttrs.has(attr)) {
            delete prim.attributes[attr as any];
          }
        }
      }
    }
  }

  removeUnusedAccessors(): void {
    this._collectUnused(memberRef(this.file, "accessors"), () => this._accessorIndexRefs());
  }

  removeUnusedBufferViews(): void {
    this._collectUnused(memberRef(this.file, "bufferViews"), () => this._bufferViewIndexRefs());
  }

  removeUnusedBuffers(): void {
    this._collectUnused(memberRef(this.file, "buffers"), () => this._bufferIndexRefs());
  }
}
