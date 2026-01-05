import React from "react";
import clsx from "clsx";

/**
 * Premium Input Component
 * Supports labels, helper text, error states, and icons
 */

const Input = React.forwardRef(({
    label,
    helperText,
    error,
    className = "",
    containerClassName = "",
    leftIcon,
    rightIcon,
    ...props
}, ref) => {
    const baseStyles = "input";
    const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";
    const iconPadding = leftIcon ? "pl-10" : rightIcon ? "pr-10" : "";

    return (
        <div className={clsx("w-full", containerClassName)}>
            {label && (
                <label className="block text-sm font-medium text-foreground mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={clsx(
                        baseStyles,
                        errorStyles,
                        iconPadding,
                        className
                    )}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {rightIcon}
                    </div>
                )}
            </div>
            {(helperText || error) && (
                <p className={clsx(
                    "mt-1.5 text-sm",
                    error ? "text-red-600" : "text-muted-foreground"
                )}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

// Textarea variant
export const Textarea = React.forwardRef(({
    label,
    helperText,
    error,
    className = "",
    containerClassName = "",
    rows = 4,
    ...props
}, ref) => {
    const baseStyles = "input resize-none";
    const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";

    return (
        <div className={clsx("w-full", containerClassName)}>
            {label && (
                <label className="block text-sm font-medium text-foreground mb-2">
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                rows={rows}
                className={clsx(
                    baseStyles,
                    errorStyles,
                    className
                )}
                {...props}
            />
            {(helperText || error) && (
                <p className={clsx(
                    "mt-1.5 text-sm",
                    error ? "text-red-600" : "text-muted-foreground"
                )}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Textarea.displayName = "Textarea";

export default Input;
