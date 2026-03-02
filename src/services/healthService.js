const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://informaticabackend.onrender.com/api").replace(/\/+$/, "");

export const checkApiHealth = async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
        const error = new Error("API no disponible");
        error.status = response.status;
        throw error;
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        const json = await response.json();
        return {
            ok: Boolean(json?.ok ?? true),
            message: json?.message || "API disponible",
        };
    }

    const text = (await response.text()) || "API disponible";
    return { ok: true, message: text };
};
