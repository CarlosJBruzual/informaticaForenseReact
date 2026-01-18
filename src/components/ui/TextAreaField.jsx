import { useId } from "react";
import { getFieldClasses, getHintClasses, getLabelClasses } from "./fieldStyles";

export const TextAreaField = ({
    label,
    hint,
    id,
    value,
    onChange,
    onValueChange,
    placeholder,
    required,
    disabled,
    rows = 4,
    variant = "glass",
    labelTone = "dark",
    className = "",
    textareaClassName = "",
    ...props
}) => {
    const fallbackId = useId();
    const textareaId = id ?? fallbackId;
    const controlledProps = value !== undefined ? { value } : {};

    const handleChange = (event) => {
        onChange?.(event);
        onValueChange?.(event.target.value);
    };

    return (
        <label htmlFor={textareaId} className={`flex w-full flex-col gap-2 text-sm ${className}`.trim()}>
            {label ? <span className={getLabelClasses({ tone: labelTone })}>{label}</span> : null}
            <textarea
                id={textareaId}
                rows={rows}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                onChange={handleChange}
                className={getFieldClasses({ variant, disabled, className: textareaClassName })}
                {...controlledProps}
                {...props}
            />
            {hint ? <p className={getHintClasses({ tone: labelTone })}>{hint}</p> : null}
        </label>
    );
};
