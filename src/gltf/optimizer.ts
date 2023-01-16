import { Gltf } from "./types";

interface Ref<T> {
  get(): T;
  set(value: T): T;
}

const memberRef = <O, K extends keyof O>(o: O, k: K): Ref<O[K]> => ({
  get: () => o[k],
  set: (v) => (o[k] = v),
});

const maybeMemberRef = <T, K extends keyof any, O extends Partial<Record<K, T>>>(
  o: O | undefined,
  k: K
): Ref<O[K] | undefined> => ({
  get: () => o?.[k],
  set: (v) => (o ? (o[k] = v!) : v),
});

const collectUnused = <T>(
  arrayRef: Ref<T[] | undefined>,
  indexRefs: () => Iterable<Ref<number | undefined>>
): void => {
  const array = arrayRef.get();
  if (!array) return;

  const used = new Set<number>();
  for (const ref of indexRefs()) {
    const index = ref.get();
    if (index !== undefined) used.add(index);
  }

  if (used.size === 0) {
    arrayRef.set(undefined);
    return;
  }

  const indexMap = new Map<number, number>();
  let i = 0;
  for (const u of used) indexMap.set(u, i++);

  for (const ref of indexRefs()) {
    const index = ref.get();
    if (index !== undefined) ref.set(indexMap.get(index));
  }

  const newArray = array.slice(0, indexMap.size);
  for (const [oldIndex, newIndex] of indexMap) {
    newArray[newIndex] = array[oldIndex];
  }

  arrayRef.set(newArray);
};

const dedup = <T, H>(
  arrayRef: Ref<T[] | undefined>,
  hashFn: (t: T) => H,
  indexRefs: () => Iterable<Ref<number | undefined>>
): void => {
  const array = arrayRef.get();
  if (!array) return;

  const indexMap = new Map<number, number>();
  const hashMap = new Map<H, number>();

  for (const [index, value] of array.entries()) {
    const hash = hashFn(value);
    const existingIndex = hashMap.get(hash);

    if (existingIndex !== undefined) {
      indexMap.set(index, existingIndex);
    } else {
      hashMap.set(hash, index);
    }
  }

  for (const ref of indexRefs()) {
    const index = ref.get();
    if (index !== undefined) ref.set(indexMap.get(index) ?? index);
  }

  collectUnused(arrayRef, indexRefs);
};

export class GltfOptimizer {
  constructor(readonly file: Gltf.File) {}

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

  private _collectUnusedTexCoords(): void {
    for (const mesh of this.file.meshes ?? []) {
      for (const prim of mesh.primitives) {
        const mat = prim.material ? this.file.materials?.[prim.material] : undefined;

        const refs = [
          maybeMemberRef(mat?.emissiveTexture, "texCoord"),
          maybeMemberRef(mat?.normalTexture, "texCoord"),
          maybeMemberRef(mat?.occlusionTexture, "texCoord"),
          maybeMemberRef(mat?.pbrMetallicRoughness?.baseColorTexture, "texCoord"),
          maybeMemberRef(mat?.pbrMetallicRoughness?.metallicTexture, "texCoord"),
          maybeMemberRef(mat?.pbrMetallicRoughness?.roughnessTexture, "texCoord"),
        ];

        const used = new Set<number>();
        for (const ref of refs) {
          const index = ref.get();
          if (index !== undefined) used.add(index);
        }

        const indexMap = new Map<number, number>();
        let i = 0;
        for (const u of used) indexMap.set(u, i++);

        for (const ref of refs) {
          const index = ref.get();
          if (index !== undefined) ref.set(indexMap.get(index));
        }

        for (const [oldIndex, newIndex] of indexMap) {
          prim.attributes[`TEXCOORD_${newIndex}`] = prim.attributes[`TEXCOORD_${oldIndex}`];
        }

        for (let i = used.size; `TEXCOORD_${i}` in prim.attributes; i++) {
          delete prim.attributes[`TEXCOORD_${i}`];
        }
      }
    }
  }

  collectUnused(targets: {
    textures: boolean;
    samplers: boolean;
    images: boolean;
    texCoords: boolean;
    accessors: boolean;
    bufferViews: boolean;
    buffers: boolean;
  }): void {
    // the order is important: top-to-bottom
    /* prettier-ignore */ {
      if (targets.textures)
        collectUnused(memberRef(this.file, "textures"), () => this._textureIndexRefs());
      if (targets.samplers)
        collectUnused(memberRef(this.file, "samplers"), () => this._samplerIndexRefs());
      if (targets.images)
        collectUnused(memberRef(this.file, "images"), () => this._imageIndexRefs());
      if (targets.texCoords)
        this._collectUnusedTexCoords();
      if (targets.accessors)
        collectUnused(memberRef(this.file, "accessors"), () => this._accessorIndexRefs());
      if (targets.bufferViews)
        collectUnused(memberRef(this.file, "bufferViews"), () => this._bufferViewIndexRefs());
      if (targets.buffers)
        collectUnused(memberRef(this.file, "buffers"), () => this._bufferIndexRefs());
    }
  }

  deduplicate(targets: {
    buffers: boolean;
    bufferViews: boolean;
    accessors: boolean;
    images: boolean;
    samplers: boolean;
    textures: boolean;
  }): void {
    const hashFn = <T extends { name?: string }>({ name, ...rest }: T) => JSON.stringify(rest);

    // the order is important: bottom-to-top
    // TODO: more optimal hash functions?
    /* prettier-ignore */ {
      if (targets.buffers)
        dedup(memberRef(this.file, "buffers"), hashFn, () => this._bufferIndexRefs());
      if (targets.bufferViews)
        dedup(memberRef(this.file, "bufferViews"), hashFn, () => this._bufferViewIndexRefs());
      if (targets.accessors)
        dedup(memberRef(this.file, "accessors"), hashFn, () => this._accessorIndexRefs());
      if (targets.images)
        dedup(memberRef(this.file, "images"), hashFn, () => this._imageIndexRefs());
      if (targets.samplers)
        dedup(memberRef(this.file, "samplers"), hashFn, () => this._samplerIndexRefs());
      if (targets.textures)
        dedup(memberRef(this.file, "textures"), hashFn, () => this._textureIndexRefs());
    }
  }
}
