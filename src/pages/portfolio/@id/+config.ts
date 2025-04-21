import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import * as config from "@vite-plugin-vercel/vike/config";

// https://vike.dev/config
export default {
  extends: [vikeReact, config],
  prerender: true,
  isr: { expiration: 15 },
  edge: false,
} satisfies Config;
