const TOAST_ID = "super-screenshot-toast";

export function showToast(message: string, tone: "error" | "success"): void {
  const previousToast = document.getElementById(TOAST_ID);

  previousToast?.remove();

  const toast = document.createElement("div");

  toast.id = TOAST_ID;
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.top = "16px";
  toast.style.right = "16px";
  toast.style.zIndex = "2147483647";
  toast.style.maxWidth = "360px";
  toast.style.padding = "10px 12px";
  toast.style.borderRadius = "6px";
  toast.style.background = "#b91c1c";

  if (tone === "success") {
    toast.style.background = "#0f766e";
  }

  toast.style.color = "#ffffff";
  toast.style.font = "13px/1.4 system-ui, sans-serif";
  toast.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.24)";

  document.documentElement.append(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2200);
}
