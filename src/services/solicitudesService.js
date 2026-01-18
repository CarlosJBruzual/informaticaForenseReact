const mockSolicitudes = [
    {
        id: "SOL-2024-087",
        numeroEntrada: "ENT-2024-118",
        fechaRecepcion: "2024-09-04",
        solicitante: "Inspector Jefe Carlos Rivas",
        numeroSolicitud: "SOL-2024-087",
        fechaSolicitud: "2024-09-03",
        expediente: "EXP-CIM-2024-221",
        prcc: "PRCC-09-4421",
        descripcionEvidencia: "Un (01) teléfono móvil celular.",
        evidenciaMarcaModelo: "REDMI M2003J15SS",
        evidenciaColorOtra:
            "Color celeste y morado. IMEI 865296050284833 e IMEI 2 865296051804837. Chip Digitel serial 895802191017015789.",
        tipoExperticia: "Informatica",
        porGuardia: false,
        remision: {
            fechaRemision: "2024-09-07",
            numeroDictamen: "DICT-2024-038",
            funcionarioRecibe: "Perito Luis Ortega",
            funcionarioEntrega: "Inspector Jefe Carlos Rivas",
        },
    },
    {
        id: "SOL-2024-091",
        numeroEntrada: "ENT-2024-119",
        fechaRecepcion: "2024-09-05",
        solicitante: "Detective Lourdes Paredes",
        numeroSolicitud: "SOL-2024-091",
        fechaSolicitud: "2024-09-05",
        expediente: "",
        prcc: "PRCC-09-4427",
        descripcionEvidencia: "Teléfono móvil.",
        evidenciaMarcaModelo: "Samsung A53",
        evidenciaColorOtra: "IMEI 356783109998221. No aplica.",
        tipoExperticia: "Telefonia",
        porGuardia: true,
    },
    {
        id: "SOL-2024-096",
        numeroEntrada: "ENT-2024-122",
        fechaRecepcion: "2024-09-06",
        solicitante: "Inspector Sandra Villalobos",
        numeroSolicitud: "SOL-2024-096",
        fechaSolicitud: "2024-09-06",
        expediente: "EXP-CIM-2024-229",
        prcc: "PRCC-09-4433",
        descripcionEvidencia: "Disco duro externo.",
        evidenciaMarcaModelo: "Seagate 2TB",
        evidenciaColorOtra: "No aplica.",
        tipoExperticia: "Video",
        porGuardia: false,
        remision: {
            fechaRemision: "2024-09-08",
            numeroDictamen: "DICT-2024-041",
            funcionarioRecibe: "Perito Natalia Rojas",
            funcionarioEntrega: "Inspector Sandra Villalobos",
        },
    },
];

export const fetchSolicitudes = () =>
    new Promise((resolve) => {
        setTimeout(() => resolve(mockSolicitudes), 800);
    });
