export * from "./mbx";
export * from "./gltf";
export * from "./convert";

import { convertMbxToGltf, convertZmbxToGltf } from "./convert";

if (typeof window !== "undefined") {
  (window as any).convertMbxToGltf = convertMbxToGltf;
  (window as any).convertZmbxToGltf = convertZmbxToGltf;
}
