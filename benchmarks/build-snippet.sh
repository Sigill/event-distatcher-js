#!/bin/bash
set -e

# Bundle the benchmarks into a single file for use in the browser.
# We include --bundle so that it resolves all imports internally.
npx esbuild benchmarks/snippet-entry.ts --bundle --outfile=benchmarks/dist/snippet.js --platform=browser --minify

echo "Benchmark snippet bundled to benchmarks/dist/snippet.js"
