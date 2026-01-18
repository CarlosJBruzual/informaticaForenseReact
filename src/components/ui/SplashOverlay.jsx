export const SplashOverlay = ({ isVisible, children }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-6 py-10 backdrop-blur-sm">
            {children}
        </div>
    );
};
