import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

// https://vike.dev/config
export default {
  extends: [vikeReact],
  prerender: true,
  isr: { expiration: 15 },
  // Target Edge instead of Serverless
  edge: true,
  // append headers to all responses
  headers: {
    "X-Header": "value",
  },
} satisfies Config;
