export const LoginSplash = ({ message = "Verificando acceso..." }) => {
    return (
        <div className="flex flex-col items-center gap-4 text-white">
            <div className="relative h-16 w-16">
                <span className="absolute inset-0 rounded-full border-2 border-white/20" />
                <span className="absolute inset-0 rounded-full border-2 border-indigo-200 border-t-transparent animate-spin" />
            </div>
            <p className="text-sm text-blue-100">{message}</p>
        </div>
    );
};
