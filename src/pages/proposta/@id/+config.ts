import vikeReact from "vike-react/config";

// https://vike.dev/config
export default {
  extends: [vikeReact],
  prerender: true,
  isr: { expiration: 60 },
};
