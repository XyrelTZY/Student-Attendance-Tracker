import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: [
    "@nuxtjs/tailwindcss",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins = config.plugins || []; // Ensure plugins array exists
        config.plugins.push(vuetify({ autoImport: true })); // Add Vuetify plugin
      });
    },
  ],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  devtools: { enabled: true },
  css: [
    "../assets/global.scss",
    "vuetify/styles", // Vuetify core styles
  ],
  build: {
    transpile: ["vuetify"], // Ensure Vuetify is transpiled
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls, // Vuetify asset URL transformation
      },
    },
    define: {
      "process.env.DEBUG": false, // Suppress Vuetify warnings
    },
  },
});
