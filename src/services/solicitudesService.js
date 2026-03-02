const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://informaticabackend.onrender.com/api").replace(
    /\/+$/,
    "",
);

const buildQueryString = (params = {}) => {
    const entries = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    return entries.length ? `?${entries.join("&")}` : "";
};

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        if (response.status === 404) {
            const error = new Error("No encontrado");
            error.status = 404;
            error.data = data;
            throw error;
        }
        const error = new Error(data?.message || "Error en la solicitud");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

export const fetchSolicitudes = async (filters = {}) => {
    const qs = buildQueryString(filters);
    return apiRequest(`/solicitudes${qs}`);
};

export const createSolicitud = async (payload) => {
    const data = await apiRequest("/solicitudes", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return { ok: true, solicitud: data };
};

export const getSolicitudById = async (id) => {
    if (!id) throw new Error("ID requerido");
    return apiRequest(`/solicitudes/${id}`);
};

export const updateSolicitud = async (id, payload) => {
    if (!id) throw new Error("ID requerido");
    const data = await apiRequest(`/solicitudes/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    return { ok: true, solicitud: data };
};

export const deleteSolicitud = async (id) => {
    if (!id) throw new Error("ID requerido");
    await apiRequest(`/solicitudes/${id}`, { method: "DELETE" });
    return { ok: true };
};

export const updateSolicitudGuardia = async (id, payload) => {
    if (!id) throw new Error("ID requerido");
    const data = await apiRequest(`/solicitudes/${id}/guardia`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
    return { ok: true, solicitud: data };
};

export const updateSolicitudRemision = async (id, payload) => {
    if (!id) throw new Error("ID requerido");
    const data = await apiRequest(`/solicitudes/${id}/remision`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
    return { ok: true, solicitud: data };
};

export const fetchEvidenciasByExpediente = async (expediente) => {
    if (!expediente) return null;
    try {
        return await apiRequest(`/solicitudes/by-expediente/${encodeURIComponent(expediente)}`);
    } catch (error) {
        if (error.status === 404) return null;
        throw error;
    }
};

// Alias legible para compatibilidad
export const listSolicitudes = fetchSolicitudes;
