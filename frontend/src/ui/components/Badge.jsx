import React from "react";
import clsx from "clsx";

/**
 * Badge Component
 * For status indicators, tags, and labels
 */

const Badge = ({
    children,
    variant = "default",
    size = "md",
    className = "",
    ...props
}) => {
    const baseStyles = "badge font-medium transition-colors";

    const variants = {
        default: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
        primary: "bg-primary/10 text-primary border border-primary/20",
        success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        outline: "border border-border text-foreground bg-transparent",
    };

    const sizes = {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-3 py-1",
        lg: "text-base px-4 py-1.5",
    };

    return (
        <span
            className={clsx(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
