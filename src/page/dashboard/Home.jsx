import { useMemo } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Surface } from "../../components/ui/Surface";
import { Skeleton } from "../../components/ui/Skeleton";
import { StatCard } from "../../components/ui/StatCard";
import { useSolicitudes } from "../../hooks/useSolicitudes";

const experticiaLabelMap = {
    Informatica: "Informática",
    Telefonia: "Telefonía",
};

const formatPercent = (value) => `${Math.round(value)}%`;

const getLastDate = (dates) => {
    if (!dates.length) return null;
    return dates.reduce((latest, current) => (current > latest ? current : latest), dates[0]);
};

export const DashboardHome = ({ activePath }) => {
    const { data, isLoading } = useSolicitudes();

    const metrics = useMemo(() => {
        const total = data.length;
        const remitidas = data.filter((item) => item.remision).length;
        const pendientes = total - remitidas;
        const porGuardia = data.filter((item) => item.porGuardia).length;
        const remitidasPct = total ? (remitidas / total) * 100 : 0;
        const guardiaPct = total ? (porGuardia / total) * 100 : 0;

        const remisionDurations = data
            .filter((item) => item.remision?.fechaRemision && item.fechaRecepcion)
            .map((item) => {
                const start = new Date(item.fechaRecepcion);
                const end = new Date(item.remision.fechaRemision);
                const diff = (end - start) / (1000 * 60 * 60 * 24);
                return Number.isFinite(diff) ? diff : null;
            })
            .filter((value) => value !== null && value >= 0);

        const avgRemisionDays = remisionDurations.length
            ? remisionDurations.reduce((sum, value) => sum + value, 0) / remisionDurations.length
            : null;

        const lastRecepcion = getLastDate(
            data.map((item) => item.fechaRecepcion).filter(Boolean),
        );

        const experticiaCounts = data.reduce((acc, item) => {
            const key = item.tipoExperticia || "Sin definir";
            const label = experticiaLabelMap[key] ?? key;
            acc[label] = (acc[label] ?? 0) + 1;
            return acc;
        }, {});

        const experticiaEntries = Object.entries(experticiaCounts)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value);

        return {
            total,
            remitidas,
            pendientes,
            porGuardia,
            remitidasPct,
            guardiaPct,
            avgRemisionDays,
            lastRecepcion,
            experticiaEntries,
        };
    }, [data]);

    const pendientesPct = metrics.total ? (metrics.pendientes / metrics.total) * 100 : 0;
    const experticiaTotal = metrics.experticiaEntries.reduce((sum, entry) => sum + entry.value, 0);

    const summaryStats = [
        {
            label: "Solicitudes registradas",
            value: metrics.total,
            meta: "Total actual",
            progress: metrics.total ? 100 : 0,
        },
        {
            label: "Evidencias remitidas",
            value: metrics.remitidas,
            meta: `Remitidas ${formatPercent(metrics.remitidasPct)}`,
            progress: metrics.remitidasPct,
            showGauge: true,
        },
        {
            label: "Pendientes de remisión",
            value: metrics.pendientes,
            meta: "Sin remisión",
            progress: pendientesPct,
        },
        {
            label: "Por guardia",
            value: metrics.porGuardia,
            meta: `Porcentaje ${formatPercent(metrics.guardiaPct)}`,
            progress: metrics.guardiaPct,
            showGauge: true,
        },
    ];

    const operationalStats = [
        {
            label: "Tiempo promedio de remisión",
            value: metrics.avgRemisionDays ? `${metrics.avgRemisionDays.toFixed(1)} días` : "Sin datos",
            meta: "Desde recepción",
        },
        {
            label: "Experticias activas",
            value: metrics.experticiaEntries.length,
            meta: "Tipos distintos",
        },
        {
            label: "Última recepción",
            value: metrics.lastRecepcion ?? "Sin datos",
            meta: "Fecha registrada",
        },
    ];

    return (
        <DashboardLayout activePath={activePath} contentWidth="full" contentPadding="sm">
            <Surface variant="glass" className="p-4 text-white">
                <h2 className="text-lg font-semibold">Inicio</h2>
                <p className="mt-1 text-sm text-blue-100">
                    Panel general para medir el desempeño operativo actual.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, index) => (
                              <Surface
                                  key={`summary-skel-${index}`}
                                  variant="dark"
                                  className="rounded-xl p-3"
                              >
                                  <Skeleton className="h-3 w-36" />
                                  <Skeleton className="mt-2 h-6 w-20" />
                                  <Skeleton className="mt-2 h-3 w-28" />
                                  <Skeleton className="mt-3 h-2 w-full" />
                              </Surface>
                          ))
                        : summaryStats.map((item) => (
                              <StatCard
                                  key={item.label}
                                  label={item.label}
                                  value={item.value}
                                  meta={item.meta}
                                  progress={item.progress}
                                  showGauge={item.showGauge}
                              />
                          ))}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, index) => (
                              <Surface
                                  key={`ops-skel-${index}`}
                                  variant="dark"
                                  className="rounded-xl p-3"
                              >
                                  <Skeleton className="h-3 w-40" />
                                  <Skeleton className="mt-2 h-5 w-24" />
                                  <Skeleton className="mt-2 h-3 w-28" />
                              </Surface>
                          ))
                        : operationalStats.map((item) => (
                              <StatCard
                                  key={item.label}
                                  label={item.label}
                                  value={item.value}
                                  meta={item.meta}
                              />
                          ))}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <Surface variant="dark" className="rounded-xl p-3">
                        <p className="text-sm font-semibold text-white">Distribución por experticia</p>
                        <div className="mt-3 space-y-3">
                            {isLoading ? (
                                <>
                                    <Skeleton className="h-3 w-44" />
                                    <Skeleton className="h-2 w-full" />
                                    <Skeleton className="h-3 w-36" />
                                    <Skeleton className="h-2 w-full" />
                                </>
                            ) : metrics.experticiaEntries.length ? (
                                metrics.experticiaEntries.map((entry) => (
                                    <div key={entry.label} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs text-blue-100">
                                            <span>{entry.label}</span>
                                            <span className="font-semibold text-white">
                                                {entry.value}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-white/10">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-sky-300"
                                                style={{
                                                    width: `${
                                                        experticiaTotal
                                                            ? (entry.value / experticiaTotal) * 100
                                                            : 0
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-blue-100">Sin datos para mostrar.</p>
                            )}
                        </div>
                    </Surface>

                    <Surface variant="dark" className="rounded-xl p-3">
                        <p className="text-sm font-semibold text-white">Estado operativo</p>
                        <div className="mt-3 space-y-2 text-xs text-blue-100">
                            <div className="flex items-center justify-between">
                                <span>Solicitudes con remisión</span>
                                <span className="font-semibold text-white">{metrics.remitidas}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Solicitudes sin remisión</span>
                                <span className="font-semibold text-white">{metrics.pendientes}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Solicitudes por guardia</span>
                                <span className="font-semibold text-white">{metrics.porGuardia}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Última recepción registrada</span>
                                <span className="font-semibold text-white">
                                    {metrics.lastRecepcion ?? "Sin datos"}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex h-2 overflow-hidden rounded-full bg-white/10">
                                <div
                                    className="bg-indigo-300"
                                    style={{ width: `${metrics.remitidasPct}%` }}
                                />
                                <div
                                    className="bg-slate-300/70"
                                    style={{ width: `${pendientesPct}%` }}
                                />
                            </div>
                            <div className="mt-2 flex items-center justify-between text-[11px] text-blue-100">
                                <span>Con remisión</span>
                                <span>Sin remisión</span>
                            </div>
                        </div>
                    </Surface>
                </div>
            </Surface>
        </DashboardLayout>
    );
};
