import { useMemo, useState } from "react";
import { Frame } from "../../components/ui/Frame";
import { SectionHeader } from "../../components/ui/SectionHeader";

const menuItems = [
    { label: "Solicitudes", variant: "primary", hasSubmenu: true },
    { label: "Evidencias en Resguardo", variant: "ghost" },
    { label: "Remisiones al Laboratorio Físico", variant: "ghost" },
    { label: "Remisiones a Sala de Resguardo", variant: "ghost" },
    { label: "Busqueda", variant: "ghost" },
    { label: "Cerrar Sesión", variant: "ghost" },
];

const solicitudesSubmenu = ["Recibidas", "Remitidas", "Por Guardia"];

const initialFormState = {
    numeroEntrada: "",
    fechaRecepcion: "",
    solicitante: "",
    numeroSolicitud: "",
    fechaSolicitud: "",
    expediente: "",
    prcc: "",
    descripcionEvidencia: "",
    tipoExperticia: "",
    numeroDictamen: "",
    remitido: "",
    porGuardia: false,
};

const normalize = (value = "") =>
    value
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[\s_-]+/g, "");

const SolicitudForm = ({ onAdd }) => {
    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newSolicitud = { id: Date.now().toString(), ...formData };
        onAdd?.(newSolicitud);
        setFormData(initialFormState);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-left text-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                    label="N° de Entrada"
                    value={formData.numeroEntrada}
                    onChange={(v) => handleChange("numeroEntrada", v)}
                    required
                />
                <Field
                    type="date"
                    label="Fecha de Recepción"
                    value={formData.fechaRecepcion}
                    onChange={(v) => handleChange("fechaRecepcion", v)}
                    required
                />
                <Field
                    label="Solicitante"
                    value={formData.solicitante}
                    onChange={(v) => handleChange("solicitante", v)}
                    required
                />
                <Field
                    label="N° de Solicitud"
                    value={formData.numeroSolicitud}
                    onChange={(v) => handleChange("numeroSolicitud", v)}
                    required
                />
                <Field
                    type="date"
                    label="Fecha de Solicitud"
                    value={formData.fechaSolicitud}
                    onChange={(v) => handleChange("fechaSolicitud", v)}
                    required
                />
                <Field
                    label="Expediente"
                    value={formData.expediente}
                    onChange={(v) => handleChange("expediente", v)}
                    disabled={formData.porGuardia}
                    hint={formData.porGuardia ? "No requerido para solicitudes por guardia" : undefined}
                />
                <Field
                    label="PRCC"
                    value={formData.prcc}
                    onChange={(v) => handleChange("prcc", v)}
                    required
                />
                <SelectField
                    label="Tipo de Experticia"
                    value={formData.tipoExperticia}
                    onChange={(v) => handleChange("tipoExperticia", v)}
                    options={["Informática", "Telefonía", "Video", "Audio", "Imagen", "Documentos Digitales", "Redes y Comunicaciones"]}
                />
                <Field
                    label="N° de Dictamen"
                    value={formData.numeroDictamen}
                    onChange={(v) => handleChange("numeroDictamen", v)}
                />
                <SelectField
                    label="Remitido"
                    value={formData.remitido}
                    onChange={(v) => handleChange("remitido", v)}
                    options={["Sí", "No"]}
                />
                <SelectField
                    label="Por Guardia"
                    value={formData.porGuardia ? "Sí" : "No"}
                    onChange={(v) => handleChange("porGuardia", v === "Sí")}
                    options={["Sí", "No"]}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">Descripción de Evidencia</label>
                <textarea
                    className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    rows={4}
                    value={formData.descripcionEvidencia}
                    onChange={(e) => handleChange("descripcionEvidencia", e.target.value)}
                    placeholder="Ingrese la descripción detallada de la evidencia"
                    required
                />
            </div>

            <div className="flex justify-end gap-3">
                <Frame variant="ghost" className="px-6" type="button" onClick={() => setFormData(initialFormState)}>
                    Cancelar
                </Frame>
                <Frame variant="primary" className="px-6" type="submit">
                    Guardar Solicitud
                </Frame>
            </div>
        </form>
    );
};

const Field = ({ label, value, onChange, type = "text", disabled, hint, required }) => (
    <div className="space-y-2">
        <label className="text-sm font-semibold text-white">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            required={required}
            className={`w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                disabled ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""
            }`}
        />
        {hint ? <p className="text-xs text-blue-600">{hint}</p> : null}
    </div>
);

const SelectField = ({ label, value, onChange, options }) => (
    <div className="space-y-2">
        <label className="text-sm font-semibold text-white">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
            <option value="">Seleccione una opción</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    </div>
);

export const Solicitudes = () => {
    const [isSolicitudesOpen, setIsSolicitudesOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState("Solicitudes");
    const [activeSubmenu, setActiveSubmenu] = useState("");
    const [solicitudes, setSolicitudes] = useState([]);

    const handleAddSolicitud = (s) => {
        const sanitized = { ...s, porGuardia: s.porGuardia === true };
        setSolicitudes((prev) => [sanitized, ...prev]);
    };

    const tituloContenido = useMemo(() => {
        if (activeMenu !== "Solicitudes") return activeMenu;
        return `${activeMenu} - ${activeSubmenu}`;
    }, [activeMenu, activeSubmenu]);

    const solicitudesFiltradas = useMemo(() => {
        if (activeMenu !== "Solicitudes") return [];
        const normSub = normalize(activeSubmenu);
        if (normSub === "remitidas") {
            return solicitudes.filter((s) => normalize(s.remitido) === "si");
        }
        if (normSub === "porguardia") {
            return solicitudes.filter((s) => s.porGuardia === true);
        }
        return solicitudes;
    }, [activeMenu, activeSubmenu, solicitudes]);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-midnight via-indigoMid to-slateDeep px-6 py-10 text-white">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                <header className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
                    <img
                        src="/Image.png"
                        alt="CICPC"
                        className="h-20 w-20 object-contain"
                    />
                    <SectionHeader
                        title="DIVISIÓN DE CRIMINALÍSTICA MUNICIPAL MARACAIBO"
                        subtitle="Área de Experticias Informáticas"
                        align="left"
                    />
                </header>

                <div className="flex w-full flex-col gap-6 lg:flex-row">
                    <aside className="w-72 flex-none rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-xl backdrop-blur">
                        <div className="flex flex-col gap-3">
                            {menuItems.map((item, idx) => {
                                const isFirst = idx === 0;
                                if (item.hasSubmenu) {
                                    return (
                                        <div key={item.label} className="flex flex-col gap-2">
                                            <Frame
                                                variant="primary"
                                                className="justify-between text-left"
                                                onClick={() => {
                                                    setActiveMenu("Solicitudes");
                                                    setActiveSubmenu("");
                                                    setIsSolicitudesOpen((v) => !v);
                                                }}
                                            >
                                                <span>{item.label}</span>
                                                <span className="text-lg text-indigo-100">
                                                    {isSolicitudesOpen ? "▾" : "▸"}
                                                </span>
                                            </Frame>

                                            {isSolicitudesOpen && (
                                                <div className="ml-2 flex flex-col gap-2">
                                                    {solicitudesSubmenu.map((sub) => (
                                                        <Frame
                                                            key={sub}
                                                            variant="ghost"
                                                            className={`justify-between text-left border border-white/5 bg-white/10 text-sm ${
                                                                activeSubmenu === sub && activeMenu === "Solicitudes"
                                                                    ? "bg-indigo-500/20"
                                                                    : ""
                                                            }`}
                                                            onClick={() => {
                                                                setActiveMenu("Solicitudes");
                                                                setActiveSubmenu(sub);
                                                            }}
                                                        >
                                                            <span>{sub}</span>
                                                        </Frame>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <Frame
                                        key={item.label}
                                        variant={item.variant === "primary" ? "primary" : "ghost"}
                                        className={`justify-between text-left ${
                                            isFirst ? "" : "border border-white/5"
                                        }`}
                                        onClick={() => {
                                            setActiveMenu(item.label);
                                            setActiveSubmenu("");
                                        }}
                                    >
                                        <span>{item.label}</span>
                                        <span className="text-lg text-indigo-200">›</span>
                                    </Frame>
                                );
                            })}
                        </div>
                    </aside>

                    <main className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-8 text-left shadow-2xl backdrop-blur">
                        <h2 className="mb-4 text-xl font-semibold text-white">{tituloContenido}</h2>

                        {activeMenu === "Solicitudes" && activeSubmenu === "" ? (
                            <div className="flex flex-col gap-6 text-sm">
                                <SolicitudForm onAdd={handleAddSolicitud} />

                                <section className="rounded-xl border border-white/40 bg-white p-4 shadow">
                                    <h3 className="mb-3 text-base font-semibold text-slate-900">Historial de Solicitudes</h3>
                                    {solicitudes.length === 0 ? (
                                        <p className="text-sm text-slate-600">No hay solicitudes registradas.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-800">
                                                <thead className="bg-slate-100">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left">N° Entrada</th>
                                                        <th className="px-3 py-2 text-left">Fecha Recepción</th>
                                                        <th className="px-3 py-2 text-left">Solicitante</th>
                                                        <th className="px-3 py-2 text-left">N° Solicitud</th>
                                                        <th className="px-3 py-2 text-left">Expediente</th>
                                                        <th className="px-3 py-2 text-left">PRCC</th>
                                                        <th className="px-3 py-2 text-left">Tipo Experticia</th>
                                                        <th className="px-3 py-2 text-left">N° Dictamen</th>
                                                        <th className="px-3 py-2 text-left">Remitido</th>
                                                        <th className="px-3 py-2 text-left">Por Guardia</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {solicitudes.map((s) => (
                                                        <tr key={s.id}>
                                                            <td className="px-3 py-2 font-semibold">{s.numeroEntrada}</td>
                                                            <td className="px-3 py-2">{s.fechaRecepcion}</td>
                                                            <td className="px-3 py-2">{s.solicitante}</td>
                                                            <td className="px-3 py-2">{s.numeroSolicitud}</td>
                                                            <td className="px-3 py-2">{s.porGuardia ? "Por Guardia" : s.expediente}</td>
                                                            <td className="px-3 py-2">{s.prcc}</td>
                                                            <td className="px-3 py-2">{s.tipoExperticia}</td>
                                                            <td className="px-3 py-2">{s.numeroDictamen || "-"}</td>
                                                            <td className="px-3 py-2">{s.remitido || "-"}</td>
                                                            <td className="px-3 py-2">{s.porGuardia ? "Sí" : "No"}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </section>
                            </div>
                        ) : activeMenu === "Solicitudes" && activeSubmenu !== "" ? (
                            <section className="rounded-xl border border-white/40 bg-white p-4 shadow text-sm">
                                <h3 className="mb-3 text-base font-semibold text-slate-900">{tituloContenido}</h3>
                                {solicitudesFiltradas.length === 0 ? (
                                    <p className="text-sm text-slate-600">No hay solicitudes en esta categoría.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-800">
                                            <thead className="bg-slate-100">
                                                <tr>
                                                    <th className="px-3 py-2 text-left">N° Entrada</th>
                                                    <th className="px-3 py-2 text-left">Fecha Recepción</th>
                                                    <th className="px-3 py-2 text-left">Solicitante</th>
                                                    <th className="px-3 py-2 text-left">N° Solicitud</th>
                                                    <th className="px-3 py-2 text-left">Expediente</th>
                                                    <th className="px-3 py-2 text-left">PRCC</th>
                                                    <th className="px-3 py-2 text-left">Tipo Experticia</th>
                                                    <th className="px-3 py-2 text-left">N° Dictamen</th>
                                                    <th className="px-3 py-2 text-left">Remitido</th>
                                                    <th className="px-3 py-2 text-left">Por Guardia</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {solicitudesFiltradas.map((s) => (
                                                    <tr key={s.id}>
                                                        <td className="px-3 py-2 font-semibold">{s.numeroEntrada}</td>
                                                        <td className="px-3 py-2">{s.fechaRecepcion}</td>
                                                        <td className="px-3 py-2">{s.solicitante}</td>
                                                        <td className="px-3 py-2">{s.numeroSolicitud}</td>
                                                        <td className="px-3 py-2">{s.porGuardia ? "Por Guardia" : s.expediente}</td>
                                                        <td className="px-3 py-2">{s.prcc}</td>
                                                        <td className="px-3 py-2">{s.tipoExperticia}</td>
                                                        <td className="px-3 py-2">{s.numeroDictamen || "-"}</td>
                                                        <td className="px-3 py-2">{s.remitido || "-"}</td>
                                                        <td className="px-3 py-2">{s.porGuardia ? "Sí" : "No"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        ) : (
                            <p className="text-sm text-blue-100">Seleccione una opción del menú</p>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};
