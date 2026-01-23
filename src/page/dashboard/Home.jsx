import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Surface } from "../../components/ui/Surface";
import { Skeleton } from "../../components/ui/Skeleton";
import { StatCard } from "../../components/ui/StatCard";
import { Frame } from "../../components/ui/Frame";
import { useSolicitudes } from "../../hooks/useSolicitudes";
import { fetchRemisionesResguardo } from "../../services/resguardoService";
import { fetchRemisionesLaboratorio } from "../../services/laboratorioService";

const experticiaLabelMap = {
    Informatica: "Informática",
    Telefonia: "Telefonía",
};

const formatPercent = (value) => `${Math.round(value)}%`;

const getLastDate = (dates) => {
    if (!dates.length) return null;
    return dates.reduce((latest, current) => (current > latest ? current : latest), dates[0]);
};

const matchesPeriod = (dateString, mode, value) => {
    if (!mode || !value) return true;
    if (!dateString) return false;

    const safeDate = typeof dateString === "string" ? dateString : String(dateString);

    if (mode === "day") {
        return safeDate.slice(0, 10) === value; // YYYY-MM-DD
    }

    if (mode === "month") {
        return safeDate.slice(0, 7) === value; // YYYY-MM
    }

    if (mode === "year") {
        return safeDate.slice(0, 4) === value; // YYYY
    }

    return true;
};

export const DashboardHome = ({ activePath }) => {
    const { data, isLoading } = useSolicitudes();
    const [resguardo, setResguardo] = useState([]);
    const [laboratorio, setLaboratorio] = useState([]);
    const [isLoadingExtras, setIsLoadingExtras] = useState(true);
    const [periodMode, setPeriodMode] = useState("month"); // day | month | year
    const [periodValue, setPeriodValue] = useState("");
    const [isExportingGeneral, setIsExportingGeneral] = useState(false);
    const [isExportingFuncionarios, setIsExportingFuncionarios] = useState(false);

    useEffect(() => {
        setIsLoadingExtras(true);
        Promise.all([fetchRemisionesResguardo(), fetchRemisionesLaboratorio()])
            .then(([rsg, lab]) => {
                setResguardo(rsg);
                setLaboratorio(lab);
            })
            .finally(() => setIsLoadingExtras(false));
    }, []);

    const metrics = useMemo(() => {
        const solicitudesSource = data.filter((item) =>
            matchesPeriod(item.fechaRecepcion || item.fechaSolicitud, periodMode, periodValue),
        );
        const resguardoSource = resguardo.filter((item) =>
            matchesPeriod(item.fechaRecepcion, periodMode, periodValue),
        );
        const laboratorioSource = laboratorio.filter((item) =>
            matchesPeriod(item.fechaRemision, periodMode, periodValue),
        );

        const total = solicitudesSource.length;
        const remitidas = solicitudesSource.filter(
            (item) => item.remision && matchesPeriod(item.remision.fechaRemision, periodMode, periodValue),
        ).length;
        const pendientes = total - remitidas;
        const porGuardia = solicitudesSource.filter((item) => item.porGuardia).length;
        const remitidasPct = total ? (remitidas / total) * 100 : 0;
        const guardiaPct = total ? (porGuardia / total) * 100 : 0;

        const remisionDurations = solicitudesSource
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
            solicitudesSource.map((item) => item.fechaRecepcion).filter(Boolean),
        );

        const experticiaCounts = solicitudesSource.reduce((acc, item) => {
            const key = item.tipoExperticia || "Sin definir";
            const label = experticiaLabelMap[key] ?? key;
            acc[label] = (acc[label] ?? 0) + 1;
            return acc;
        }, {});

        const experticiaEntries = Object.entries(experticiaCounts)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value);

        const lastResguardo = getLastDate(
            resguardoSource.map((item) => item.fechaRecepcion).filter(Boolean),
        );
        const lastLaboratorio = getLastDate(
            laboratorioSource.map((item) => item.fechaRemision).filter(Boolean),
        );

        const periodLabel = !periodValue
            ? "Todos"
            : periodMode === "day"
            ? `Día ${periodValue}`
            : periodMode === "month"
            ? `Mes ${periodValue}`
            : `Año ${periodValue}`;

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
            resguardoTotal: resguardoSource.length,
            laboratorioTotal: laboratorioSource.length,
            lastResguardo,
            lastLaboratorio,
            periodLabel,
        };
    }, [data, laboratorio, resguardo, periodMode, periodValue]);

    const funcionarioStats = useMemo(() => {
        const map = {};
        const ensure = (name) => {
            const safeName = name?.trim() || "Sin nombre";
            map[safeName] =
                map[safeName] ||
                {
                    nombre: safeName,
                    solicitudes: 0,
                    porRemitir: 0,
                    dictamenes: 0,
                    resguardo: 0,
                    laboratorio: 0,
                };
            return map[safeName];
        };

        data.forEach((item) => {
            const inRangeSolicitud = matchesPeriod(
                item.fechaRecepcion || item.fechaSolicitud,
                periodMode,
                periodValue,
            );
            const inRangeRemision = matchesPeriod(
                item.remision?.fechaRemision,
                periodMode,
                periodValue,
            );

            if (inRangeSolicitud && item.solicitante) {
                const entry = ensure(item.solicitante);
                entry.solicitudes += 1;
                if (!item.remision) entry.porRemitir += 1;
            }
            if (inRangeRemision && item.remision?.funcionarioEntrega) {
                const entry = ensure(item.remision.funcionarioEntrega);
                entry.dictamenes += 1;
            }
            if (inRangeRemision && item.remision?.funcionarioRecibe) {
                const entry = ensure(item.remision.funcionarioRecibe);
                entry.dictamenes += 1;
            }
        });

        resguardo.forEach((item) => {
            if (matchesPeriod(item.fechaRecepcion, periodMode, periodValue) && item.recibidoPor) {
                const entry = ensure(item.recibidoPor);
                entry.resguardo += 1;
            }
        });

        laboratorio.forEach((item) => {
            if (matchesPeriod(item.fechaRemision, periodMode, periodValue) && item.recibidoPor) {
                const entry = ensure(item.recibidoPor);
                entry.laboratorio += 1;
            }
        });

        return Object.values(map)
            .map((row) => ({
                ...row,
                total:
                    row.solicitudes +
                    row.dictamenes +
                    row.porRemitir +
                    row.resguardo +
                    row.laboratorio,
            }))
            .sort((a, b) => b.total - a.total);
    }, [data, laboratorio, resguardo, periodMode, periodValue]);

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
        {
            label: "Remisiones a Resguardo",
            value: metrics.resguardoTotal,
            meta: metrics.lastResguardo ? `Última: ${metrics.lastResguardo}` : "Sin datos",
            progress: metrics.resguardoTotal ? 100 : 0,
        },
        {
            label: "Remisiones a Laboratorio",
            value: metrics.laboratorioTotal,
            meta: metrics.lastLaboratorio ? `Última: ${metrics.lastLaboratorio}` : "Sin datos",
            progress: metrics.laboratorioTotal ? 100 : 0,
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

    const periodInputType =
        periodMode === "day" ? "date" : periodMode === "month" ? "month" : "number";

    const handleExportGeneral = () => {
        if (isExportingGeneral) return;
        setIsExportingGeneral(true);
        setTimeout(() => setIsExportingGeneral(false), 1200); // placeholder until API wiring
    };

    const handleExportFuncionarios = () => {
        if (isExportingFuncionarios) return;
        setIsExportingFuncionarios(true);
        setTimeout(() => setIsExportingFuncionarios(false), 1200); // placeholder until API wiring
    };

    return (
        <DashboardLayout activePath={activePath} contentWidth="full" contentPadding="sm">
            <Surface variant="glass" className="p-4 text-white">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">Inicio</h2>
                        <p className="mt-1 text-sm text-blue-100">
                            Panel general para medir el desempeño operativo actual.
                        </p>
                    </div>
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                        <div className="flex items-center gap-2 text-xs text-blue-100">
                            <label htmlFor="period-mode" className="whitespace-nowrap">
                                Periodo
                            </label>
                            <select
                                id="period-mode"
                                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                                value={periodMode}
                                onChange={(e) => {
                                    setPeriodMode(e.target.value);
                                    setPeriodValue("");
                                }}
                            >
                                <option value="day" className="bg-white text-slate-900">
                                    Día
                                </option>
                                <option value="month" className="bg-white text-slate-900">
                                    Mes
                                </option>
                                <option value="year" className="bg-white text-slate-900">
                                    Año
                                </option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-blue-100">
                            <label htmlFor="period-value" className="whitespace-nowrap">
                                Valor
                            </label>
                            <input
                                id="period-value"
                                type={periodInputType}
                                min={periodMode === "year" ? "2000" : undefined}
                                max={periodMode === "year" ? "2100" : undefined}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none sm:w-36"
                                value={periodValue}
                                onChange={(e) => setPeriodValue(e.target.value)}
                                placeholder={periodMode === "year" ? "YYYY" : undefined}
                            />
                        </div>
                        <Frame
                            variant="ghost"
                            className="justify-center"
                            type="button"
                            onClick={() => {
                                setPeriodValue("");
                            }}
                        >
                            Ver todo
                        </Frame>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                    {isLoading || isLoadingExtras
                        ? Array.from({ length: 5 }).map((_, index) => (
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

                <Surface variant="dark" className="mt-4 rounded-xl p-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-white">Rendimiento del periodo</p>
                            <p className="text-xs text-blue-100">Periodo: {metrics.periodLabel}</p>
                        </div>
                        <Frame
                            variant="ghost"
                            className="justify-center disabled:cursor-not-allowed disabled:opacity-60"
                            type="button"
                            onClick={handleExportGeneral}
                            disabled={isExportingGeneral}
                        >
                            {isExportingGeneral ? (
                                <span className="flex items-center gap-2">
                                    <span
                                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                                        aria-hidden
                                    />
                                    Exportando...
                                </span>
                            ) : (
                                "Exportar rendimiento"
                            )}
                        </Frame>
                    </div>
                    {isLoading || isLoadingExtras ? (
                        <div className="mt-3 space-y-2">
                            <Skeleton className="h-3 w-48" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                        </div>
                    ) : (
                        <div className="mt-3 overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/10 text-sm text-blue-100">
                                <thead className="bg-white/5 text-left text-white">
                                    <tr>
                                        <th className="px-3 py-2">Indicador</th>
                                        <th className="px-3 py-2">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    <tr>
                                        <td className="px-3 py-2 text-white">Solicitudes registradas</td>
                                        <td className="px-3 py-2">{metrics.total}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 text-white">Dictámenes remitidos</td>
                                        <td className="px-3 py-2">{metrics.remitidas}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 text-white">Por remitir</td>
                                        <td className="px-3 py-2">{metrics.pendientes}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 text-white">Por guardia</td>
                                        <td className="px-3 py-2">{metrics.porGuardia}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 text-white">Evidencias a Resguardo</td>
                                        <td className="px-3 py-2">{metrics.resguardoTotal}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 text-white">Remisiones a Laboratorio</td>
                                        <td className="px-3 py-2">{metrics.laboratorioTotal}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </Surface>

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
                            <div className="flex items-center justify-between">
                                <span>Última a Resguardo</span>
                                <span className="font-semibold text-white">
                                    {metrics.lastResguardo ?? "Sin datos"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Última a Laboratorio</span>
                                <span className="font-semibold text-white">
                                    {metrics.lastLaboratorio ?? "Sin datos"}
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

                <Surface variant="dark" className="mt-4 rounded-xl p-4">
                    <p className="text-sm font-semibold text-white">Medición por funcionario</p>
                    <p className="text-xs text-blue-100">
                        Solicitudes registradas y remisiones por persona (dictámenes, resguardo, laboratorio).
                    </p>
                    <div className="mt-2 flex justify-end">
                        <Frame
                            variant="ghost"
                            className="justify-center disabled:cursor-not-allowed disabled:opacity-60"
                            type="button"
                            onClick={handleExportFuncionarios}
                            disabled={isExportingFuncionarios}
                        >
                            {isExportingFuncionarios ? (
                                <span className="flex items-center gap-2">
                                    <span
                                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                                        aria-hidden
                                    />
                                    Exportando...
                                </span>
                            ) : (
                                "Exportar por funcionario"
                            )}
                        </Frame>
                    </div>
                    {isLoading || isLoadingExtras ? (
                        <div className="mt-3 space-y-2">
                            <Skeleton className="h-3 w-48" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                        </div>
                    ) : funcionarioStats.length === 0 ? (
                        <p className="mt-3 text-sm text-blue-100">Sin datos de funcionarios.</p>
                    ) : (
                        <div className="mt-3 overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/10 text-sm text-blue-100">
                                <thead className="bg-white/5 text-left text-white">
                                    <tr>
                                        <th className="px-3 py-2">Funcionario</th>
                                        <th className="px-3 py-2">Solicitudes registradas</th>
                                        <th className="px-3 py-2">Dictámenes remitidos</th>
                                        <th className="px-3 py-2">Por remitir</th>
                                        <th className="px-3 py-2">Evidencias a Resguardo</th>
                                        <th className="px-3 py-2">Remisiones a Laboratorio</th>
                                        <th className="px-3 py-2">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {funcionarioStats.map((row) => (
                                        <tr key={row.nombre}>
                                            <td className="px-3 py-2 text-white">{row.nombre}</td>
                                            <td className="px-3 py-2">{row.solicitudes}</td>
                                            <td className="px-3 py-2">{row.dictamenes}</td>
                                            <td className="px-3 py-2">{row.porRemitir}</td>
                                            <td className="px-3 py-2">{row.resguardo}</td>
                                            <td className="px-3 py-2">{row.laboratorio}</td>
                                            <td className="px-3 py-2 font-semibold text-white">{row.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Surface>
            </Surface>
        </DashboardLayout>
    );
};
