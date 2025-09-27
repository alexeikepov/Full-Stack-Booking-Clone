import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "text-green-600",
    title: "text-green-900",
    description: "text-green-700",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-600",
    title: "text-red-900",
    description: "text-red-700",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "text-yellow-600",
    title: "text-yellow-900",
    description: "text-yellow-700",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-600",
    title: "text-blue-900",
    description: "text-blue-700",
  },
};

export function Toast({
  id,
  type,
  title,
  description,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match animation duration
  };

  const Icon = toastIcons[type];
  const styles = toastStyles[type];

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${
          isVisible && !isLeaving
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95"
        }
      `}
    >
      <div
        className={`
          ${styles.bg} ${styles.border}
          border rounded-lg shadow-lg p-4
          backdrop-blur-sm
        `}
      >
        <div className="flex items-start gap-3">
          <div className={`p-1 rounded-full ${styles.bg}`}>
            <Icon className={`h-5 w-5 ${styles.icon}`} />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm ${styles.title}`}>{title}</h4>
            {description && (
              <p className={`text-sm mt-1 ${styles.description}`}>
                {description}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
  }>;
  onRemoveToast: (id: string) => void;
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onRemoveToast} />
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: ToastType;
      title: string;
      description?: string;
      duration?: number;
    }>
  >([]);

  const addToast = (toast: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (title: string, description?: string, duration?: number) => {
    addToast({ type: "success", title, description, duration });
  };

  const error = (title: string, description?: string, duration?: number) => {
    addToast({ type: "error", title, description, duration });
  };

  const warning = (title: string, description?: string, duration?: number) => {
    addToast({ type: "warning", title, description, duration });
  };

  const info = (title: string, description?: string, duration?: number) => {
    addToast({ type: "info", title, description, duration });
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
