import { Frame } from "../ui/Frame";
import { Surface } from "../ui/Surface";

const DetailItem = ({ label, value }) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-blue-100">{label}</span>
        <span className="text-sm text-white">{value || "-"}</span>
    </div>
);

export const SolicitudDetailsModal = ({ solicitud, onClose }) => {
    if (!solicitud) return null;

    const expedienteValue = solicitud.porGuardia
        ? "Por Guardia"
        : solicitud.expediente || "-";
    const descripcionValue = solicitud.descripcionEvidencia || "No aplica";
    const marcaModeloValue = solicitud.evidenciaMarcaModelo || "No aplica";
    const colorOtraValue = solicitud.evidenciaColorOtra || "No aplica";

    const evidencias = Array.isArray(solicitud.evidencias) && solicitud.evidencias.length
        ? solicitud.evidencias
        : [
              {
                  id: "principal",
                  tipo: "Principal",
                  descripcion: descripcionValue,
                  marcaModelo: marcaModeloValue,
                  color: colorOtraValue,
              },
          ];


    return (
        <Surface
            variant="glass"
            className="w-full max-w-5xl max-h-[calc(100vh-6rem)] overflow-y-auto p-6 text-white"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white">Detalle de Solicitud</h3>
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

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailItem label="N° de Entrada" value={solicitud.numeroEntrada} />
                <DetailItem label="Fecha de Recepción" value={solicitud.fechaRecepcion} />
                <DetailItem label="Solicitante" value={solicitud.solicitante} />
                <DetailItem label="N° de Solicitud" value={solicitud.numeroSolicitud} />
                <DetailItem label="Fecha de Solicitud" value={solicitud.fechaSolicitud} />
                <DetailItem label="Expediente o Causa Penal" value={expedienteValue} />
                <DetailItem label="PRCC" value={solicitud.prcc} />
                <DetailItem label="PRCC 2" value={solicitud.prcc2 || "-"} />
                <DetailItem label="Tipo de Experticia" value={solicitud.tipoExperticia} />
                <DetailItem label="Por Guardia" value={solicitud.porGuardia ? "Sí" : "No"} />
            </div>

            <div className="mt-6">
                <h4 className="text-sm font-semibold text-white">Descripción de Evidencia</h4>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <DetailItem label="Descripción" value={descripcionValue} />
                    <DetailItem label="Marca y modelo" value={marcaModeloValue} />
                    <DetailItem label="Color y otra información" value={colorOtraValue} />
                </div>
            </div>

            <div className="mt-6 space-y-3">
                <h4 className="text-sm font-semibold text-white">Evidencias registradas</h4>
                <div className="space-y-2">
                    {evidencias.map((item) => {
                        const marcaModelo =
                            [item.marca, item.modelo].filter(Boolean).join(" ") || item.marcaModelo;
                        return (
                            <div
                                key={item.id}
                                className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 p-3"
                            >
                                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-indigo-200">
                                    <span>{item.tipo || "Evidencia"}</span>
                                    {item.rrss ? <span className="text-[11px] text-blue-100">RRSS/Web</span> : null}
                                </div>
                                <span className="text-sm text-white">{item.descripcion || "Sin descripción"}</span>
                                {marcaModelo ? (
                                    <span className="text-xs text-blue-100">{marcaModelo}</span>
                                ) : null}
                                {item.color ? (
                                    <span className="text-xs text-blue-200">Color: {item.color}</span>
                                ) : null}
                                {item.imei || item.meid ? (
                                    <span className="text-xs text-blue-200">
                                        IMEI/MEID: {item.imei || item.meid}
                                    </span>
                                ) : null}
                                {item.numeroSerie ? (
                                    <span className="text-xs text-blue-200">Serie: {item.numeroSerie}</span>
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
                        );
                    })}
                </div>
            </div>

            <div className="mt-6">
                <h4 className="text-sm font-semibold text-white">Remisión de Evidencia</h4>
                {solicitud.remision ? (
                    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <DetailItem
                            label="Fecha de Remisión"
                            value={solicitud.remision.fechaRemision}
                        />
                        <DetailItem
                            label="N° de Dictamen"
                            value={solicitud.remision.numeroDictamen}
                        />
                        <DetailItem
                            label="Funcionario que recibe"
                            value={solicitud.remision.funcionarioRecibe}
                        />
                        <DetailItem
                            label="Funcionario que entregó"
                            value={solicitud.remision.funcionarioEntrega}
                        />
                    </div>
                ) : (
                    <p className="mt-2 text-sm text-blue-100">Sin remisión registrada.</p>
                )}
            </div>

        </Surface>
    );
};
