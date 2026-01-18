import { useMemo, useState } from "react";
import { initialSolicitudState, REQUIRED_FIELDS } from "../services/solicitudSchema";

const createValidationErrors = (data) => {
    const errors = {};
    REQUIRED_FIELDS.forEach((field) => {
        const value = data[field];
        const normalized = typeof value === "string" ? value.trim() : value;
        if (!normalized) {
            errors[field] = "Campo obligatorio";
        }
    });
    return errors;
};

export const useSolicitudForm = (onSubmit) => {
    const [formData, setFormData] = useState(initialSolicitudState);
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const setFieldValue = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (!hasSubmitted) return;
        setErrors((prev) => {
            const next = { ...prev };
            if (REQUIRED_FIELDS.includes(field)) {
                const normalized = typeof value === "string" ? value.trim() : value;
                if (!normalized) {
                    next[field] = "Campo obligatorio";
                } else {
                    delete next[field];
                }
            }
            return next;
        });
    };

    const resetForm = () => {
        setFormData(initialSolicitudState);
        setErrors({});
        setHasSubmitted(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const nextErrors = createValidationErrors(formData);
        setErrors(nextErrors);
        setHasSubmitted(true);
        if (Object.keys(nextErrors).length > 0) return;
        onSubmit?.(formData);
        resetForm();
    };

    const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

    return {
        formData,
        errors,
        hasErrors,
        setFieldValue,
        handleSubmit,
        resetForm,
    };
};
