import { Surface } from "./Surface";

const clampPercent = (value) => Math.min(100, Math.max(0, value));

const RadialGauge = ({ value }) => {
    const size = 44;
    const stroke = 4;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const safeValue = clampPercent(value);
    const offset = circumference - (safeValue / 100) * circumference;

    return (
        <div className="relative h-11 w-11">
            <svg className="h-11 w-11 -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                <circle
                    className="text-white/10"
                    stroke="currentColor"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="text-indigo-300"
                    stroke="currentColor"
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white">
                {Math.round(safeValue)}%
            </span>
        </div>
    );
};

export const StatCard = ({
    label,
    value,
    meta,
    progress,
    showGauge = false,
    className = "",
}) => {
    const progressValue = Number.isFinite(progress) ? clampPercent(progress) : null;

    return (
        <Surface variant="dark" className={`rounded-xl p-3 ${className}`.trim()}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wide text-blue-200">{label}</p>
                    <p className="mt-1 text-xl font-semibold text-white">{value}</p>
                    <p className="mt-1 text-xs text-blue-100">{meta}</p>
                </div>
                {showGauge && progressValue !== null ? (
                    <RadialGauge value={progressValue} />
                ) : null}
            </div>
            {progressValue !== null ? (
                <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-indigo-300 to-sky-300"
                        style={{ width: `${progressValue}%` }}
                    />
                </div>
            ) : null}
        </Surface>
    );
};
