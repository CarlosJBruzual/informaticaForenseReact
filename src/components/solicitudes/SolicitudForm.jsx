import { useMemo, useState } from "react";
import { useSolicitudForm } from "../../hooks/useSolicitudForm";
import { SolicitudFormSkeleton } from "./SolicitudFormSkeleton";
import { Frame } from "../ui/Frame";
import { SelectField } from "../ui/SelectField";
import { TextInput } from "../ui/TextInput";
import { SplashOverlay } from "../ui/SplashOverlay";
import { Surface } from "../ui/Surface";

const experticiaOptions = [
    "Adquisición de Evidencia de Digital",
    "Determinacion de Evidencia Digital",
    "Coleccion de Registros Filmicos",
];

const buildFieldRows = (porGuardia) => [
    [
        {
            key: "numeroEntrada",
            label: "N° de Entrada",
            component: "input",
            required: true,
        },
        {
            key: "fechaRecepcion",
            label: "Fecha de Recepción",
            component: "input",
            inputType: "date",
            required: true,
        },
    ],
    [
        {
            key: "solicitante",
            label: "Solicitante",
            component: "input",
            required: true,
        },
        {
            key: "numeroSolicitud",
            label: "N° de Solicitud",
            component: "input",
            required: true,
        },
    ],
    [
        {
            key: "fechaSolicitud",
            label: "Fecha de Solicitud",
            component: "input",
            inputType: "date",
            required: true,
        },
        {
            key: "porGuardia",
            label: "Por Guardia",
            component: "select",
            options: ["Sí", "No"],
            formatValue: (data) => (data.porGuardia ? "Sí" : "No"),
            parseValue: (value) => value === "Sí",
        },
    ],
    [
        {
            key: "expediente",
            label: "Expediente o Causa Penal",
            component: "input",
            hint: porGuardia ? "No requerido para solicitudes por guardia" : undefined,
            disableWhen: porGuardia,
        },
    ],
    [
        {
            key: "tipoExperticia",
            label: "Tipo de Experticia",
            component: "select",
            options: experticiaOptions,
        },
    ],
];

export const SolicitudForm = ({
    onAdd,
    onCancel,
    onSuccess,
    canEditField,
    canSubmit = true,
    isReadOnly = false,
    isLoading = false,
}) => {
    const { formData, errors, hasErrors, setFieldValue, handleSubmit, resetForm } =
        useSolicitudForm((data) => {
            const primary = evidenceList[0] || {};
            const newSolicitud = {
                id: Date.now().toString(),
                ...data,
                descripcionEvidencia: primary.descripcion || data.descripcionEvidencia,
                evidenciaMarcaModelo: primary.marcaModelo || data.evidenciaMarcaModelo,
                evidenciaColorOtra:
                    primary.infoExtra ||
                    primary.numeroSerie ||
                    primary.capacidad ||
                    data.evidenciaColorOtra,
                evidencias: evidenceList,
            };
            onAdd?.(newSolicitud);
            onSuccess?.();
        });

    const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState("Telefono");
    const [evidenceForm, setEvidenceForm] = useState({});
    const [evidenceList, setEvidenceList] = useState([]);

    const fieldRows = useMemo(() => buildFieldRows(formData.porGuardia), [formData.porGuardia]);

    const evidenceTypeFields = useMemo(
        () => ({
            Telefono: [
                { key: "marca", label: "Marca" },
                { key: "modelo", label: "Modelo" },
                { key: "color", label: "Color" },
                { key: "imei", label: "IMEI / MEID" },
                { key: "numeroSerie", label: "Número de serie" },
                { key: "descripcion", label: "Descripción / notas" },
            ],
            Tablet: [
                { key: "marca", label: "Marca" },
                { key: "modelo", label: "Modelo" },
                { key: "color", label: "Color" },
                { key: "numeroSerie", label: "Número de serie" },
                { key: "almacenamiento", label: "Capacidad de almacenamiento" },
                { key: "descripcion", label: "Descripción / notas" },
            ],
            Pendrive: [
                { key: "marca", label: "Marca" },
                { key: "modelo", label: "Modelo" },
                { key: "capacidad", label: "Capacidad" },
                { key: "color", label: "Color" },
                { key: "numeroSerie", label: "Número de serie" },
                { key: "descripcion", label: "Descripción / notas" },
            ],
            DRV: [
                { key: "marca", label: "Marca" },
                { key: "modelo", label: "Modelo" },
                { key: "numeroSerie", label: "Número de serie" },
                { key: "discos", label: "Número / tamaño de discos" },
                { key: "descripcion", label: "Descripción / notas" },
            ],
            "Disco Optico": [
                { key: "tipo", label: "Tipo (CD/DVD/Blu-ray)" },
                { key: "etiqueta", label: "Etiqueta / rotulado" },
                { key: "color", label: "Color" },
                { key: "contenido", label: "Contenido declarado" },
                { key: "descripcion", label: "Descripción / notas" },
            ],
            GPS: [
                { key: "marca", label: "Marca" },
                { key: "modelo", label: "Modelo" },
                { key: "color", label: "Color" },
                { key: "numeroSerie", label: "Número de serie" },
                { key: "descripcion", label: "Descripción / notas" },
            ],
            "Red Social o Web": [
                { key: "rrss", label: "RRSS o URL" },
                { key: "descripcion", label: "Descripción / notas" },
            ],
        }),
        [],
    );

    const currentFields = evidenceTypeFields[selectedType] ?? [];

    const isFieldEditable = (fieldKey) => {
        if (typeof canEditField === "function") {
            return canEditField(fieldKey);
        }
        return !isReadOnly;
    };

    const syncPrimaryEvidence = (list) => {
        const primary = list[0] || {};
        const combinedMarcaModelo = [primary.marca, primary.modelo]
            .filter(Boolean)
            .join(" ")
            .trim();
        const extraInfo =
            primary.color ||
            primary.imei ||
            primary.numeroSerie ||
            primary.capacidad ||
            primary.contenido ||
            primary.discos ||
            primary.etiqueta ||
            primary.tipo ||
            primary.rrss ||
            "";

        setFieldValue("descripcionEvidencia", primary.descripcion || "");
        setFieldValue("evidenciaMarcaModelo", combinedMarcaModelo);
        setFieldValue("evidenciaColorOtra", extraInfo);
        setFieldValue("evidencias", list);
    };

    const handleEvidenceFieldChange = (key, value) => {
        setEvidenceForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleAddEvidence = () => {
        if (!selectedType) return;
        const newEvidence = {
            id: `${selectedType}-${Date.now()}`,
            tipo: selectedType,
            ...evidenceForm,
        };
        const nextList = [...evidenceList, newEvidence];
        setEvidenceList(nextList);
        syncPrimaryEvidence(nextList);
        setEvidenceForm({});
    };

    const resetEvidenceState = () => {
        setEvidenceList([]);
        setEvidenceForm({});
        setSelectedType("Telefono");
        setFieldValue("evidencias", []);
        setFieldValue("descripcionEvidencia", "");
        setFieldValue("evidenciaMarcaModelo", "");
        setFieldValue("evidenciaColorOtra", "");
    };

    const handleFormSubmit = (event) => {
        if (!canSubmit || isReadOnly) {
            event.preventDefault();
            return;
        }
        handleSubmit(event);
        resetEvidenceState();
    };

    const handleCancel = () => {
        resetForm();
        resetEvidenceState();
        onCancel?.();
    };

    const renderField = (field) => {
        const errorMessage = errors[field.key];
        const hint = errorMessage || field.hint;
        const disabled = Boolean(field.disableWhen) || !isFieldEditable(field.key);
        const sharedProps = {
            label: field.label,
            required: field.required,
            variant: "glass",
            labelTone: "light",
            disabled,
            hint,
            className: field.className,
            "aria-invalid": Boolean(errorMessage),
        };

        if (field.component === "select") {
            const value = field.formatValue ? field.formatValue(formData) : formData[field.key];
            return (
                <SelectField
                    key={field.key}
                    {...sharedProps}
                    value={value}
                    options={field.options}
                    onValueChange={(nextValue) => {
                        const parsed = field.parseValue
                            ? field.parseValue(nextValue, formData)
                            : nextValue;
                        setFieldValue(field.key, parsed);
                    }}
                />
            );
        }

        return (
            <TextInput
                key={field.key}
                {...sharedProps}
                type={field.inputType}
                value={formData[field.key]}
                onValueChange={(value) => setFieldValue(field.key, value)}
            />
        );
    };

    if (isLoading) {
        return <SolicitudFormSkeleton />;
    }

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6 text-left text-sm">
            {hasErrors ? (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-blue-100">
                    Revise los campos obligatorios antes de guardar la solicitud.
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {fieldRows.flat().map(renderField)}
            </div>

            <div className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h4 className="text-sm font-semibold text-white">Evidencias</h4>
                        <p className="text-xs text-blue-100">
                            Añade una o varias evidencias con sus datos específicos.
                        </p>
                    </div>
                    <Frame
                        type="button"
                        className="w-full justify-center sm:w-auto"
                        onClick={() => setIsEvidenceModalOpen(true)}
                        disabled={!isFieldEditable("descripcionEvidencia")}
                    >
                        Agregar evidencia
                    </Frame>
                </div>

                <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                    {evidenceList.length === 0 ? (
                        <p className="text-sm text-blue-100">Sin evidencias agregadas aún.</p>
                    ) : (
                        evidenceList.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col gap-1 rounded-lg border border-white/5 bg-white/5 p-3"
                            >
                                <span className="text-xs uppercase tracking-wide text-indigo-200">
                                    {item.tipo}
                                </span>
                                <span className="text-sm text-white">
                                    {item.descripcion || "Sin descripción"}
                                </span>
                                {[item.marca, item.modelo].some(Boolean) ? (
                                    <span className="text-xs text-blue-100">
                                        {[item.marca, item.modelo].filter(Boolean).join(" ")}
                                    </span>
                                ) : null}
                                {item.color ? (
                                    <span className="text-xs text-blue-200">Color: {item.color}</span>
                                ) : null}
                                {item.imei || item.numeroSerie ? (
                                    <span className="text-xs text-blue-200">
                                        {item.imei ? `IMEI/MEID: ${item.imei}` : null}
                                        {item.imei && item.numeroSerie ? " · " : ""}
                                        {item.numeroSerie ? `Serie: ${item.numeroSerie}` : null}
                                    </span>
                                ) : null}
                                {item.capacidad ? (
                                    <span className="text-xs text-blue-200">Capacidad: {item.capacidad}</span>
                                ) : null}
                                {item.contenido ? (
                                    <span className="text-xs text-blue-200">Contenido: {item.contenido}</span>
                                ) : null}
                                {item.discos ? (
                                    <span className="text-xs text-blue-200">Discos: {item.discos}</span>
                                ) : null}
                                {item.etiqueta ? (
                                    <span className="text-xs text-blue-200">Etiqueta: {item.etiqueta}</span>
                                ) : null}
                                {item.tipo ? (
                                    <span className="text-xs text-blue-200">Tipo: {item.tipo}</span>
                                ) : null}
                                {item.rrss ? (
                                    <span className="text-xs text-blue-200">RRSS/Web: {item.rrss}</span>
                                ) : null}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
                <Frame
                    variant="ghost"
                    className="px-6"
                    type="button"
                    onClick={handleCancel}
                >
                    Cancelar
                </Frame>
                <Frame variant="primary" className="px-6" type="submit" disabled={!canSubmit || isReadOnly}>
                    Guardar Solicitud
                </Frame>
            </div>

            <SplashOverlay isVisible={isEvidenceModalOpen}>
                <Surface
                    variant="glass"
                    className="w-full max-w-3xl max-h-[calc(100vh-6rem)] overflow-y-auto p-6 text-white"
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h4 className="text-lg font-semibold text-white">Agregar evidencia</h4>
                            <p className="text-sm text-blue-100">
                                Selecciona el tipo y completa los datos correspondientes.
                            </p>
                        </div>
                        <Frame
                            variant="ghost"
                            className="w-full justify-center sm:w-auto"
                            type="button"
                            onClick={() => setIsEvidenceModalOpen(false)}
                        >
                            Cerrar
                        </Frame>
                    </div>

                    <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <label className="text-xs font-semibold text-blue-100 md:col-span-2">
                                Tipo de evidencia
                                <select
                                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    {Object.keys(evidenceTypeFields).map((type) => (
                                        <option key={type} value={type} className="text-slate-900">
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {currentFields.map((field) => (
                                <TextInput
                                    key={field.key}
                                    label={field.label}
                                    value={evidenceForm[field.key] || ""}
                                    onValueChange={(value) => handleEvidenceFieldChange(field.key, value)}
                                    variant="glass"
                                    labelTone="light"
                                />
                            ))}
                            <TextInput
                                label="PRCC"
                                value={formData.prcc}
                                onValueChange={(value) => setFieldValue("prcc", value)}
                                required
                                hint={errors.prcc}
                                aria-invalid={Boolean(errors.prcc)}
                                variant="glass"
                                labelTone="light"
                            />
                        </div>

                        <div className="grid grid-cols-1">
                            <Frame
                                type="button"
                                className="w-full justify-center"
                                onClick={handleAddEvidence}
                            >
                                Añadir evidencia
                            </Frame>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-blue-100">Evidencias agregadas</p>
                            <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-blue-50">
                                {evidenceList.length === 0 ? (
                                    <p className="text-blue-100">Sin evidencias registradas aún.</p>
                                ) : (
                                    evidenceList.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col gap-1 rounded-lg border border-white/5 bg-white/5 p-2"
                                        >
                                            <span className="text-xs uppercase tracking-wide text-indigo-200">
                                                {item.tipo}
                                            </span>
                                            <span className="text-white">{item.descripcion || "Sin descripción"}</span>
                                            {item.marcaModelo ? (
                                                <span className="text-xs text-blue-100">{item.marcaModelo}</span>
                                            ) : null}
                                            {item.infoExtra || item.numeroSerie || item.capacidad || item.contenido ? (
                                                <span className="text-xs text-blue-200">
                                                    {item.infoExtra || item.numeroSerie || item.capacidad || item.contenido}
                                                </span>
                                            ) : null}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </Surface>
            </SplashOverlay>
        </form>
    );
};
