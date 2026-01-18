export const Surface = ({ variant = "glass", className = "", children }) => {
    const variants = {
        glass: "rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur",
        dark: "rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl backdrop-blur",
        paper: "rounded-xl border border-white/40 bg-white shadow",
    };

    const variantClasses = variants[variant] ?? variants.glass;

    return (
        <div className={`${variantClasses} ${className}`.trim()}>
            {children}
        </div>
    );
};
