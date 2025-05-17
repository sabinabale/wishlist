interface ToastItem {
  id: string;
  element: HTMLDivElement;
  top: number;
}

declare global {
  interface Window {
    activeToasts: ToastItem[];
  }
}

export default function showToast(
  message: string,
  duration: number = 1500
): void {
  if (!window.activeToasts) {
    window.activeToasts = [];
  }

  const toast = document.createElement("div");
  toast.textContent = message;

  const toastId = Date.now().toString();
  toast.dataset.toastId = toastId;

  Object.assign(toast.style, {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#333",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    opacity: "0",
    transition: "opacity 0.3s, top 0.3s",
    zIndex: "9999",
  });

  document.body.appendChild(toast);

  const positionToast = () => {
    let topPosition = 20;

    window.activeToasts.forEach((activeToast: ToastItem) => {
      if (document.body.contains(activeToast.element)) {
        topPosition = activeToast.top + activeToast.element.offsetHeight + 10;
      }
    });

    toast.style.top = `${topPosition}px`;

    window.activeToasts.push({
      id: toastId,
      element: toast,
      top: topPosition,
    });
  };

  positionToast();

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.addEventListener(
      "transitionend",
      () => {
        window.activeToasts = window.activeToasts.filter(
          (t: ToastItem) => t.id !== toastId
        );
        toast.remove();

        repositionToasts();
      },
      { once: true }
    );
  }, duration);
}

function repositionToasts(): void {
  let topPosition = 20;

  const sortedToasts = [...window.activeToasts].sort(
    (a: ToastItem, b: ToastItem) => a.top - b.top
  );

  sortedToasts.forEach((toast: ToastItem) => {
    toast.top = topPosition;
    toast.element.style.top = `${topPosition}px`;
    topPosition += toast.element.offsetHeight + 10;
  });
}
