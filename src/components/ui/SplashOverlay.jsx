export const SplashOverlay = ({ isVisible, children }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 px-4 py-6 backdrop-blur-sm sm:items-center sm:px-6 sm:py-10">
            {children}
        </div>
    );
};
