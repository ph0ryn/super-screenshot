import { defineContentScript } from "wxt/utils/define-content-script";

export default defineContentScript({
  main() {
    console.log("Hello content.");
  },
  matches: ["*://*.google.com/*"],
});
