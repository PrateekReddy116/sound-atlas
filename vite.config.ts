// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

/**
 * The devtools source-tagger adds `data-tsd-source` to every JSX element.
 * react-three-fiber throws on unknown props, so strip the attribute from the
 * 3D scene files after tagging (post-order) — DOM files keep it.
 */
function stripSourceTagsFromThreeScene(): Plugin {
  return {
    name: "atlas-strip-source-tags-in-three-scene",
    enforce: "post",
    transform(code, id) {
      if (!/src\/components\/world\//.test(id)) return null;
      if (!code.includes("data-tsd-source")) return null;
      return {
        code: code.replace(/"data-tsd-source":\s*"[^"]*",?/g, ""),
        map: null,
      };
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [stripSourceTagsFromThreeScene()],
  },
});
