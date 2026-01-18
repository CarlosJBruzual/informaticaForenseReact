export const initialSolicitudState = {
    numeroEntrada: "",
    fechaRecepcion: "",
    solicitante: "",
    numeroSolicitud: "",
    fechaSolicitud: "",
    expediente: "",
    prcc: "",
    descripcionEvidencia: "",
    evidenciaMarcaModelo: "",
    evidenciaColorOtra: "",
    tipoExperticia: "",
    porGuardia: false,
};

export const FIELD_KEYS = Object.keys(initialSolicitudState);

export const REQUIRED_FIELDS = [
    "numeroEntrada",
    "fechaRecepcion",
    "solicitante",
    "numeroSolicitud",
    "fechaSolicitud",
    "prcc",
];
