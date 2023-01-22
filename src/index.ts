export * from "./mbx";
export * from "./gltf";
export * from "./convert";

import {
  convertMbxToGltf as _convertMbxToGltf,
  convertZmbxToGltf as _convertZmbxToGltf,
} from "./convert";

declare global {
  const convertMbxToGltf: typeof _convertMbxToGltf;
  const convertZmbxToGltf: typeof _convertZmbxToGltf;
}

(globalThis as any).convertMbxToGltf = _convertMbxToGltf;
(globalThis as any).convertZmbxToGltf = _convertZmbxToGltf;
