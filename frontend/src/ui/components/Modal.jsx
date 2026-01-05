import React, { useEffect } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

/**
 * Premium Modal Component
 * Clean, accessible modal with backdrop and animations
 */

const Modal = ({
    isOpen,
    onClose,
    children,
    size = "md",
    className = "",
    closeOnBackdrop = true,
    showCloseButton = true,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
        full: "max-w-full mx-4",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={closeOnBackdrop ? onClose : undefined}
            />

            {/* Modal */}
            <div
                className={clsx(
                    "relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full animate-in zoom-in-95 fade-in duration-200",
                    sizes[size],
                    className
                )}
            >
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-bg-dark dark:hover:bg-slate-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
                {children}
            </div>
        </div>
    );
};

// Modal sub-components
const ModalHeader = ({ children, className = "", ...props }) => (
    <div className={clsx("px-6 pt-6 pb-4 border-b border-border dark:border-slate-700", className)} {...props}>
        {children}
    </div>
);

const ModalTitle = ({ children, className = "", ...props }) => (
    <h2 className={clsx("text-2xl font-semibold text-foreground pr-8", className)} {...props}>
        {children}
    </h2>
);

const ModalDescription = ({ children, className = "", ...props }) => (
    <p className={clsx("text-sm text-body mt-2", className)} {...props}>
        {children}
    </p>
);

const ModalContent = ({ children, className = "", ...props }) => (
    <div className={clsx("px-6 py-6 max-h-[60vh] overflow-y-auto", className)} {...props}>
        {children}
    </div>
);

const ModalFooter = ({ children, className = "", ...props }) => (
    <div className={clsx("px-6 py-4 border-t border-border dark:border-slate-700 flex items-center justify-end gap-3", className)} {...props}>
        {children}
    </div>
);

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
