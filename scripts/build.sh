#!/bin/sh

rm -rf ./dist
mkdir -p ./dist

tsc

esbuild \
  --bundle --sourcemap=inline --minify --charset=utf8 \
  --alias:zlib="browserify-zlib" \
  --format=iife --global-name=Zmbx2Gltf \
  --outfile=./zmbx2gltf.bundle.js \
  ./src/index.ts

esbuild \
  --bundle --sourcemap=inline --minify --charset=utf8 \
  --alias:zlib="browserify-zlib" \
  --format=esm \
  --outfile=./zmbx2gltf.bundle.mjs \
  ./src/index.ts
