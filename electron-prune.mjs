import { rm } from 'node:fs/promises';
import path from 'node:path';

async function removeIfPresent(filePath) {
  await rm(filePath, { force: true, recursive: true });
}

export default async function afterPack(context) {
  const { appOutDir } = context;
  await Promise.all([
    removeIfPresent(path.join(appOutDir, 'libvk_swiftshader.so')),
    removeIfPresent(path.join(appOutDir, 'libvulkan.so.1')),
    removeIfPresent(path.join(appOutDir, 'vk_swiftshader_icd.json')),
  ]);
}
