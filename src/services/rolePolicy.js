import { FIELD_KEYS } from "./solicitudSchema";

export const ROLE_KEYS = {
    funcionario: "funcionario",
    jefe: "jefe",
    direccion: "direccion",
};

export const ROLE_OPTIONS = [
    { value: ROLE_KEYS.funcionario, label: "Funcionario" },
    { value: ROLE_KEYS.jefe, label: "Jefe de Oficina" },
    { value: ROLE_KEYS.direccion, label: "Direccion" },
];

const funcionarioEditableFields = [
    "numeroEntrada",
    "fechaRecepcion",
    "solicitante",
    "numeroSolicitud",
    "fechaSolicitud",
    "expediente",
    "prcc",
    "descripcionEvidencia",
    "evidenciaMarcaModelo",
    "evidenciaColorOtra",
    "tipoExperticia",
    "porGuardia",
];

export const ROLE_POLICIES = {
    [ROLE_KEYS.funcionario]: {
        label: "Funcionario",
        modeLabel: "Edicion",
        canSubmit: true,
        editableFields: funcionarioEditableFields,
        readOnly: false,
    },
    [ROLE_KEYS.jefe]: {
        label: "Jefe de Oficina",
        modeLabel: "Edicion",
        canSubmit: true,
        editableFields: FIELD_KEYS,
        readOnly: false,
    },
    [ROLE_KEYS.direccion]: {
        label: "Direccion",
        modeLabel: "Solo lectura",
        canSubmit: false,
        editableFields: [],
        readOnly: true,
    },
};

export const getRolePolicy = (roleKey) =>
    ROLE_POLICIES[roleKey] ?? ROLE_POLICIES[ROLE_KEYS.funcionario];
