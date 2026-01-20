import { useEffect, useMemo, useState } from "react";
import { Frame } from "../ui/Frame";
import { Skeleton } from "../ui/Skeleton";
import { Surface } from "../ui/Surface";

const columns = [
    {
        key: "numeroEntrada",
        label: "N° Entrada",
        cellClassName: "font-semibold",
        render: (item) => item.numeroEntrada,
    },
    { key: "fechaRecepcion", label: "Fecha Recepción" },
    { key: "solicitante", label: "Solicitante" },
    { key: "numeroSolicitud", label: "N° Solicitud" },
    {
        key: "expediente",
        label: "Expediente o Causa Penal",
        render: (item) => (item.porGuardia ? "Por Guardia" : item.expediente || "-"),
    },
    { key: "prcc", label: "PRCC" },
    { key: "prcc2", label: "PRCC 2", render: (item) => item.prcc2 || "-" },
    { key: "tipoExperticia", label: "Tipo Experticia" },
    {
        key: "porGuardia",
        label: "Por Guardia",
        render: (item) => (item.porGuardia ? "Sí" : "No"),
    },
];

const columnByKey = columns.reduce((acc, column) => {
    acc[column.key] = column;
    return acc;
}, {});

const mobileFields = [
    { key: "solicitante", label: "Solicitante" },
    { key: "numeroSolicitud", label: "N° Solicitud" },
    { key: "tipoExperticia", label: "Tipo Experticia" },
    { key: "expediente", label: "Expediente o Causa" },
    { key: "prcc", label: "PRCC" },
    { key: "prcc2", label: "PRCC 2" },
];

const SkeletonRow = ({ tone = "light" }) => (
    <div className="flex items-center gap-3">
        <Skeleton tone={tone} className="h-4 w-24" />
        <Skeleton tone={tone} className="h-4 w-32" />
        <Skeleton tone={tone} className="h-4 w-40" />
        <Skeleton tone={tone} className="h-4 w-28" />
        <Skeleton tone={tone} className="h-4 w-28" />
    </div>
);

const PAGE_SIZE = 20;

export const SolicitudesTable = ({
    title,
    items = [],
    emptyMessage,
    isLoading = false,
    pageSize = PAGE_SIZE,
    variant = "paper",
    onView,
    onRemit,
}) => {
    const [pageIndex, setPageIndex] = useState(0);
    const isPaper = variant === "paper";
    const hasActions = Boolean(onView || onRemit);
    const skeletonTone = isPaper ? "light" : "dark";
    const titleClass = isPaper ? "text-slate-900" : "text-white";
    const emptyClass = isPaper ? "text-slate-600" : "text-blue-100";
    const tableTextClass = isPaper ? "text-slate-800" : "text-blue-100";
    const tableDividerClass = isPaper ? "divide-slate-200" : "divide-white/10";
    const bodyDividerClass = isPaper ? "divide-slate-100" : "divide-white/10";
    const headBgClass = isPaper ? "bg-slate-100" : "bg-white/5";
    const headTextClass = isPaper ? "text-slate-700" : "text-white";
    const footerTextClass = isPaper ? "text-slate-600" : "text-blue-100";
    const cardLabelClass = isPaper ? "text-slate-500" : "text-blue-200";
    const cardValueClass = isPaper ? "text-slate-800" : "text-blue-100";
    const cardTitleClass = isPaper ? "text-slate-900" : "text-white";
    const cardDividerClass = isPaper ? "border-slate-200/70" : "border-white/10";
    const badgeClass = isPaper
        ? "border-slate-200 bg-slate-100 text-slate-700"
        : "border-white/10 bg-white/5 text-blue-100";

    useEffect(() => {
        setPageIndex(0);
    }, [items]);

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const safePageIndex = Math.min(pageIndex, totalPages - 1);
    const pageStart = safePageIndex * pageSize;
    const pageEnd = pageStart + pageSize;
    const pagedItems = useMemo(
        () => items.slice(pageStart, pageEnd),
        [items, pageEnd, pageStart],
    );

    const getCellValue = (item, key) => {
        const column = columnByKey[key];
        return column?.render ? column.render(item) : item[key];
    };

    const canGoPrev = safePageIndex > 0;
    const canGoNext = safePageIndex < totalPages - 1;

    if (isLoading) {
        return (
            <Surface variant={variant} className="p-4">
                <div className="mb-4">
                    <Skeleton tone={skeletonTone} className="h-4 w-48" />
                </div>
                <div className="space-y-3">
                    <SkeletonRow tone={skeletonTone} />
                    <SkeletonRow tone={skeletonTone} />
                    <SkeletonRow tone={skeletonTone} />
                    <SkeletonRow tone={skeletonTone} />
                </div>
            </Surface>
        );
    }

    return (
        <Surface variant={variant} className="p-4">
            <h3 className={`mb-3 text-base font-semibold ${titleClass}`.trim()}>{title}</h3>
            {items.length === 0 ? (
                <p className={`text-sm ${emptyClass}`.trim()}>{emptyMessage}</p>
            ) : (
                <>
                    <div className="space-y-3 md:hidden">
                        {pagedItems.map((item) => (
                            <Surface
                                key={item.id}
                                variant={variant}
                                className={`rounded-xl p-3 ${cardDividerClass}`.trim()}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1">
                                        <p className={`text-[11px] uppercase tracking-wide ${cardLabelClass}`.trim()}>
                                            N° Entrada
                                        </p>
                                        <p className={`text-base font-semibold ${cardTitleClass}`.trim()}>
                                            {getCellValue(item, "numeroEntrada")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-[11px] uppercase tracking-wide ${cardLabelClass}`.trim()}>
                                            Recepción
                                        </p>
                                        <p className={`text-xs font-semibold ${cardValueClass}`.trim()}>
                                            {getCellValue(item, "fechaRecepcion")}
                                        </p>
                                        {item.porGuardia ? (
                                            <span
                                                className={`mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badgeClass}`.trim()}
                                            >
                                                Por guardia
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="mt-3 grid grid-cols-1 gap-2 text-xs">
                                    {mobileFields.map((field) => {
                                        const rawValue =
                                            field.key === "expediente" && item.porGuardia
                                                ? item.expediente ?? "-"
                                                : getCellValue(item, field.key);
                                        const displayValue =
                                            rawValue === null || rawValue === undefined || rawValue === ""
                                                ? "-"
                                                : rawValue;

                                        return (
                                            <div
                                                key={`${item.id}-${field.key}`}
                                                className="flex items-center justify-between gap-2"
                                            >
                                                <span className={cardLabelClass}>{field.label}</span>
                                                <span className={`text-right ${cardValueClass}`.trim()}>
                                                    {displayValue}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                {hasActions ? (
                                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                        {onView ? (
                                            <Frame
                                                variant="ghost"
                                                className="w-full justify-center px-3 py-1 text-xs sm:w-auto"
                                                type="button"
                                                onClick={() => onView(item)}
                                            >
                                                Ver
                                            </Frame>
                                        ) : null}
                                        {onRemit ? (
                                            item.remision ? (
                                                <span
                                                    className={`w-full rounded-lg border px-3 py-1 text-center text-xs sm:w-auto ${badgeClass}`.trim()}
                                                >
                                                    Evidencia remitida
                                                </span>
                                            ) : (
                                                <Frame
                                                    variant="primary"
                                                    className="w-full justify-center px-3 py-1 text-xs sm:w-auto"
                                                    type="button"
                                                    onClick={() => onRemit(item)}
                                                >
                                                    Remitir Dictamen
                                                </Frame>
                                            )
                                        ) : null}
                                    </div>
                                ) : null}
                            </Surface>
                        ))}
                    </div>
                    <div className="hidden overflow-x-auto md:block">
                        <table
                            className={`min-w-full divide-y text-sm ${tableTextClass} ${tableDividerClass}`.trim()}
                        >
                            <thead className={`${headBgClass} ${headTextClass}`.trim()}>
                                <tr>
                                    {columns.map((column) => (
                                        <th key={column.key} className="px-3 py-2 text-left">
                                            {column.label}
                                        </th>
                                    ))}
                                    {hasActions ? (
                                        <th className="px-3 py-2 text-left">Acciones</th>
                                    ) : null}
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${bodyDividerClass}`.trim()}>
                                {pagedItems.map((item) => (
                                    <tr key={item.id}>
                                        {columns.map((column) => (
                                            <td
                                                key={`${item.id}-${column.key}`}
                                                className={`px-3 py-2 ${column.cellClassName ?? ""}`.trim()}
                                            >
                                                {column.render ? column.render(item) : item[column.key]}
                                            </td>
                                        ))}
                                        {hasActions ? (
                                            <td className="px-3 py-2">
                                                <div className="flex flex-wrap gap-2">
                                                    {onView ? (
                                                        <Frame
                                                            variant="ghost"
                                                            className="px-3 py-1 text-xs"
                                                            type="button"
                                                            onClick={() => onView(item)}
                                                        >
                                                            Ver
                                                        </Frame>
                                                    ) : null}
                                                    {onRemit ? (
                                                        item.remision ? (
                                                            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-blue-100">
                                                                Evidencia remitida
                                                            </span>
                                                        ) : (
                                                            <Frame
                                                                variant="primary"
                                                                className="px-3 py-1 text-xs"
                                                                type="button"
                                                                onClick={() => onRemit(item)}
                                                            >
                                                                Remitir Dictamen
                                                            </Frame>
                                                        )
                                                    ) : null}
                                                </div>
                                            </td>
                                        ) : null}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            {items.length > 0 ? (
                <div
                    className={`mt-4 flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between ${footerTextClass}`.trim()}
                >
                    <p>
                        Mostrando {pageStart + 1} - {Math.min(pageEnd, items.length)} de{" "}
                        {items.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <Frame
                            variant="ghost"
                            className="px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
                            type="button"
                            onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
                            disabled={!canGoPrev}
                        >
                            Anterior
                        </Frame>
                        <span>
                            Página {safePageIndex + 1} de {totalPages}
                        </span>
                        <Frame
                            variant="ghost"
                            className="px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
                            type="button"
                            onClick={() => setPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
                            disabled={!canGoNext}
                        >
                            Siguiente
                        </Frame>
                    </div>
                </div>
            ) : null}
        </Surface>
    );
};
