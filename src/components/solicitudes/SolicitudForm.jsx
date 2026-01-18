import { useMemo } from "react";
import { useSolicitudForm } from "../../hooks/useSolicitudForm";
import { SolicitudFormSkeleton } from "./SolicitudFormSkeleton";
import { Frame } from "../ui/Frame";
import { SelectField } from "../ui/SelectField";
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

const evidenciaPlaceholders = {
    descripcion: "No aplica",
    marcaModelo: "No aplica",
    colorOtra: "No aplica",
};

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
            key: "prcc",
            label: "PRCC",
            component: "input",
            required: true,
        },
    ],
    [
        {
            key: "numeroSolicitud",
            label: "N° de Solicitud",
            component: "input",
            required: true,
        },
        {
            key: "fechaSolicitud",
            label: "Fecha de Solicitud",
            component: "input",
            inputType: "date",
            required: true,
        },
    ],
    [
        {
            key: "porGuardia",
            label: "Por Guardia",
            component: "select",
            options: ["Sí", "No"],
            formatValue: (data) => (data.porGuardia ? "Sí" : "No"),
            parseValue: (value) => value === "Sí",
        },
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
            const newSolicitud = { id: Date.now().toString(), ...data };
            onAdd?.(newSolicitud);
            onSuccess?.();
        });

    const fieldRows = useMemo(() => buildFieldRows(formData.porGuardia), [formData.porGuardia]);

    const isFieldEditable = (fieldKey) => {
        if (typeof canEditField === "function") {
            return canEditField(fieldKey);
        }
        return !isReadOnly;
    };

    const handleFormSubmit = (event) => {
        if (!canSubmit || isReadOnly) {
            event.preventDefault();
            return;
        }
        handleSubmit(event);
    };

    const handleCancel = () => {
        resetForm();
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
                <div>
                    <h4 className="text-sm font-semibold text-white">Descripción de Evidencia</h4>
                    <p className="text-xs text-blue-100">Si no aplica, escriba "No aplica".</p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <TextInput
                        label="Descripción"
                        value={formData.descripcionEvidencia}
                        onValueChange={(value) => setFieldValue("descripcionEvidencia", value)}
                        placeholder={evidenciaPlaceholders.descripcion}
                        variant="glass"
                        labelTone="light"
                        disabled={!isFieldEditable("descripcionEvidencia")}
                        hint={errors.descripcionEvidencia}
                        aria-invalid={Boolean(errors.descripcionEvidencia)}
                    />
                    <TextInput
                        label="Marca y modelo"
                        value={formData.evidenciaMarcaModelo}
                        onValueChange={(value) => setFieldValue("evidenciaMarcaModelo", value)}
                        placeholder={evidenciaPlaceholders.marcaModelo}
                        variant="glass"
                        labelTone="light"
                        disabled={!isFieldEditable("evidenciaMarcaModelo")}
                        hint={errors.evidenciaMarcaModelo}
                        aria-invalid={Boolean(errors.evidenciaMarcaModelo)}
                    />
                    <TextInput
                        label="Color y otra información"
                        value={formData.evidenciaColorOtra}
                        onValueChange={(value) => setFieldValue("evidenciaColorOtra", value)}
                        placeholder={evidenciaPlaceholders.colorOtra}
                        variant="glass"
                        labelTone="light"
                        disabled={!isFieldEditable("evidenciaColorOtra")}
                        hint={errors.evidenciaColorOtra}
                        aria-invalid={Boolean(errors.evidenciaColorOtra)}
                    />
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
        </form>
    );
};
