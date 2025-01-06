export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: [
    "@nuxtjs/tailwindcss",
  ],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  devtools: { enabled: true },
  css: ["../assets/global.scss"]
});