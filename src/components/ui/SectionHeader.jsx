export const SectionHeader = ({
    title,
    subtitle,
    align = "center",
    className = "",
    titleClassName = "",
    subtitleClassName = "",
}) => {
    const alignmentMap = {
        center: "items-center text-center",
        left: "items-start text-left",
        responsive: "items-center text-center sm:items-start sm:text-left",
    };
    const alignment = alignmentMap[align] ?? alignmentMap.center;

    return (
        <div className={`flex flex-col gap-2 ${alignment} ${className}`.trim()}>
            <p className={`text-xl font-semibold text-white drop-shadow ${titleClassName}`.trim()}>
                {title}
            </p>
            {subtitle ? (
                <p className={`text-base text-blue-100 ${subtitleClassName}`.trim()}>{subtitle}</p>
            ) : null}
        </div>
    );
};
