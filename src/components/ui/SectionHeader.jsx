export const SectionHeader = ({ title, subtitle, align = "center" }) => {
    const alignment = align === "left" ? "items-start text-left" : "items-center text-center";
    return (
        <div className={`flex flex-col gap-2 ${alignment}`}>
            <p className="text-xl font-semibold text-white drop-shadow">{title}</p>
            {subtitle ? <p className="text-base text-blue-100">{subtitle}</p> : null}
        </div>
    );
};
