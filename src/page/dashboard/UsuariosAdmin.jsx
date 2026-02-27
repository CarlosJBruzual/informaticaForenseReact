import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Frame } from "../../components/ui/Frame";
import { SelectField } from "../../components/ui/SelectField";
import { Surface } from "../../components/ui/Surface";
import { TextInput } from "../../components/ui/TextInput";
import {
    USER_RANK_OPTIONS,
    USER_SYSTEM_ROLE_OPTIONS,
    buildDisplayName,
    buildSuggestedUsername,
    createUser,
    getCurrentSession,
    getUsers,
} from "../../services/userAuthService";

const initialForm = {
    rank: "Inspector Jefe",
    position: "Jefe de Oficina",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    systemRole: "funcionario",
};

export const UsuariosAdmin = ({ activePath }) => {
    const [session] = useState(() => getCurrentSession());
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [usernameTouched, setUsernameTouched] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    const suggestedUsername = useMemo(
        () =>
            buildSuggestedUsername({
                rank: form.rank,
                firstName: form.firstName,
                lastName: form.lastName,
            }),
        [form.rank, form.firstName, form.lastName],
    );

    useEffect(() => {
        if (usernameTouched) return;
        setForm((prev) => ({ ...prev, username: suggestedUsername }));
    }, [suggestedUsername, usernameTouched]);

    useEffect(() => {
        if (!session || session.systemRole !== "administrador") return;

        let isMounted = true;
        const loadUsers = async () => {
            setIsLoadingUsers(true);
            try {
                const data = await getUsers();
                if (!isMounted) return;
                setUsers(Array.isArray(data) ? data : []);
            } catch (loadError) {
                if (!isMounted) return;
                setError(loadError?.message || "No se pudieron cargar los usuarios.");
            } finally {
                if (isMounted) setIsLoadingUsers(false);
            }
        };

        loadUsers();

        return () => {
            isMounted = false;
        };
    }, [session]);

    const isAdmin = session?.systemRole === "administrador";

    const updateField = (key, value) => {
        setError("");
        setSuccess("");
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!form.rank || !form.position || !form.firstName || !form.lastName) {
            setError("Complete rango, posición, nombre y apellido.");
            return;
        }

        try {
            const result = await createUser(form);
            if (!result.ok) {
                setError(result.error);
                return;
            }

            const refreshedUsers = await getUsers();
            setUsers(Array.isArray(refreshedUsers) ? refreshedUsers : []);
            setSuccess(
                `Usuario creado: ${result.user.username} (${buildDisplayName(result.user)})`,
            );
            setForm({
                ...initialForm,
                rank: form.rank,
                position: form.position,
            });
            setUsernameTouched(false);
        } catch (submitError) {
            setError(submitError?.message || "No se pudo crear el usuario.");
        }
    };

    return (
        <DashboardLayout activePath={activePath}>
            {!isAdmin ? (
                <Surface variant="glass" className="p-6 text-white">
                    <h2 className="text-xl font-semibold">Administración de usuarios</h2>
                    <p className="mt-2 text-sm text-blue-100">
                        Solo el rol Administrador puede crear usuarios.
                    </p>
                </Surface>
            ) : (
                <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                    <Surface variant="glass" className="p-6 text-white">
                        <div className="mb-5">
                            <h2 className="text-xl font-semibold">Crear usuario</h2>
                            <p className="mt-1 text-sm text-blue-100">
                                Formulario separado para registrar usuario, contraseña, rango,
                                posición, nombre y apellido.
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <SelectField
                                    label="Rango"
                                    value={form.rank}
                                    options={USER_RANK_OPTIONS}
                                    variant="glass"
                                    labelTone="light"
                                    placeholder="Seleccione rango"
                                    onValueChange={(value) => updateField("rank", value)}
                                />
                                <TextInput
                                    label="Posición / Cargo"
                                    value={form.position}
                                    placeholder="Ej: Jefe de Oficina"
                                    variant="glass"
                                    labelTone="light"
                                    onValueChange={(value) => updateField("position", value)}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <TextInput
                                    label="Nombre"
                                    value={form.firstName}
                                    placeholder="Carlos"
                                    variant="glass"
                                    labelTone="light"
                                    onValueChange={(value) => updateField("firstName", value)}
                                />
                                <TextInput
                                    label="Apellido"
                                    value={form.lastName}
                                    placeholder="Bruzual"
                                    variant="glass"
                                    labelTone="light"
                                    onValueChange={(value) => updateField("lastName", value)}
                                />
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                <p className="text-xs uppercase tracking-wide text-blue-200">
                                    Vista previa
                                </p>
                                <p className="mt-1 text-sm font-semibold text-white">
                                    {buildDisplayName(form) || "Sin datos"}
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <TextInput
                                    label="Usuario"
                                    value={form.username}
                                    placeholder="Carlos.Bruzual"
                                    variant="glass"
                                    labelTone="light"
                                    onValueChange={(value) => {
                                        setUsernameTouched(true);
                                        updateField("username", value);
                                    }}
                                />
                                <TextInput
                                    label="Contraseña"
                                    value={form.password}
                                    placeholder="Ingrese contraseña"
                                    type="password"
                                    variant="glass"
                                    labelTone="light"
                                    onValueChange={(value) => updateField("password", value)}
                                />
                            </div>

                            <SelectField
                                label="Rol del sistema"
                                value={form.systemRole}
                                options={USER_SYSTEM_ROLE_OPTIONS}
                                variant="glass"
                                labelTone="light"
                                placeholder="Seleccione rol"
                                onValueChange={(value) => updateField("systemRole", value)}
                            />

                            {error ? (
                                <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                                    {error}
                                </p>
                            ) : null}
                            {success ? (
                                <p className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                                    {success}
                                </p>
                            ) : null}

                            <div className="flex flex-wrap gap-3">
                                <Frame className="px-6" type="submit">
                                    Crear usuario
                                </Frame>
                                <Frame
                                    variant="ghost"
                                    className="px-6"
                                    type="button"
                                    onClick={() => {
                                        setForm(initialForm);
                                        setError("");
                                        setSuccess("");
                                        setUsernameTouched(false);
                                    }}
                                >
                                    Limpiar
                                </Frame>
                            </div>
                        </form>
                    </Surface>

                    <Surface variant="glass" className="p-6 text-white">
                        <h3 className="text-lg font-semibold">Usuarios registrados</h3>
                        <p className="mt-1 text-sm text-blue-100">
                            Credencial inicial administrador: `admin` / `Admin123`
                        </p>
                        <div className="mt-4 space-y-3">
                            {isLoadingUsers ? (
                                <p className="text-sm text-blue-100">Cargando usuarios...</p>
                            ) : null}
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="rounded-xl border border-white/10 bg-white/5 p-3"
                                >
                                    <p className="text-sm font-semibold text-white">
                                        {buildDisplayName(user) || user.username}
                                    </p>
                                    <p className="text-xs text-blue-100">
                                        {user.position || "Sin posición"} · {user.systemRole}
                                    </p>
                                    <p className="mt-1 text-xs text-blue-200">
                                        Usuario: {user.username}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Surface>
                </div>
            )}
        </DashboardLayout>
    );
};
