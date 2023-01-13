export interface Options {
  logos: boolean;
  normalMaps: boolean;
  bumpMaps: boolean;
  decals: boolean;
}

export const getDefaultOptions = (): Options => ({
  logos: false,
  normalMaps: false,
  bumpMaps: false,
  decals: false,
});
