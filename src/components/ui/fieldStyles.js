export const fieldVariants = {
    light:
        "rounded-lg border-slate-200 bg-slate-50 placeholder:text-slate-400 shadow-inner focus:border-indigo-400 focus:ring-indigo-300",
    glass:
        "rounded-xl border-slate-200 bg-white/80 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-indigo-300",
};

export const getFieldClasses = ({ variant = "light", disabled, className = "" }) => {
    const variantClasses = fieldVariants[variant] ?? fieldVariants.light;
    const disabledClasses = disabled ? "cursor-not-allowed bg-slate-100 text-slate-500" : "";

    return [
        "w-full border px-3 py-2 text-slate-900 focus:outline-none focus:ring-2",
        variantClasses,
        disabledClasses,
        className,
    ]
        .filter(Boolean)
        .join(" ");
};

const labelToneClasses = {
    dark: "text-slate-700",
    light: "text-white",
};

const hintToneClasses = {
    dark: "text-slate-500",
    light: "text-blue-600",
};

export const getLabelClasses = ({ tone = "dark", className = "" }) => {
    const toneClass = labelToneClasses[tone] ?? labelToneClasses.dark;
    return ["font-semibold", toneClass, className].filter(Boolean).join(" ");
};

export const getHintClasses = ({ tone = "dark", className = "" }) => {
    const toneClass = hintToneClasses[tone] ?? hintToneClasses.dark;
    return ["text-xs", toneClass, className].filter(Boolean).join(" ");
};
