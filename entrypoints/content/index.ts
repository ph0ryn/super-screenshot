import { defineContentScript } from "wxt/utils/define-content-script";

import { registerCaptureHotkey } from "./keyboard";
import { SUPPORTED_CONTENT_SCRIPT_MATCHES } from "./sites";

export default defineContentScript({
  allFrames: false,
  main() {
    registerCaptureHotkey();
  },
  matches: SUPPORTED_CONTENT_SCRIPT_MATCHES,
  runAt: "document_idle",
});
