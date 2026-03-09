# Phomymo Electron

Electron wrapper for [transcriptionstream/phomymo](https://github.com/transcriptionstream/phomymo) with WebUSB and WebSerial enabled.

The web app source is synced from a pinned commit in `package.json` (`config.phomymoCommit`) into `vendor/phomymo`.

```bash
npm run sync:phomymo
```

To update upstream:

1. Change `config.phomymoCommit` in `package.json`.
2. Run `npm run sync:phomymo`.

## Local development

Requirements:

- Node.js 22+
- npm

```bash
npm install
npm start
npm run lint
```

## Build packages

Requirements:

- Node.js 22+
- npm
- RPM tooling:
  - Ubuntu/Debian: `rpm` (`sudo apt-get install -y rpm`)
  - Fedora: `rpm-build` (`sudo dnf install -y rpm-build`)
- DEB tooling:
  - Ubuntu/Debian: `dpkg`/`dpkg-deb` (normally preinstalled)

```bash
npm run dist:rpm
npm run dist:deb
npm run dist:appimage
npm run dist:linux
```

All artifacts in `dist/`