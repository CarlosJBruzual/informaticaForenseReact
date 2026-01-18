export const PageShell = ({ children, className = "", padding = "md" }) => {
    const paddingClasses = {
        none: "p-0",
        md: "px-6 py-10",
        lg: "px-6 py-12",
    };

    const paddingClass = paddingClasses[padding] ?? paddingClasses.md;

    return (
        <div
            className={`min-h-screen w-full bg-linear-to-br from-midnight via-indigoMid to-slateDeep ${paddingClass} ${className}`.trim()}
        >
            {children}
        </div>
    );
};
