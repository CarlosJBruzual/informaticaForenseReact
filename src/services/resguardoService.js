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
        const error = new Error(data?.message || "Error en la solicitud");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

export const fetchRemisionesResguardo = async (filters = {}) => {
    const qs = buildQueryString(filters);
    return apiRequest(`/resguardo${qs}`);
};

export const createRemisionResguardo = async (payload) => {
    const data = await apiRequest("/resguardo", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return { ok: true, remision: data };
};

export const getRemisionResguardoById = async (id) => {
    if (!id) throw new Error("ID requerido");
    return apiRequest(`/resguardo/${id}`);
};

export const updateRemisionResguardo = async (id, payload) => {
    if (!id) throw new Error("ID requerido");
    const data = await apiRequest(`/resguardo/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    return { ok: true, remision: data };
};

export const deleteRemisionResguardo = async (id) => {
    if (!id) throw new Error("ID requerido");
    await apiRequest(`/resguardo/${id}`, { method: "DELETE" });
    return { ok: true };
};

// Alias legible
export const listResguardo = fetchRemisionesResguardo;
