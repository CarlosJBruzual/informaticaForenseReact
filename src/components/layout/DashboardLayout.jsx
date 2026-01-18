import { useState } from "react";
import { DashboardSidebar } from "../dashboard/DashboardSidebar";
import { PageShell } from "./PageShell";
import { DASHBOARD_NAV_ITEMS } from "../../services/dashboardNavigation";
import { navigateTo } from "../../utils/navigation";

const defaultUser = {
    name: "Carlos Rivas",
    rank: "Detective",
    role: "Jefe de Oficina",
};

export const DashboardLayout = ({
    children,
    activePath,
    submenuItems,
    activeSubmenu,
    isSubmenuOpen,
    onToggleSubmenu,
    onSelectSubmenu,
    user = defaultUser,
    contentWidth = "contained",
    contentPadding = "md",
}) => {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const currentPath =
        activePath ?? (typeof window !== "undefined" ? window.location.pathname : "/dashboard");
    const paddingClassesMap = {
        none: "p-0",
        sm: "px-4 py-6",
        md: "px-6 py-10",
    };
    const paddingClasses = paddingClassesMap[contentPadding] ?? paddingClassesMap.md;
    const widthClasses =
        contentWidth === "full" ? "w-full" : "mx-auto w-full max-w-6xl";
    const gapClasses = contentWidth === "full" ? "gap-4" : "gap-6";
    const handleNavigate = (path) => {
        navigateTo(path);
        setIsMobileNavOpen(false);
    };

    return (
        <PageShell padding="none" className="min-h-screen font-body">
            <div className="flex min-h-screen flex-col md:flex-row">
                <div className="hidden md:block">
                    <DashboardSidebar
                        items={DASHBOARD_NAV_ITEMS}
                        activePath={currentPath}
                        submenuItems={submenuItems}
                        activeSubmenu={activeSubmenu}
                        isSubmenuOpen={isSubmenuOpen}
                        onToggleSubmenu={onToggleSubmenu}
                        onSelectSubmenu={onSelectSubmenu}
                        onNavigate={handleNavigate}
                        user={user}
                    />
                </div>

                <main className={`flex-1 ${paddingClasses}`.trim()}>
                    <div className={`${widthClasses} flex flex-col ${gapClasses}`.trim()}>
                        <div className="flex items-center justify-between md:hidden">
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white shadow-sm"
                                onClick={() => setIsMobileNavOpen((prev) => !prev)}
                                aria-expanded={isMobileNavOpen}
                                aria-controls="dashboard-mobile-nav"
                            >
                                <span className="flex h-3 w-4 flex-col justify-between">
                                    <span className="h-0.5 w-full rounded bg-white" />
                                    <span className="h-0.5 w-full rounded bg-white" />
                                    <span className="h-0.5 w-full rounded bg-white" />
                                </span>
                                <span>Menu</span>
                            </button>
                        </div>
                        {children}
                    </div>
                </main>
            </div>

            {isMobileNavOpen ? (
                <div className="fixed inset-0 z-40 flex md:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
                        onClick={() => setIsMobileNavOpen(false)}
                        aria-label="Cerrar menu"
                    />
                    <div
                        id="dashboard-mobile-nav"
                        className="relative z-10 h-full w-72 max-w-[85%]"
                    >
                        <DashboardSidebar
                            items={DASHBOARD_NAV_ITEMS}
                            activePath={currentPath}
                            submenuItems={submenuItems}
                            activeSubmenu={activeSubmenu}
                            isSubmenuOpen={isSubmenuOpen}
                            onToggleSubmenu={onToggleSubmenu}
                            onSelectSubmenu={onSelectSubmenu}
                            onNavigate={handleNavigate}
                            user={user}
                            className="h-full w-full"
                        />
                    </div>
                </div>
            ) : null}
        </PageShell>
    );
};
