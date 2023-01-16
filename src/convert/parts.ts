import { Mbx } from "../mbx";
import { Gltf, GltfBuilder } from "../gltf";

import { Context } from "./context";
import { transpose } from "./utils";

import { convertMaterial } from "./materials";

export const convertParts = async (
  mbx: Mbx.File,
  gltf: GltfBuilder,
  ctx: Context
): Promise<void> => {
  const partNodeIndices: Gltf.Index<Gltf.Node>[] = [];

  for (const [partIndex, part] of mbx.parts.entries()) {
    partNodeIndices.push(await convertPart(`/parts/${partIndex}.json`, part, mbx, gltf, ctx));
  }

  gltf.setMainScene(
    gltf.addScene("/scene.json", {
      nodes: partNodeIndices,
    })
  );
};

const convertPart = async (
  path: string,
  part: Mbx.Part,
  mbx: Mbx.File,
  gltf: GltfBuilder,
  ctx: Context
): Promise<Gltf.Index<Gltf.Node>> => {
  const config = mbx.configurations[part.version][part.configuration]!;

  const materialIndex = await convertMaterial(
    part.material.base[0],
    config.normals,
    part.material.decoration,
    gltf,
    ctx
  );
  const node = convertConfiguration(path, config, materialIndex, mbx, gltf, ctx);

  return gltf.addNode(node.name!, {
    ...node,
    matrix: transpose(part.matrix),
  });
};

const convertConfiguration = (
  partPath: string,
  config: Mbx.Configuration,
  materialIndex: Gltf.Index<Gltf.Material> | undefined,
  mbx: Mbx.File,
  gltf: GltfBuilder,
  ctx: Context
): Gltf.Node => {
  const extraNodeIndices: Gltf.Index<Gltf.Node>[] = [];

  for (const [kind, extras] of Object.entries(config.geometry.extras)) {
    if (kind === "logos" && !ctx.options.logos) continue;

    for (const [index, extra] of extras.entries()) {
      const { node, mesh } = convertExtra(partPath, kind, index, extra, materialIndex, mbx, gltf);

      extraNodeIndices.push(
        gltf.addNode(node.name!, {
          ...node,
          mesh: gltf.addMesh(mesh.name!, mesh),
        })
      );
    }
  }

  const mainGeometryPath = `/geometries/${config.geometry.file}`;
  const mainGeometry = mbx.geometries[config.version][config.geometry.file];

  const uvLayerCount = mainGeometry.uvs?.length ?? 0;
  const uvs: Partial<Record<Gltf.PrimitiveAttributeName, Gltf.Index<Gltf.Accessor>>> = {};

  for (let i = 0; i < uvLayerCount; i++) {
    uvs[`TEXCOORD_${i}`] = gltf.getAccessorIndex(`${mainGeometryPath}#uvs/${i}`);
  }

  return {
    name: partPath + "#main",
    children: extraNodeIndices.length > 0 ? extraNodeIndices : undefined,
    mesh: gltf.addMesh(partPath + "#main", {
      name: partPath + "#main",
      primitives: [
        {
          material: materialIndex,
          indices: gltf.getAccessorIndex(mainGeometryPath + "#indices"),
          attributes: {
            POSITION: gltf.getAccessorIndex(mainGeometryPath + "#positions"),
            NORMAL: gltf.tryGetAccessorIndex(mainGeometryPath + "#normals"),
            ...uvs,
          },
        },
      ],
    }),
  };
};

const convertExtra = (
  partPath: string,
  kind: string,
  index: number,
  extra: Mbx.ConfigurationExtra,
  materialIndex: Gltf.Index<Gltf.Material> | undefined,
  mbx: Mbx.File,
  gltf: GltfBuilder
): {
  node: Gltf.Node;
  mesh: Gltf.Mesh;
} => {
  const extraGeometry = (mbx.details as any)[kind][extra.type] as Mbx.Geometry;

  const uvLayerCount = extraGeometry.uvs?.length ?? 0;
  const uvs: Partial<Record<Gltf.PrimitiveAttributeName, Gltf.Index<Gltf.Accessor>>> = {};

  for (let i = 0; i < uvLayerCount; i++) {
    uvs[`TEXCOORD_${i}`] = gltf.getAccessorIndex(`/details/${kind}/${extra.type}.json#uvs/${i}`);
  }

  return {
    node: {
      name: partPath + `#extra/${kind}/${index}`,
      translation: extra.transform.position,
      rotation: extra.transform.quaternion,
    },
    mesh: {
      name: partPath + `#extra/${kind}/${index}`,
      primitives: [
        {
          material: materialIndex,
          indices: gltf.getAccessorIndex(`/details/${kind}/${extra.type}.json#indices`),
          attributes: {
            POSITION: gltf.getAccessorIndex(`/details/${kind}/${extra.type}.json#positions`),
            NORMAL: gltf.tryGetAccessorIndex(`/details/${kind}/${extra.type}.json#normals`),
            ...uvs,
          },
        },
      ],
    },
  };
};
