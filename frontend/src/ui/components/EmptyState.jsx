import React from "react";
import clsx from "clsx";

/**
 * EmptyState Component
 * Display when no data is available
 */

const EmptyState = ({
    icon: Icon,
    title,
    description,
    action,
    className = "",
    ...props
}) => {
    return (
        <div
            className={clsx(
                "flex flex-col items-center justify-center py-12 px-4 text-center",
                className
            )}
            {...props}
        >
            {Icon && (
                <div className="mb-4 p-4 rounded-full bg-bg-dark dark:bg-slate-700">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
            )}
            {title && (
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    {title}
                </h3>
            )}
            {description && (
                <p className="text-sm text-body max-w-md mb-6">
                    {description}
                </p>
            )}
            {action && (
                <div>
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
