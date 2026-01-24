const mockRemisionesLaboratorio = [
    {
        id: "LAB-001",
        numeroRemision: "REM-LAB-2024-011",
        expediente: "EXP-CIM-2024-221",
        prcc: "PRCC-09-4421",
        fechaRemision: "2024-09-10",
        remitidoPor: "Inspector Jefe Carlos Rivas",
        recibidoPor: "Lic. Andrea Torres",
        descripcion: "Teléfono móvil REDMI M2003J15SS derivado para análisis físico.",
    },
    {
        id: "LAB-002",
        numeroRemision: "REM-LAB-2024-015",
        expediente: "EXP-CIM-2024-229",
        prcc: "PRCC-09-4433",
        fechaRemision: "2024-09-12",
        remitidoPor: "Inspector Sandra Villalobos",
        recibidoPor: "Ing. Carlos Meza",
        descripcion: "Disco duro externo Seagate 2TB derivado para extracción física.",
    },
];

export const fetchRemisionesLaboratorio = () =>
    new Promise((resolve) => {
        setTimeout(() => resolve(mockRemisionesLaboratorio), 500);
    });
