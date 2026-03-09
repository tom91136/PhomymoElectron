# Phomymo Electron

Electron wrapper for [transcriptionstream/phomymo](https://github.com/transcriptionstream/phomymo) with WebUSB and WebSerial enabled.

## How upstream sync works

The web app source is downloaded on install from a pinned commit in `package.json` (`config.phomymoCommit`) into `vendor/phomymo`.

Update the pin and resync:

```bash
# edit package.json -> config.phomymoCommit
npm run sync:phomymo
```

## Local development

Requirements:

- Node.js 22+
- npm

Install deps and sync pinned upstream:

```bash
npm install
```

Run the app:

```bash
npm start
```

Lint TypeScript:

```bash
npm run lint
```

## Build RPM locally

```bash
npm run dist:rpm
```

Output:

- `dist/phomymo-electron-<version>.x86_64.rpm`

Notes:

- `rpmbuild` must be installed (`rpm` package on many distros).
- If local RPM build fails due to host dependencies, use GitHub Actions build.
- Compatibility note: older `electron-builder` bundles older `fpm`/Ruby toolchains that can fail on newer RPM stacks (for example RPM 6). This project now uses current versions (`electron-builder 26.8.1`, `fpm 1.17` via electron-builder binaries).

### Package size optimizations

This project currently applies these footprint reductions during packaging:

- Keep only `en-US` Electron locale (`build.electronLanguages`).
- Prune optional runtime libs in `afterPack`:
  - `libffmpeg.so`
  - `libvk_swiftshader.so`
  - `libvulkan.so.1`
  - `vk_swiftshader_icd.json`

Tradeoff:

- Media codec playback support and WebGPU/Vulkan software fallback are intentionally removed.
- WebUSB/WebSerial and the current Phomymo workflow are preserved.

### Troubleshooting `npm run dist:rpm`

If you see:

```text
rpmbuild: command not found
```

install RPM tooling and retry:

Fedora/RHEL:

```bash
sudo dnf install -y rpm-build
npm run dist:rpm
```

Ubuntu/Debian:

```bash
sudo apt-get update
sudo apt-get install -y rpm
npm run dist:rpm
```

## Build with GitHub Actions

Workflow file: `.github/workflows/build-rpm.yml`

Triggers:

- Push to `main`
- Pull requests
- Manual trigger (`workflow_dispatch`)

Artifact:

- `phomymo-rpm` containing `dist/*.rpm` and metadata files.
