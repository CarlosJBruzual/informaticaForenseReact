const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://informaticabackend.onrender.com/api").replace(/\/+$/, "");

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": options.body instanceof FormData ? undefined : "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        const error = new Error(data?.message || "Error en la solicitud");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

async function downloadCsv(path, filename) {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
        const error = new Error("No se pudo descargar el archivo");
        error.status = response.status;
        throw error;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    return { ok: true };
}

export const getDashboardMetrics = async () => {
    return apiRequest("/dashboard/metrics");
};

export const exportDashboardMetricsCsv = async () => {
    return downloadCsv("/dashboard/export/metrics.csv", "metrics.csv");
};

export const exportFuncionariosCsv = async () => {
    return downloadCsv("/dashboard/export/funcionarios.csv", "funcionarios.csv");
};
