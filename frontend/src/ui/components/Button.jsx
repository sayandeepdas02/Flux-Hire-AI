import React from "react";
import clsx from "clsx";

/**
 * Premium Button Component
 * Supports multiple variants, sizes, states, and icons
 */

const Button = React.forwardRef(({
  children,
  className = "",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = "left",
  ...props
}, ref) => {
  const baseStyles = "btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
    outline: "border-2 border-border bg-transparent text-foreground hover:bg-bg-dark dark:hover:bg-slate-800",
    ghost: "bg-transparent text-body hover:bg-bg-dark hover:text-foreground dark:hover:bg-slate-800",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md gap-1.5",
    md: "px-4 py-2 text-base rounded-lg gap-2",
    lg: "px-6 py-3 text-lg rounded-lg gap-2.5",
    xl: "px-8 py-4 text-xl rounded-xl gap-3",
    icon: "p-2 rounded-lg",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {!loading && icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
