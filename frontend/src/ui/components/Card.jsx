import React from "react";
import clsx from "clsx";

/**
 * Premium Card Component
 * Clean, modern card with variants and hover effects
 */

const Card = React.forwardRef(({
    children,
    className = "",
    variant = "default",
    hoverable = false,
    padding = "default",
    ...props
}, ref) => {
    const baseStyles = "bg-white dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 transition-all duration-200";

    const variants = {
        default: "shadow-sm",
        elevated: "shadow-md",
        outlined: "shadow-none border-2",
        ghost: "shadow-none border-none bg-transparent",
    };

    const paddings = {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
    };

    const hoverStyles = hoverable ? "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer" : "";

    return (
        <div
            ref={ref}
            className={clsx(
                baseStyles,
                variants[variant],
                paddings[padding],
                hoverStyles,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = "Card";

// Card sub-components
const CardHeader = ({ children, className = "", ...props }) => (
    <div className={clsx("mb-4", className)} {...props}>
        {children}
    </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
    <h3 className={clsx("text-xl font-semibold text-foreground", className)} {...props}>
        {children}
    </h3>
);

const CardDescription = ({ children, className = "", ...props }) => (
    <p className={clsx("text-sm text-body mt-1", className)} {...props}>
        {children}
    </p>
);

const CardContent = ({ children, className = "", ...props }) => (
    <div className={clsx(className)} {...props}>
        {children}
    </div>
);

const CardFooter = ({ children, className = "", ...props }) => (
    <div className={clsx("mt-6 flex items-center gap-3", className)} {...props}>
        {children}
    </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
