import { Frame } from "../ui/Frame";
import { Surface } from "../ui/Surface";

export const SolicitudesSidebar = ({
    menuItems,
    submenuItems,
    activeMenu,
    activeSubmenu,
    isSolicitudesOpen,
    onToggleSolicitudes,
    onSelectMenu,
    onSelectSubmenu,
}) => {
    return (
        <Surface variant="dark" className="w-full flex-none p-4 lg:w-72">
            <div className="flex flex-col gap-3">
                {menuItems.map((item, idx) => {
                    const isFirst = idx === 0;

                    if (item.hasSubmenu) {
                        return (
                            <div key={item.label} className="flex flex-col gap-2">
                                <Frame
                                    variant="primary"
                                    className="justify-between text-left"
                                    onClick={onToggleSolicitudes}
                                >
                                    <span>{item.label}</span>
                                    <span className="text-lg text-indigo-100">
                                        {isSolicitudesOpen ? "▾" : "▸"}
                                    </span>
                                </Frame>

                                {isSolicitudesOpen && (
                                    <div className="ml-2 flex flex-col gap-2">
                                        {submenuItems.map((sub) => (
                                            <Frame
                                                key={sub}
                                                variant="ghost"
                                                className={`justify-between text-left border border-white/5 bg-white/10 text-sm ${
                                                    activeSubmenu === sub && activeMenu === "Solicitudes"
                                                        ? "bg-indigo-500/20"
                                                        : ""
                                                }`}
                                                onClick={() => onSelectSubmenu(sub)}
                                            >
                                                <span>{sub}</span>
                                            </Frame>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Frame
                            key={item.label}
                            variant={item.variant === "primary" ? "primary" : "ghost"}
                            className={`justify-between text-left ${isFirst ? "" : "border border-white/5"}`}
                            onClick={() => onSelectMenu(item.label)}
                        >
                            <span>{item.label}</span>
                            <span className="text-lg text-indigo-200">›</span>
                        </Frame>
                    );
                })}
            </div>
        </Surface>
    );
};
