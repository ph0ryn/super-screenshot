import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    action: {},
    description: "Take screenshots from several videos and livestreams frame",
    name: "SuperScreenshot",
    permissions: ["clipboardWrite"],
  },
});
