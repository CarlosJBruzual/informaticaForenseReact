import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Surface } from "../../components/ui/Surface";
import { Frame } from "../../components/ui/Frame";
import { SplashOverlay } from "../../components/ui/SplashOverlay";
import { ResguardoFilters } from "../../components/resguardo/ResguardoFilters";
import { ResguardoTable } from "../../components/resguardo/ResguardoTable";
import { EvidenciasResguardoForm } from "../../components/resguardo/evidenciasResguado";
import { fetchRemisionesResguardo } from "../../services/resguardoService";
import { useRoleAccess } from "../../hooks/useRoleAccess";

const initialFilters = {
    expediente: "",
    prcc: "",
    fechaRecepcion: "",
    recibidoPor: "",
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

export const Resguardo = ({ activePath }) => {
    const [remisiones, setRemisiones] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [filters, setFilters] = useState(initialFilters);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { policy } = useRoleAccess();
    const currentUserName = policy.label;

    const loadRemisiones = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const data = await fetchRemisionesResguardo();
            setRemisiones(Array.isArray(data) ? data : []);
        } catch (error) {
            setErrorMessage(error?.message || "No se pudieron cargar las remisiones.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRemisiones();
    }, []);

    useEffect(() => {
        if (!statusMessage) return undefined;
        const timer = setTimeout(() => setStatusMessage(""), 4000);
        return () => clearTimeout(timer);
    }, [statusMessage]);

    const filteredItems = useMemo(() => {
        return remisiones.filter((item) => {
            if (!matchIncludes(item.expediente, filters.expediente)) return false;
            if (!matchIncludes(item.prcc, filters.prcc)) return false;
            if (!matchIncludes(item.recibidoPor, filters.recibidoPor)) return false;
            if (filters.fechaRecepcion && item.fechaRecepcion !== filters.fechaRecepcion) return false;
            return true;
        });
    }, [filters, remisiones]);

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleResetFilters = () => {
        setFilters(initialFilters);
    };

    const handleAddRemision = (data) => {
        // data viene del API; usamos el que retorne el servicio
        if (!data) return;
        setRemisiones((prev) => [data, ...prev]);
        setStatusMessage("Remisión registrada");
        setErrorMessage("");
        setIsFormOpen(false);
    };

    return (
        <DashboardLayout activePath={activePath} contentWidth="full" contentPadding="sm">
            <Surface variant="glass" className="flex-1 p-6 text-left sm:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-white">Remisión a Sala de Resguardo</h2>
                        <p className="text-sm text-blue-100">Consulta y registra remisiones de evidencias.</p>
                    </div>
                    <Frame
                        className="w-full justify-center sm:w-auto"
                        type="button"
                        onClick={() => {
                            setErrorMessage("");
                            setStatusMessage("");
                            setIsFormOpen(true);
                        }}
                    >
                        Registrar remisión
                    </Frame>
                </div>

                {statusMessage ? (
                    <div className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                        {statusMessage}
                    </div>
                ) : null}
                {errorMessage ? (
                    <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                        {errorMessage}
                    </div>
                ) : null}

                <div className="flex flex-col gap-6">
                    <ResguardoFilters
                        filters={filters}
                        onChange={handleFilterChange}
                        onReset={handleResetFilters}
                        variant="glass"
                    />

                    <ResguardoTable
                        title="Historial de remisiones"
                        items={filteredItems}
                        emptyMessage="No hay remisiones registradas."
                        isLoading={isLoading}
                        variant="glass"
                    />
                </div>
            </Surface>

            <SplashOverlay isVisible={isFormOpen}>
                <Surface
                    variant="glass"
                    className="w-full max-w-4xl max-h-[calc(100vh-6rem)] overflow-y-auto p-6 text-white"
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Registrar remisión</h3>
                            <p className="text-sm text-blue-100">
                                Completa los datos para registrar una nueva remisión a resguardo.
                            </p>
                        </div>
                        <Frame
                            variant="ghost"
                            className="w-full justify-center sm:w-auto"
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                        >
                            Cerrar
                        </Frame>
                    </div>

                    <div className="mt-6">
                        <EvidenciasResguardoForm
                            onSubmitRecord={handleAddRemision}
                            remitidoPor={currentUserName}
                        />
                    </div>
                </Surface>
            </SplashOverlay>
        </DashboardLayout>
    );
};
