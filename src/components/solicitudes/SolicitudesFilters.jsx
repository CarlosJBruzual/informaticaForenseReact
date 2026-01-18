import { useState } from "react";
import { Frame } from "../ui/Frame";
import { SelectField } from "../ui/SelectField";
import { Surface } from "../ui/Surface";
import { TextInput } from "../ui/TextInput";

const experticiaOptions = [
    "Informática",
    "Telefonía",
    "Video",
    "Audio",
    "Imagen",
    "Documentos Digitales",
    "Redes y Comunicaciones",
];

const yesNoOptions = ["Sí", "No"];

export const SolicitudesFilters = ({
    filters,
    onChange,
    onReset,
    variant = "paper",
}) => {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    return (
        <Surface variant={variant} className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3
                        className={`text-base font-semibold ${
                            variant === "paper" ? "text-slate-900" : "text-white"
                        }`}
                    >
                        Filtro de búsqueda
                    </h3>
                    <p
                        className={`text-xs ${
                            variant === "paper" ? "text-slate-500" : "text-blue-100"
                        }`}
                    >
                        Filtros básicos para localizar solicitudes.
                    </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <Frame
                        variant="ghost"
                        className="w-full justify-center sm:w-auto"
                        type="button"
                        onClick={() => setIsAdvancedOpen((value) => !value)}
                    >
                        Filtro avanzado {isAdvancedOpen ? "▾" : "▸"}
                    </Frame>
                    <Frame
                        variant="ghost"
                        className="w-full justify-center sm:w-auto"
                        type="button"
                        onClick={onReset}
                    >
                        Limpiar filtros
                    </Frame>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <TextInput
                    label="Expediente o Causa Penal"
                    value={filters.expediente}
                    onValueChange={(value) => onChange("expediente", value)}
                    labelTone={variant === "paper" ? "dark" : "light"}
                    variant={variant === "paper" ? "light" : "glass"}
                />
                <TextInput
                    type="date"
                    label="Fecha de Recepción"
                    value={filters.fechaRecepcion}
                    onValueChange={(value) => onChange("fechaRecepcion", value)}
                    labelTone={variant === "paper" ? "dark" : "light"}
                    variant={variant === "paper" ? "light" : "glass"}
                />
                <SelectField
                    label="Tipo de Experticia"
                    value={filters.tipoExperticia}
                    onValueChange={(value) => onChange("tipoExperticia", value)}
                    options={experticiaOptions}
                    placeholder="Todos"
                    variant={variant === "paper" ? "light" : "glass"}
                    labelTone={variant === "paper" ? "dark" : "light"}
                />
            </div>

            {isAdvancedOpen ? (
                <div className="mt-6 space-y-3">
                    <div>
                        <h4
                            className={`text-sm font-semibold ${
                                variant === "paper" ? "text-slate-900" : "text-white"
                            }`}
                        >
                            Filtros avanzados
                        </h4>
                        <p
                            className={`text-xs ${
                                variant === "paper" ? "text-slate-500" : "text-blue-100"
                            }`}
                        >
                            Combine campos para una búsqueda precisa en el historial.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <TextInput
                            label="N° de Entrada"
                            value={filters.numeroEntrada}
                            onValueChange={(value) => onChange("numeroEntrada", value)}
                            labelTone={variant === "paper" ? "dark" : "light"}
                            variant={variant === "paper" ? "light" : "glass"}
                        />
                        <TextInput
                            label="N° de Solicitud"
                            value={filters.numeroSolicitud}
                            onValueChange={(value) => onChange("numeroSolicitud", value)}
                            labelTone={variant === "paper" ? "dark" : "light"}
                            variant={variant === "paper" ? "light" : "glass"}
                        />
                        <TextInput
                            label="PRCC"
                            value={filters.prcc}
                            onValueChange={(value) => onChange("prcc", value)}
                            labelTone={variant === "paper" ? "dark" : "light"}
                            variant={variant === "paper" ? "light" : "glass"}
                        />
                        <TextInput
                            type="date"
                            label="Fecha de Solicitud"
                            value={filters.fechaSolicitud}
                            onValueChange={(value) => onChange("fechaSolicitud", value)}
                            labelTone={variant === "paper" ? "dark" : "light"}
                            variant={variant === "paper" ? "light" : "glass"}
                        />
                        <SelectField
                            label="Por Guardia"
                            value={filters.porGuardia}
                            onValueChange={(value) => onChange("porGuardia", value)}
                            options={yesNoOptions}
                            placeholder="Todos"
                            variant={variant === "paper" ? "light" : "glass"}
                            labelTone={variant === "paper" ? "dark" : "light"}
                        />
                    </div>
                </div>
            ) : null}
        </Surface>
    );
};
