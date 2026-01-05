import React from "react";
import clsx from "clsx";

/**
 * Premium Table Component
 * Clean, modern table with responsive behavior
 */

const Table = ({ children, className = "", ...props }) => {
    return (
        <div className="overflow-x-auto rounded-xl border border-border dark:border-slate-700">
            <table
                className={clsx(
                    "min-w-full divide-y divide-border dark:divide-slate-700",
                    className
                )}
                {...props}
            >
                {children}
            </table>
        </div>
    );
};

const TableHeader = ({ children, className = "", ...props }) => (
    <thead
        className={clsx(
            "bg-bg-dark dark:bg-slate-800/50",
            className
        )}
        {...props}
    >
        {children}
    </thead>
);

const TableBody = ({ children, className = "", ...props }) => (
    <tbody
        className={clsx(
            "bg-white dark:bg-slate-800 divide-y divide-border dark:divide-slate-700",
            className
        )}
        {...props}
    >
        {children}
    </tbody>
);

const TableRow = ({ children, className = "", hoverable = true, ...props }) => (
    <tr
        className={clsx(
            "transition-colors",
            hoverable && "hover:bg-bg-dark dark:hover:bg-slate-700/50",
            className
        )}
        {...props}
    >
        {children}
    </tr>
);

const TableHead = ({ children, className = "", ...props }) => (
    <th
        className={clsx(
            "px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider",
            className
        )}
        {...props}
    >
        {children}
    </th>
);

const TableCell = ({ children, className = "", ...props }) => (
    <td
        className={clsx(
            "px-6 py-4 text-sm text-body whitespace-nowrap",
            className
        )}
        {...props}
    >
        {children}
    </td>
);

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export default Table;
