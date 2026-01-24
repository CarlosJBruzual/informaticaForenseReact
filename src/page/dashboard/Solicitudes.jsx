import { useEffect, useMemo, useRef, useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { SolicitudForm } from "../../components/solicitudes/SolicitudForm";
import { SolicitudesFilters } from "../../components/solicitudes/SolicitudesFilters";
import { SolicitudesTable } from "../../components/solicitudes/SolicitudesTable";
import { SolicitudDetailsModal } from "../../components/solicitudes/SolicitudDetailsModal";
import { RemisionModal } from "../../components/solicitudes/RemisionModal";
import { Frame } from "../../components/ui/Frame";
import { SplashOverlay } from "../../components/ui/SplashOverlay";
import { Surface } from "../../components/ui/Surface";
import { useRoleAccess } from "../../hooks/useRoleAccess";
import { useSolicitudes } from "../../hooks/useSolicitudes";

const solicitudesSubmenu = ["Recibidas", "Remitidas", "Por Remitir", "Por Guardia"];
const initialFilters = {
    numeroEntrada: "",
    solicitante: "",
    numeroSolicitud: "",
    prcc: "",
    expediente: "",
    fechaRecepcion: "",
    fechaSolicitud: "",
    tipoExperticia: "",
    porGuardia: "",
};

const normalize = (value = "") =>
    value
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[\s_-]+/g, "");

const matchIncludes = (source, query) => {
    if (!query) return true;
    return normalize(source).includes(normalize(query));
};

const matchesFilters = (item, filters) => {
    if (!matchIncludes(item.numeroEntrada, filters.numeroEntrada)) return false;
    if (!matchIncludes(item.solicitante, filters.solicitante)) return false;
    if (!matchIncludes(item.numeroSolicitud, filters.numeroSolicitud)) return false;
    if (!matchIncludes(item.prcc, filters.prcc) && !matchIncludes(item.prcc2 || "", filters.prcc))
        return false;
    if (!matchIncludes(item.expediente, filters.expediente)) return false;
    if (filters.fechaRecepcion && item.fechaRecepcion !== filters.fechaRecepcion) return false;
    if (filters.fechaSolicitud && item.fechaSolicitud !== filters.fechaSolicitud) return false;
    if (filters.tipoExperticia && normalize(item.tipoExperticia) !== normalize(filters.tipoExperticia))
        return false;
    if (filters.porGuardia) {
        const guardiaValue = filters.porGuardia === "Sí";
        if (item.porGuardia !== guardiaValue) return false;
    }
    return true;
};

const displayValueMap = {
    tipoExperticia: {},
};

const mapSolicitudForDisplay = (solicitud) => ({
    ...solicitud,
    tipoExperticia:
        displayValueMap.tipoExperticia[solicitud.tipoExperticia] ?? solicitud.tipoExperticia,
});

export const Solicitudes = ({ activePath }) => {
    const [isSolicitudesOpen, setIsSolicitudesOpen] = useState(true);
    const [activeSubmenu, setActiveSubmenu] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [detailId, setDetailId] = useState(null);
    const [remisionId, setRemisionId] = useState(null);
    const [solicitudes, setSolicitudes] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const hasSeeded = useRef(false);
    const { data: initialSolicitudes, isLoading } = useSolicitudes();
    const { policy, canEditField, isReadOnly } = useRoleAccess();
    const currentUserName = policy.label;

    const currentModeLabel = policy.modeLabel === "Edicion" ? "Edición" : policy.modeLabel;
    const currentRoleLabel = policy.label === "Direccion" ? "Dirección" : policy.label;
    const canRemit = policy.canSubmit && !isReadOnly;

    const displaySolicitudes = useMemo(
        () => initialSolicitudes.map(mapSolicitudForDisplay),
        [initialSolicitudes],
    );

    useEffect(() => {
        if (isLoading || hasSeeded.current) return;
        setSolicitudes(displaySolicitudes);
        hasSeeded.current = true;
    }, [displaySolicitudes, isLoading]);

    const handleAddSolicitud = (s) => {
        const sanitized = { ...s, porGuardia: s.porGuardia === true, remision: null };
        setSolicitudes((prev) => [sanitized, ...prev]);
    };

    const handleSelectSubmenu = (submenu) => {
        setActiveSubmenu(submenu);
        setIsSolicitudesOpen(true);
    };

    const tituloContenido = useMemo(() => {
        if (!activeSubmenu) return "Solicitudes";
        return `Solicitudes - ${activeSubmenu}`;
    }, [activeSubmenu]);

    const solicitudesFiltradas = useMemo(() => {
        const normSub = normalize(activeSubmenu);
        if (normSub === "remitidas") {
            return solicitudes.filter((s) => Boolean(s.remision));
        }
        if (normSub === "porremitir") {
            return solicitudes.filter((s) => !s.remision);
        }
        if (normSub === "porguardia") {
            return solicitudes.filter((s) => s.porGuardia === true);
        }
        if (normSub === "recibidas") {
            return solicitudes.filter((s) => Boolean(s.fechaRecepcion));
        }
        return solicitudes;
    }, [activeSubmenu, solicitudes]);

    const solicitudesConFiltros = useMemo(
        () => solicitudesFiltradas.filter((item) => matchesFilters(item, filters)),
        [filters, solicitudesFiltradas],
    );

    const detailSolicitud = useMemo(
        () => solicitudes.find((solicitud) => solicitud.id === detailId),
        [detailId, solicitudes],
    );
    const remisionSolicitud = useMemo(
        () => solicitudes.find((solicitud) => solicitud.id === remisionId),
        [remisionId, solicitudes],
    );

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleResetFilters = () => {
        setFilters(initialFilters);
    };

    const handleViewSolicitud = (solicitud) => {
        setDetailId(solicitud.id);
    };

    const handleOpenRemision = (solicitud) => {
        setRemisionId(solicitud.id);
    };

    const handleSaveRemision = (remision) => {
        if (!remisionId) return;
        setSolicitudes((prev) =>
            prev.map((item) =>
                item.id === remisionId ? { ...item, remision } : item,
            ),
        );
        setRemisionId(null);
    };

    return (
        <DashboardLayout
            activePath={activePath}
            submenuItems={solicitudesSubmenu}
            activeSubmenu={activeSubmenu}
            isSubmenuOpen={isSolicitudesOpen}
            onToggleSubmenu={() => setIsSolicitudesOpen((value) => !value)}
            onSelectSubmenu={handleSelectSubmenu}
            contentWidth="full"
            contentPadding="sm"
        >
            <Surface variant="glass" className="flex-1 p-6 text-left sm:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-white">{tituloContenido}</h2>
                        <p className="text-sm text-blue-100">
                            {currentRoleLabel} · {currentModeLabel}
                        </p>
                    </div>
                    <Frame
                        className="w-full justify-center sm:w-auto disabled:cursor-not-allowed disabled:opacity-70"
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        disabled={!policy.canSubmit || isReadOnly}
                    >
                        Registrar Solicitud
                    </Frame>
                </div>

                <div className="flex flex-col gap-6">
                    <SolicitudesFilters
                        filters={filters}
                        onChange={handleFilterChange}
                        onReset={handleResetFilters}
                        variant="glass"
                    />
                    <SolicitudesTable
                        title={activeSubmenu ? tituloContenido : "Historial de Solicitudes"}
                        items={solicitudesConFiltros}
                        emptyMessage={
                            activeSubmenu
                                ? "No hay solicitudes en esta categoría."
                                : "No hay solicitudes registradas."
                        }
                        isLoading={isLoading}
                        variant="glass"
                        onView={handleViewSolicitud}
                        onRemit={canRemit ? handleOpenRemision : null}
                    />
                </div>
            </Surface>

            <SplashOverlay isVisible={isCreateOpen}>
                <Surface
                    variant="glass"
                    className="w-full max-w-5xl max-h-[calc(100vh-6rem)] overflow-y-auto p-6 text-white"
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Crear Solicitud</h3>
                            <p className="text-sm text-blue-100">
                                Complete los datos para registrar una nueva solicitud.
                            </p>
                        </div>
                        <Frame
                            variant="ghost"
                            className="w-full justify-center sm:w-auto"
                            type="button"
                            onClick={() => setIsCreateOpen(false)}
                        >
                            Cerrar
                        </Frame>
                    </div>

                    <div className="mt-6">
                        <SolicitudForm
                            onAdd={handleAddSolicitud}
                            onCancel={() => setIsCreateOpen(false)}
                            onSuccess={() => setIsCreateOpen(false)}
                            canEditField={canEditField}
                            canSubmit={policy.canSubmit}
                            isReadOnly={isReadOnly}
                            isLoading={isLoading}
                        />
                    </div>
                </Surface>
            </SplashOverlay>

            <SplashOverlay isVisible={Boolean(detailSolicitud)}>
                <SolicitudDetailsModal
                    solicitud={detailSolicitud}
                    onClose={() => setDetailId(null)}
                />
            </SplashOverlay>

            <SplashOverlay isVisible={Boolean(remisionSolicitud)}>
                <RemisionModal
                    solicitud={remisionSolicitud}
                    onClose={() => setRemisionId(null)}
                    onSubmit={handleSaveRemision}
                    isReadOnly={isReadOnly}
                    currentUserName={currentUserName}
                />
            </SplashOverlay>
        </DashboardLayout>
    );
};
