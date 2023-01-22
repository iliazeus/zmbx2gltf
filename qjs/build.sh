#!/bin/sh

qjsc main.js \
  -fno-eval \
  -fno-string-normalize \
  -fno-proxy \
  -fno-bigint \
  -flto \
  -o zmbx2gltf
