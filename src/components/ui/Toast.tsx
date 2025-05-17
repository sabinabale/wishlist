export default function showToast(
  message: string,
  duration: number = 3000
): void {
  const toast = document.createElement("div");
  toast.textContent = message;

  Object.assign(toast.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#333",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    opacity: "0",
    transition: "opacity 0.3s",
    zIndex: 9999,
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.addEventListener(
      "transitionend",
      () => {
        toast.remove();
      },
      { once: true }
    );
  }, duration);
}
