export interface Options {
  logos: boolean;
  normalMaps: boolean;
  bumpMaps: boolean;
  decals: boolean;
  optimize: boolean;
}

export const getDefaultOptions = (): Options => ({
  logos: false,
  normalMaps: false,
  bumpMaps: false,
  decals: true,
  optimize: true,
});
