const mockRemisionesResguardo = [
    {
        id: "RSG-001",
        numeroMemo: "MEM-2024-018",
        expediente: "EXP-CIM-2024-221",
        prcc: "PRCC-09-4421",
        fechaRecepcion: "2024-09-07",
        recibidoPor: "Of. María Duarte",
        descripcion: "Teléfono móvil REDMI M2003J15SS con chip Digitel.",
    },
    {
        id: "RSG-002",
        numeroMemo: "MEM-2024-024",
        expediente: "EXP-CIM-2024-229",
        prcc: "PRCC-09-4433",
        fechaRecepcion: "2024-09-09",
        recibidoPor: "Tec. Javier Mora",
        descripcion: "Disco duro externo Seagate 2TB.",
    },
];

export const fetchRemisionesResguardo = () =>
    new Promise((resolve) => {
        setTimeout(() => resolve(mockRemisionesResguardo), 500);
    });
