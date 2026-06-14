import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    action: {},
    description: "Capture supported video and page elements to the clipboard.",
    name: "SuperScreenshot",
    permissions: ["clipboardWrite"],
  },
});
