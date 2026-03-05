#!/usr/bin/env bash
set -euo pipefail

if [ -z "${BASE_URL:-}" ]; then
  echo "BASE_URL is required"
  exit 1
fi

USER_AGENT="${USER_AGENT:-astro-nano-probe}"

curl_get() {
  curl --fail --show-error --silent \
    --retry 5 --retry-delay 6 --retry-all-errors --connect-timeout 5 --max-time 20 \
    -H "User-Agent: ${USER_AGENT}" \
    "$1"
}

load_routes() {
  if [ -n "${ROUTES_FILE:-}" ]; then
    test -s "${ROUTES_FILE}"
    mapfile -t ROUTES < <(grep -Ev '^\s*(#|$)' "${ROUTES_FILE}")
  else
    ROUTES=("${@}")
  fi

  if [ "${#ROUTES[@]}" -eq 0 ]; then
    echo "No probe routes provided"
    exit 1
  fi
}

probe_routes() {
  local route
  for route in "${ROUTES[@]}"; do
    curl_get "${BASE_URL%/}${route}" >/dev/null
  done
}

assert_locales() {
  local locale html
  for locale in "$@"; do
    html="$(curl_get "${BASE_URL%/}/${locale}/")"
    grep -Eq "<html[^>]*lang=\"${locale}\"[^>]*>" <<<"${html}"
  done
}

load_routes "$@"
probe_routes

if [ -n "${ASSERT_LOCALES:-}" ]; then
  read -r -a locales <<<"${ASSERT_LOCALES}"
  assert_locales "${locales[@]}"
fi
