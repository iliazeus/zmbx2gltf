import { Mbx } from "./mbx";

export class MbxExtractor {
  constructor(readonly file: Mbx.File) {}

  *getTextures(): Iterable<[string, Mbx.Base64String]> {
    for (const [index, pack] of Object.entries(this.file.textures)) {
      for (const [name, data] of Object.entries(pack.decoration ?? {})) {
        yield [`#/textures/${index}/decoration/${name}`, data];
      }
      for (const [name, data] of Object.entries(pack.bump ?? {})) {
        yield [`#/textures/${index}/bump/${name}`, data];
      }
      for (const [name, data] of Object.entries(pack.metalness ?? {})) {
        yield [`#/textures/${index}/metalness/${name}`, data];
      }
      for (const [name, data] of Object.entries(pack.normal ?? {})) {
        yield [`#/textures/${index}/normal/${name}`, data];
      }
      for (const [name, data] of Object.entries(pack.mask ?? {})) {
        yield [`#/textures/${index}/mask/${name}`, data];
      }
      for (const [name, data] of Object.entries(pack.color ?? {})) {
        yield [`#/textures/${index}/color/${name}`, data];
      }
      for (const [name, data] of Object.entries(pack.data ?? {})) {
        yield [`#/textures/${index}/data/${name}`, data];
      }
      for (const [name, data] of Object.entries(pack.custom?.color ?? {})) {
        yield [`#/textures/${index}/custom/color/${name}`, data];
      }
      for (const [name, data] of Object.entries(pack.custom?.data ?? {})) {
        yield [`#/textures/${index}/custom/data/${name}`, data];
      }
    }
  }

  *getGeometries(): Iterable<[string, Mbx.Geometry]> {
    for (const [index, pack] of Object.entries(this.file.geometries)) {
      for (const [name, geometry] of Object.entries(pack)) {
        yield [`#/geometries/${index}/${name}`, geometry];
      }
    }

    for (const [index, geometry] of Object.entries(this.file.details.logos)) {
      yield [`#/details/logos/${index}`, geometry];
    }
    for (const [index, geometry] of Object.entries(this.file.details.knobs)) {
      yield [`#/details/knobs/${index}`, geometry];
    }
    for (const [index, geometry] of Object.entries(this.file.details.tubes)) {
      yield [`#/details/tubes/${index}`, geometry];
    }
    for (const [index, geometry] of Object.entries(this.file.details.pins)) {
      yield [`#/details/pins/${index}`, geometry];
    }
  }

  *getConfigurations(): Iterable<[string, Mbx.Configuration]> {
    for (const [index, pack] of Object.entries(this.file.configurations)) {
      for (const [name, config] of Object.entries(pack)) {
        yield [`#/configurations/${index}/${name}`, config];
      }
    }
  }
}
