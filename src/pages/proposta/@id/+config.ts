import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

// https://vike.dev/config
export default {
  extends: [vikeReact],
  prerender: true,
} satisfies Config;
