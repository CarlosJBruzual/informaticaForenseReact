import { useEffect, useState } from "react";
import { Frame } from "../ui/Frame";
import { Surface } from "../ui/Surface";
import { TextInput } from "../ui/TextInput";

const initialRemisionState = {
    fechaRemision: "",
    numeroDictamen: "",
    funcionarioRecibe: "",
    funcionarioEntrega: "",
};

const requiredFields = Object.keys(initialRemisionState);

const buildErrors = (data) => {
    const errors = {};
    requiredFields.forEach((field) => {
        const value = data[field];
        if (!value || (typeof value === "string" && !value.trim())) {
            errors[field] = "Campo obligatorio";
        }
    });
    return errors;
};

export const RemisionModal = ({ solicitud, onClose, onSubmit, isReadOnly = false }) => {
    const [formData, setFormData] = useState(initialRemisionState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!solicitud) return;
        setFormData({ ...initialRemisionState, ...(solicitud.remision ?? {}) });
        setErrors({});
    }, [solicitud]);

    if (!solicitud) return null;

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (!errors[field]) return;
        setErrors((prev) => {
            const next = { ...prev };
            if (value && value.toString().trim()) {
                delete next[field];
            }
            return next;
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isReadOnly) return;
        const nextErrors = buildErrors(formData);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
        onSubmit?.(formData);
    };

    return (
        <Surface
            variant="glass"
            className="w-full max-w-4xl max-h-[calc(100vh-6rem)] overflow-y-auto p-6 text-white"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white">Remitir Dictamen</h3>
                    <p className="text-sm text-blue-100">{solicitud.numeroSolicitud}</p>
                </div>
                <Frame
                    variant="ghost"
                    className="w-full justify-center sm:w-auto"
                    type="button"
                    onClick={onClose}
                >
                    Cerrar
                </Frame>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextInput
                    type="date"
                    label="Fecha de Remisión"
                    value={formData.fechaRemision}
                    onValueChange={(value) => handleChange("fechaRemision", value)}
                    required
                    variant="glass"
                    labelTone="light"
                    disabled={isReadOnly}
                    hint={errors.fechaRemision}
                    aria-invalid={Boolean(errors.fechaRemision)}
                />
                <TextInput
                    label="N° de Dictamen"
                    value={formData.numeroDictamen}
                    onValueChange={(value) => handleChange("numeroDictamen", value)}
                    required
                    variant="glass"
                    labelTone="light"
                    disabled={isReadOnly}
                    hint={errors.numeroDictamen}
                    aria-invalid={Boolean(errors.numeroDictamen)}
                />
                <TextInput
                    label="Funcionario que recibe"
                    value={formData.funcionarioRecibe}
                    onValueChange={(value) => handleChange("funcionarioRecibe", value)}
                    required
                    variant="glass"
                    labelTone="light"
                    disabled={isReadOnly}
                    hint={errors.funcionarioRecibe}
                    aria-invalid={Boolean(errors.funcionarioRecibe)}
                />
                <TextInput
                    label="Funcionario que entregó"
                    value={formData.funcionarioEntrega}
                    onValueChange={(value) => handleChange("funcionarioEntrega", value)}
                    required
                    variant="glass"
                    labelTone="light"
                    disabled={isReadOnly}
                    hint={errors.funcionarioEntrega}
                    aria-invalid={Boolean(errors.funcionarioEntrega)}
                />

                <div className="flex flex-wrap justify-end gap-3 md:col-span-2">
                    <Frame
                        variant="ghost"
                        className="px-6"
                        type="button"
                        onClick={onClose}
                    >
                        Cancelar
                    </Frame>
                    <Frame
                        variant="primary"
                        className="px-6"
                        type="submit"
                        disabled={isReadOnly}
                    >
                        Guardar Remisión
                    </Frame>
                </div>
            </form>
        </Surface>
    );
};
