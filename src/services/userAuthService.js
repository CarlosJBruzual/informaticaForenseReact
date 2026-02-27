const SESSION_STORAGE_KEY = "informatica.session";
const ROLE_STORAGE_KEY = "solicitudes.role";
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(
    /\/+$/,
    "",
);

const normalize = (value) =>
    String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

const slugToken = (value) =>
    normalize(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "")
        .trim();

const safeParse = (value, fallback) => {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

export const USER_SYSTEM_ROLE_OPTIONS = [
    { value: "administrador", label: "Administrador" },
    { value: "jefe", label: "Jefe de Oficina" },
    { value: "funcionario", label: "Funcionario" },
    { value: "direccion", label: "Direccion" },
];

export const USER_RANK_OPTIONS = [
    "Tecnico",
    "Inspector",
    "Inspector Jefe",
    "Jefe",
];

export const ensureUserSeed = () => {
    // Compatibilidad temporal: antes se sembraba en localStorage.
    // Ahora el seed se maneja en backend al iniciar el servidor.
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

export const getUsers = async () => {
    return apiRequest("/users");
};

export const getCurrentSession = () => {
    if (typeof window === "undefined") return null;
    const session = safeParse(window.localStorage.getItem(SESSION_STORAGE_KEY), null);
    if (!session) return null;

    if (
        session.username === "admin" &&
        session.firstName === "Leandry" &&
        session.lastName === "Rivas"
    ) {
        const migrated = {
            ...session,
            firstName: "Carlos",
            lastName: "Bruzual",
            rank: session.rank || "Inspector Jefe",
            position: session.position || "Jefe de Oficina",
        };
        window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
    }

    return session;
};

export const setCurrentSession = (user) => {
    if (typeof window === "undefined") return;

    const session = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        rank: user.rank,
        position: user.position,
        systemRole: user.systemRole,
    };

    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    window.localStorage.setItem(ROLE_STORAGE_KEY, user.systemRole || "funcionario");
};

export const clearCurrentSession = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
};

export const authenticateUser = async ({ username, password }) => {
    const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
            username: normalize(username).toLowerCase(),
            password: String(password ?? ""),
        }),
    });

    return data?.user ?? null;
};

export const buildSuggestedUsername = ({ rank, firstName, lastName }) => {
    const rankToken = slugToken(rank).slice(0, 4);
    const firstToken = slugToken(firstName);
    const lastToken = slugToken(lastName);
    if (!firstToken || !lastToken) return "";

    return [rankToken, firstToken, lastToken].filter(Boolean).join(".");
};

export const buildDisplayName = ({ rank, firstName, lastName }) =>
    [normalize(rank), normalize(firstName), normalize(lastName)].filter(Boolean).join(" ");

export const createUser = async (payload) => {
    const data = await apiRequest("/users", {
        method: "POST",
        body: JSON.stringify({
            username: normalize(payload.username).toLowerCase(),
            password: String(payload.password ?? ""),
            firstName: normalize(payload.firstName),
            lastName: normalize(payload.lastName),
            rank: normalize(payload.rank),
            position: normalize(payload.position),
            systemRole: normalize(payload.systemRole).toLowerCase() || "funcionario",
        }),
    });

    return { ok: true, user: data };
};
