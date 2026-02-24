"use client";

import React from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ModalType = "success" | "error" | "info" | "warning";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: ModalType;
  title: string;
  children: React.ReactNode;
  primaryButton?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "accent" | "outline" | "destructive";
  };
  secondaryButton?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "accent" | "outline" | "destructive";
  };
  showCloseButton?: boolean;
  className?: string;
}

const iconMap: Record<ModalType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const iconColorMap: Record<ModalType, string> = {
  success: "text-green-600",
  error: "text-red-600",
  info: "text-blue-600",
  warning: "text-amber-600",
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  type = "info",
  title,
  children,
  primaryButton,
  secondaryButton,
  showCloseButton = true,
  className,
}) => {
  if (!isOpen) return null;

  const Icon = iconMap[type];
  const iconColor = iconColorMap[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        className={cn(
          "relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Header with icon */}
        <div className="flex items-center gap-3">
          <Icon className={cn("h-8 w-8 flex-shrink-0", iconColor)} />
          <h3 id="modal-title" className="text-xl font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="space-y-2 text-gray-700">{children}</div>

        {/* Buttons */}
        {(primaryButton || secondaryButton) && (
          <div className="flex gap-3 pt-2">
            {secondaryButton && (
              <Button
                onClick={secondaryButton.onClick}
                variant={secondaryButton.variant || "outline"}
                className="flex-1"
              >
                {secondaryButton.label}
              </Button>
            )}
            {primaryButton && (
              <Button
                onClick={primaryButton.onClick}
                variant={primaryButton.variant || "default"}
                className={secondaryButton ? "flex-1" : "w-full"}
              >
                {primaryButton.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
