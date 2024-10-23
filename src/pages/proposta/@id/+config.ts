import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import * as config from "@vite-plugin-vercel/vike/config";

// https://vike.dev/config
export default {
  extends: [vikeReact, config],
  prerender: true,
  isr: { expiration: 15 },
  edge: true,
  headers: {
    "Cache-Control": "public, max-age=15, s-maxage=15, stale-while-revalidate",
  },
} satisfies Config;
