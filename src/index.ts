export * from "./mbx";
export * from "./gltf";
export * from "./convert";

import { convertMbxToGltf, convertZmbxToGltf } from "./convert";

declare global {
  interface Window {
    convertMbxToGltf: typeof convertMbxToGltf;
    convertZmbxToGltf: typeof convertZmbxToGltf;
  }
}

if (typeof window !== "undefined") {
  window.convertMbxToGltf = convertMbxToGltf;
  window.convertZmbxToGltf = convertZmbxToGltf;
}
