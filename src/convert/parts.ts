import { Mbx } from "../mbx";
import { Gltf, GltfBuilder } from "../gltf";

import { transpose } from "./utils";
import { convertMaterial } from "./materials";

export const convertParts = (mbx: Mbx.File, gltf: GltfBuilder): void => {
  const partNodeIndices: Gltf.Index<Gltf.Node>[] = [];

  for (const [partIndex, part] of mbx.parts.entries()) {
    partNodeIndices.push(convertPart(`/parts/${partIndex}.json`, part, mbx, gltf));
  }

  gltf.setMainScene(
    gltf.addScene("/scene.json", {
      nodes: partNodeIndices,
    })
  );
};

const convertPart = (
  path: string,
  part: Mbx.Part,
  mbx: Mbx.File,
  gltf: GltfBuilder
): Gltf.Index<Gltf.Node> => {
  const materialIndex = convertMaterial(part.material.base[0], gltf);

  const config = mbx.configurations[part.version][part.configuration]!;
  const node = convertConfiguration(path, config, materialIndex, gltf);

  return gltf.addNode(node.name!, {
    ...node,
    matrix: transpose(part.matrix),
  });
};

const convertConfiguration = (
  partPath: string,
  config: Mbx.Configuration,
  materialIndex: Gltf.Index<Gltf.Material> | undefined,
  gltf: GltfBuilder
): Gltf.Node => {
  const extraNodeIndices: Gltf.Index<Gltf.Node>[] = [];

  for (const [kind, extras] of Object.entries(config.geometry.extras)) {
    for (const [index, extra] of extras.entries()) {
      const { node, mesh } = convertExtra(partPath, kind, index, extra, materialIndex, gltf);

      extraNodeIndices.push(
        gltf.addNode(node.name!, {
          ...node,
          mesh: gltf.addMesh(mesh.name!, mesh),
        })
      );
    }
  }

  const mainGeometryPath = `/geometries/${config.geometry.file}`;

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
  gltf: GltfBuilder
): {
  node: Gltf.Node;
  mesh: Gltf.Mesh;
} => ({
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
        },
      },
    ],
  },
});
