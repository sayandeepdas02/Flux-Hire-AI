import React, { useState } from "react";
import { Eye, EyeOff, Calendar } from "lucide-react";

export const FloatingInput = ({
    label,
    type = "text",
    value,
    onChange,
    placeholder = "",
    className = "",
    icon = null,
    leftIcon = null,
    error = false,
    disabled = false
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    // Determine border color
    let borderColor = "border-slate-300";
    if (error) borderColor = "border-red-500";
    else if (isFocused) borderColor = "border-[#ED5E29]";

    // Determine ring color (only on focus)
    let ringClass = "";
    if (isFocused) {
        if (error) ringClass = "ring-red-500";
        else ringClass = "ring-[#ED5E29]";
    }

    // Determine label color
    let labelColor = "text-slate-400";
    if (error) labelColor = "text-red-500";
    else if (isFocused) labelColor = "text-[#ED5E29]";

    return (
        <div className={`relative mb-6 ${className} ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
            <label className={`absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium z-10 select-none transition-colors ${labelColor}`}>
                {label}
            </label>
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        {leftIcon}
                    </div>
                )}
                <input
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={`w-full h-12 rounded-lg border pt-1 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${leftIcon ? 'pl-10 pr-4' : 'px-4'} ${borderColor} ${ringClass}`}
                />
                {/* Icons */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        disabled={disabled}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                )}
                {icon && !isPassword && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};

export const StandardInput = ({
    type = "text",
    placeholder,
    value,
    onChange,
    className = "",
    error = false,
    disabled = false
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    // Determine border color class
    // We can't use simple ternary for focus because standard input relies on css :focus usually, 
    // but here to map to the variable logic let's keep it simple with classes
    // Actually tailwind :focus works best if we don't need label sync.
    // But for error state, we need to override.

    const baseBorder = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-[#ED5E29] focus:ring-[#ED5E29]";

    return (
        <div className={`relative mb-6 ${className} ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
            <input
                type={inputType}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full h-12 rounded-lg border px-4 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${baseBorder}`}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={disabled}
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            )}
        </div>
    );
};
