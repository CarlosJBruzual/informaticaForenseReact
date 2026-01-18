export const Frame = ({
    className = "",
    children = "BOTON DE LEANDRY",
    variant = "primary",
    ...props
}) => {
    const base =
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-lg transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

    const variants = {
        primary:
            "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white hover:from-indigo-400 hover:to-indigo-600 focus-visible:outline-indigo-300",
        ghost:
            "bg-slate-800/70 text-slate-100 hover:bg-slate-700 focus-visible:outline-slate-300",
    };

    const variantClasses = variants[variant] ?? variants.primary;

    return (
        <button
            type="button"
            className={`${base} ${variantClasses} ${className}`.trim()}
            {...props}
        >
            <span className="leading-none">{children}</span>
        </button>
    );
};
