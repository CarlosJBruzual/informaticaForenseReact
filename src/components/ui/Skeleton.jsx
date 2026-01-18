export const Skeleton = ({ className = "", tone = "dark" }) => {
    const toneClasses = {
        dark: "bg-white/10",
        light: "bg-slate-200",
    };

    const toneClass = toneClasses[tone] ?? toneClasses.dark;

    return (
        <div className={`animate-pulse rounded-lg ${toneClass} ${className}`.trim()} />
    );
};
