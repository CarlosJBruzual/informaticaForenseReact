import { useState } from "react";
import { Frame } from "../ui/Frame";
import { Surface } from "../ui/Surface";
import { SplashOverlay } from "../ui/SplashOverlay";

const isActivePath = (currentPath, targetPath) => {
    if (targetPath === "/dashboard") {
        return currentPath === "/dashboard";
    }
    return currentPath.startsWith(targetPath);
};

export const DashboardSidebar = ({
    items,
    activePath,
    submenuItems = [],
    activeSubmenu,
    isSubmenuOpen,
    onToggleSubmenu,
    onSelectSubmenu,
    onNavigate,
    user,
    className = "",
}) => {
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const handleConfirmLogout = () => {
        setIsLogoutConfirmOpen(false);
        onNavigate?.("/");
    };

    return (
        <>
            <Surface
                variant="dark"
                className={`w-full flex-none rounded-none border-b border-white/10 p-4 md:min-h-screen md:w-72 md:border-b-0 md:border-r ${className}`.trim()}
            >
                <div className="flex flex-col gap-3">
                    {user ? (
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="text-xs uppercase tracking-wide text-blue-200">Usuario</p>
                            <p className="mt-2 text-sm font-semibold text-white">{user.name}</p>
                            <p className="text-xs text-blue-100">
                                {user.rank} · {user.role}
                            </p>
                        </div>
                    ) : null}
                    {items.map((item) => {
                        const isActive = isActivePath(activePath, item.path);
                        const baseClass = isActive ? "bg-indigo-500/20" : "border border-white/5";

                        if (item.hasSubmenu) {
                            return (
                                <div key={item.label} className="flex flex-col gap-2">
                                    <Frame
                                        variant={isActive ? "primary" : "ghost"}
                                        className="w-full justify-between text-left"
                                        onClick={() => {
                                            onNavigate?.(item.path);
                                            onToggleSubmenu?.();
                                        }}
                                    >
                                        <span>{item.label}</span>
                                        <span className="text-lg text-indigo-100">
                                            {isSubmenuOpen ? "▾" : "▸"}
                                        </span>
                                    </Frame>

                                    {isSubmenuOpen && submenuItems.length > 0 ? (
                                        <div className="ml-2 flex flex-col gap-2">
                                            {submenuItems.map((sub) => (
                                                <Frame
                                                    key={sub}
                                                    variant="ghost"
                                                    className={`w-full justify-between text-left text-sm ${
                                                        activeSubmenu === sub
                                                            ? "bg-indigo-500/20"
                                                            : "border border-white/5"
                                                    }`}
                                                    onClick={() => onSelectSubmenu?.(sub)}
                                                >
                                                    <span>{sub}</span>
                                                </Frame>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        }

                        return (
                            <Frame
                                key={item.label}
                                variant={isActive && !item.isAction ? "primary" : "ghost"}
                                className={`w-full justify-between text-left ${baseClass}`}
                                onClick={() => {
                                    if (item.isAction) {
                                        setIsLogoutConfirmOpen(true);
                                        return;
                                    }
                                    onNavigate?.(item.path);
                                }}
                            >
                                <span>{item.label}</span>
                                {!item.isAction ? (
                                    <span className="text-lg text-indigo-200">›</span>
                                ) : null}
                            </Frame>
                        );
                    })}
                </div>
            </Surface>

            <SplashOverlay isVisible={isLogoutConfirmOpen}>
                <Surface variant="glass" className="w-full max-w-md p-6 text-white">
                    <div className="flex flex-col gap-3">
                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                Confirmar cierre de sesión
                            </h3>
                            <p className="text-sm text-blue-100">
                                ¿Está seguro de cerrar sesión?
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-end gap-3">
                            <Frame
                                variant="ghost"
                                className="px-6"
                                type="button"
                                onClick={() => setIsLogoutConfirmOpen(false)}
                            >
                                Cancelar
                            </Frame>
                            <Frame
                                variant="primary"
                                className="px-6"
                                type="button"
                                onClick={handleConfirmLogout}
                            >
                                Cerrar Sesión
                            </Frame>
                        </div>
                    </div>
                </Surface>
            </SplashOverlay>
        </>
    );
};
