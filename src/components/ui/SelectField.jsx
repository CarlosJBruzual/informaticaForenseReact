import { useId } from "react";
import { getFieldClasses, getHintClasses, getLabelClasses } from "./fieldStyles";

export const SelectField = ({
    label,
    hint,
    id,
    value,
    onChange,
    onValueChange,
    options = [],
    placeholder = "Seleccione una opción",
    required,
    disabled,
    variant = "glass",
    labelTone = "dark",
    className = "",
    selectClassName = "",
    ...props
}) => {
    const fallbackId = useId();
    const selectId = id ?? fallbackId;
    const handleChange = (event) => {
        onChange?.(event);
        onValueChange?.(event.target.value);
    };

    const normalizedOptions = options.map((opt) =>
        typeof opt === "string" ? { value: opt, label: opt } : opt,
    );

    return (
        <label htmlFor={selectId} className={`flex w-full flex-col gap-2 text-sm ${className}`.trim()}>
            {label ? <span className={getLabelClasses({ tone: labelTone })}>{label}</span> : null}
            <select
                id={selectId}
                value={value ?? ""}
                onChange={handleChange}
                required={required}
                disabled={disabled}
                className={getFieldClasses({ variant, disabled, className: selectClassName })}
                {...props}
            >
                <option value="">{placeholder}</option>
                {normalizedOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {hint ? <p className={getHintClasses({ tone: labelTone })}>{hint}</p> : null}
        </label>
    );
};
