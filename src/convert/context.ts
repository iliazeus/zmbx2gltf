export interface Context {
  options: {
    logos: boolean;
    normalMaps: boolean;
    bumpMaps: boolean;
    decals: boolean;
    optimize: boolean;
  };

  dependencies: {
    jszip?: typeof import("jszip");
    jimp?: typeof import("jimp");
  };
}

export interface Options {
  logos?: boolean;
  normalMaps?: boolean;
  bumpMaps?: boolean;
  decals?: boolean;
  optimize?: boolean;
}

export interface Dependencies {
  jszip?: typeof import("jszip");
  jimp?: typeof import("jimp");
}

export const createContext = async (args: {
  options?: Options;
  dependencies?: Dependencies;
}): Promise<Context> => ({
  options: {
    logos: args.options?.logos ?? false,
    normalMaps: args.options?.normalMaps ?? false,
    bumpMaps: args.options?.bumpMaps ?? false,
    decals: args.options?.decals ?? false,
    optimize: args.options?.optimize ?? true,
  },

  dependencies: {
    jszip: args.dependencies?.jszip ?? (await import("jszip").catch(() => undefined)),
    jimp: args.dependencies?.jimp ?? (await import("jimp").catch(() => undefined)),
  },
});
