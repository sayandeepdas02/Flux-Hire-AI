import React from "react";

export const AuthLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen w-full bg-white font-dmSans">
            {/* Left Content */}
            <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24 xl:px-32">
                {/* Logo */}
                <div className="absolute top-8 left-8 lg:left-24 xl:left-32 flex items-center gap-2">
                    <img src="/flux-logo.png" alt="Flux Hire AI" className="h-[40px] w-[40px]" />
                    <span className="font-roboto text-xl font-bold text-slate-900 tracking-tight leading-[36px]">Flux Hire AI</span>
                </div>

                {/* Form Content */}
                <div className="w-full max-w-[440px] mx-auto mt-20 lg:mt-0">
                    {children}
                </div>
            </div>

            {/* Right Content - Abstract Image */}
            <div className="hidden lg:block lg:w-1/2 p-4">
                <div className="h-full w-full rounded-[32px] overflow-hidden relative">
                    <img
                        src="/auth-sidebar.png"
                        alt="Abstract Background"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};
