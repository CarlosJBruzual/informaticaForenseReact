import { Frame } from "../ui/Frame";
import { Surface } from "../ui/Surface";
import { TextInput } from "../ui/TextInput";

export const ResguardoFilters = ({ filters, onChange, onReset, variant = "glass" }) => {
    const labelTone = variant === "paper" ? "dark" : "light";
    const inputVariant = variant === "paper" ? "light" : "glass";

    return (
        <Surface variant={variant} className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className={`text-base font-semibold ${labelTone === "light" ? "text-white" : "text-slate-900"}`}>
                        Filtro de búsqueda
                    </h3>
                    <p className={`text-xs ${labelTone === "light" ? "text-blue-100" : "text-slate-500"}`}>
                        Encuentra remisiones por expediente, PRCC o receptor.
                    </p>
                </div>
                <Frame
                    variant="ghost"
                    className="w-full justify-center sm:w-auto"
                    type="button"
                    onClick={onReset}
                >
                    Limpiar filtros
                </Frame>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <TextInput
                    label="Expediente"
                    value={filters.expediente}
                    onValueChange={(value) => onChange("expediente", value)}
                    labelTone={labelTone}
                    variant={inputVariant}
                />
                <TextInput
                    label="PRCC"
                    value={filters.prcc}
                    onValueChange={(value) => onChange("prcc", value)}
                    labelTone={labelTone}
                    variant={inputVariant}
                />
                <TextInput
                    type="date"
                    label="Fecha de recepción"
                    value={filters.fechaRecepcion}
                    onValueChange={(value) => onChange("fechaRecepcion", value)}
                    labelTone={labelTone}
                    variant={inputVariant}
                />
                <TextInput
                    label="Recibido por"
                    value={filters.recibidoPor}
                    onValueChange={(value) => onChange("recibidoPor", value)}
                    labelTone={labelTone}
                    variant={inputVariant}
                />
            </div>
        </Surface>
    );
};
