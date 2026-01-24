import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Surface } from "../../components/ui/Surface";
import { Frame } from "../../components/ui/Frame";
import { SplashOverlay } from "../../components/ui/SplashOverlay";
import { LaboratorioFilters } from "../../components/laboratorioFisico/LaboratorioFilters";
import { LaboratorioTable } from "../../components/laboratorioFisico/LaboratorioTable";
import { RemisionLaboratorioForm } from "../../components/laboratorioFisico/remisionLaboratorio";
import { fetchRemisionesLaboratorio } from "../../services/laboratorioService";
import { useRoleAccess } from "../../hooks/useRoleAccess";

const initialFilters = {
    expediente: "",
    prcc: "",
    fechaRemision: "",
    numeroRemision: "",
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

export const RemisionLaboratorio = ({ activePath }) => {
    const [remisiones, setRemisiones] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState(initialFilters);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { policy } = useRoleAccess();
    const currentUserName = policy.label;

    useEffect(() => {
        setIsLoading(true);
        fetchRemisionesLaboratorio()
            .then((data) => setRemisiones(data))
            .finally(() => setIsLoading(false));
    }, []);

    const filteredItems = useMemo(() => {
        return remisiones.filter((item) => {
            if (!matchIncludes(item.expediente, filters.expediente)) return false;
            if (!matchIncludes(item.prcc, filters.prcc)) return false;
            if (!matchIncludes(item.recibidoPor, filters.recibidoPor)) return false;
            if (!matchIncludes(item.numeroRemision, filters.numeroRemision)) return false;
            if (filters.fechaRemision && item.fechaRemision !== filters.fechaRemision) return false;
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
        const newItem = {
            id: `LAB-${String(remisiones.length + 1).padStart(3, "0")}`,
            numeroRemision: data.numeroRemision,
            expediente: data.expediente,
            prcc: data.prcc,
            fechaRemision: data.fechaRemision,
            remitidoPor: currentUserName,
            recibidoPor: data.recibidoPor,
            descripcion: data.descripcionEvidencia,
        };
        setRemisiones((prev) => [newItem, ...prev]);
        setIsFormOpen(false);
    };

    return (
        <DashboardLayout activePath={activePath} contentWidth="full" contentPadding="sm">
            <Surface variant="glass" className="flex-1 p-6 text-left sm:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-white">Remisión de Evidencia Derivada</h2>
                        <p className="text-sm text-blue-100">Consulta y registra remisiones hacia el laboratorio físico.</p>
                    </div>
                    <Frame
                        className="w-full justify-center sm:w-auto"
                        type="button"
                        onClick={() => setIsFormOpen(true)}
                    >
                        Registrar remisión
                    </Frame>
                </div>

                <div className="flex flex-col gap-6">
                    <LaboratorioFilters
                        filters={filters}
                        onChange={handleFilterChange}
                        onReset={handleResetFilters}
                        variant="glass"
                    />

                    <LaboratorioTable
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
                                Completa los datos para registrar una nueva remisión al laboratorio.
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
                        <RemisionLaboratorioForm onSubmitRecord={handleAddRemision} />
                    </div>
                </Surface>
            </SplashOverlay>
        </DashboardLayout>
    );
};
