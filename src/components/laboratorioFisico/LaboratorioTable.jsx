import { useEffect, useMemo, useState } from "react";
import { Frame } from "../ui/Frame";
import { Skeleton } from "../ui/Skeleton";
import { Surface } from "../ui/Surface";

const columns = [
    { key: "numeroRemision", label: "N° Remisión", cellClassName: "font-semibold" },
    { key: "expediente", label: "Expediente" },
    { key: "prcc", label: "PRCC" },
    { key: "fechaRemision", label: "Fecha de remisión" },
    { key: "remitidoPor", label: "Funcionario que remitió" },
    { key: "recibidoPor", label: "Recibido por" },
    { key: "descripcion", label: "Descripción" },
];

const columnByKey = columns.reduce((acc, column) => {
    acc[column.key] = column;
    return acc;
}, {});

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

export const LaboratorioTable = ({
    title,
    items = [],
    emptyMessage,
    isLoading = false,
    pageSize = PAGE_SIZE,
    variant = "glass",
    onView,
}) => {
    const [pageIndex, setPageIndex] = useState(0);
    const isPaper = variant === "paper";
    const hasActions = Boolean(onView);
    const skeletonTone = isPaper ? "light" : "dark";
    const titleClass = isPaper ? "text-slate-900" : "text-white";
    const emptyClass = isPaper ? "text-slate-600" : "text-blue-100";
    const tableTextClass = isPaper ? "text-slate-800" : "text-blue-100";
    const tableDividerClass = isPaper ? "divide-slate-200" : "divide-white/10";
    const bodyDividerClass = isPaper ? "divide-slate-100" : "divide-white/10";
    const headBgClass = isPaper ? "bg-slate-100" : "bg-white/5";
    const headTextClass = isPaper ? "text-slate-700" : "text-white";

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
                <div className="hidden overflow-x-auto md:block">
                    <table className={`min-w-full divide-y text-sm ${tableTextClass} ${tableDividerClass}`.trim()}>
                        <thead className={`${headBgClass} ${headTextClass}`.trim()}>
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.key} className="px-3 py-2 text-left">
                                        {column.label}
                                    </th>
                                ))}
                                {hasActions ? <th className="px-3 py-2 text-left">Acciones</th> : null}
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
                                            {getCellValue(item, column.key)}
                                        </td>
                                    ))}
                                    {hasActions ? (
                                        <td className="px-3 py-2">
                                            <div className="flex flex-wrap gap-2">
                                                <Frame
                                                    variant="ghost"
                                                    className="px-3 py-1 text-xs"
                                                    type="button"
                                                    onClick={() => onView(item)}
                                                >
                                                    Ver
                                                </Frame>
                                            </div>
                                        </td>
                                    ) : null}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {items.length > 0 ? (
                <div
                    className={`mt-4 flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between ${
                        isPaper ? "text-slate-600" : "text-blue-100"
                    }`.trim()}
                >
                    <p>
                        Mostrando {pageStart + 1} - {Math.min(pageEnd, items.length)} de {items.length}
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
