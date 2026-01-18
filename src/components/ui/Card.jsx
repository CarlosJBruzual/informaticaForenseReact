export const Card = ({ className = "", children }) => {
    return (
        <div
            className={`w-full max-w-xl rounded-2xl bg-white/90 text-slate-900 shadow-2xl backdrop-blur border border-white/40 ${className}`.trim()}
        >
            {children}
        </div>
    );
};
