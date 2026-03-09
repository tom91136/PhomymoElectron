#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMMIT="${PHOMYMO_COMMIT:-${npm_package_config_phomymoCommit:-}}"
TMP_DIR="${ROOT_DIR}/vendor/.phomymo-tmp"
TARGET_DIR="${ROOT_DIR}/vendor/phomymo"

if [[ -z "${COMMIT}" ]]; then
  echo "Error: phomymo commit is required. Set PHOMYMO_COMMIT or package.json config.phomymoCommit." >&2
  exit 1
fi

TARBALL_URL="https://github.com/transcriptionstream/phomymo/archive/${COMMIT}.tar.gz"

rm -rf "${TMP_DIR}" "${TARGET_DIR}"
mkdir -p "${TMP_DIR}" "${ROOT_DIR}/vendor"

curl -fsSL "${TARBALL_URL}" | tar -xz -C "${TMP_DIR}"
mv "${TMP_DIR}"/phomymo-* "${TARGET_DIR}"
rm -rf "${TMP_DIR}"

echo "Synced phomymo at commit ${COMMIT}"
