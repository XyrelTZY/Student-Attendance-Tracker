import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: [
    "@nuxtjs/tailwindcss",
    // Use a function to extend Vite config for Vuetify
    (_options: any, nuxt: any) => {
      nuxt.hooks.hook("vite:extendConfig", (config: any) => {
        config.plugins = config.plugins || []; 
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  axios: {
    proxy: true,
  },
  proxy: {
    '/api': 'http://localhost:5251',
  },
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