"use client";

import { useEffect, useState } from "react";
import { IconCheck, IconX, IconAlertCircle } from "@tabler/icons-react";
import "./Toast.css";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = {
    success: <IconCheck size={18} />,
    error: <IconAlertCircle size={18} />,
    info: <IconAlertCircle size={18} />,
  };

  return (
    <div className={`toast toast-${toast.type} ${isExiting ? "exiting" : ""}`}>
      <span className="toast-icon">{icons[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close"
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onRemove(toast.id), 300);
        }}
      >
        <IconX size={16} />
      </button>
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage["type"], message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (message: string) => addToast("success", message);
  const error = (message: string) => addToast("error", message);
  const info = (message: string) => addToast("info", message);

  return { toasts, removeToast, success, error, info };
}
