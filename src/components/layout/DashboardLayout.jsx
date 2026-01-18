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

    return (
        <PageShell padding="none" className="min-h-screen font-body">
            <div className="flex min-h-screen">
                <DashboardSidebar
                    items={DASHBOARD_NAV_ITEMS}
                    activePath={currentPath}
                    submenuItems={submenuItems}
                    activeSubmenu={activeSubmenu}
                    isSubmenuOpen={isSubmenuOpen}
                    onToggleSubmenu={onToggleSubmenu}
                    onSelectSubmenu={onSelectSubmenu}
                    onNavigate={navigateTo}
                    user={user}
                />

                <main className={`flex-1 ${paddingClasses}`.trim()}>
                    <div className={`${widthClasses} flex flex-col ${gapClasses}`.trim()}>
                        {children}
                    </div>
                </main>
            </div>
        </PageShell>
    );
};
