import vikeReact from "vike-react/config";

// https://vike.dev/config
export default {
  extends: [vikeReact],
  prerender: true,
  meta: {
    isr: {
      expiration: 60, 
    },
  },
};
