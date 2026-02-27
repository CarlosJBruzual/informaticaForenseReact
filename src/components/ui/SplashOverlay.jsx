import { createPortal } from "react-dom";

export const SplashOverlay = ({ isVisible, children, className = "" }) => {
    if (!isVisible) return null;

    const content = (
        <div
            className={`fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-900/60 px-4 py-6 backdrop-blur-sm sm:items-center sm:px-6 sm:py-10 ${className}`.trim()}
        >
            {children}
        </div>
    );

    if (typeof document === "undefined") return content;

    return createPortal(content, document.body);
};
