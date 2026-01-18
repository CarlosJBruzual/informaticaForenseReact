import { useEffect, useMemo, useState } from "react";
import { getRolePolicy, ROLE_KEYS, ROLE_OPTIONS } from "../services/rolePolicy";

const STORAGE_KEY = "solicitudes.role";

const getStoredRole = (fallback) => {
    if (typeof window === "undefined") return fallback;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored || fallback;
};

export const useRoleAccess = (defaultRole = ROLE_KEYS.funcionario) => {
    const [role, setRole] = useState(() => getStoredRole(defaultRole));

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(STORAGE_KEY, role);
    }, [role]);

    const policy = useMemo(() => getRolePolicy(role), [role]);
    const editableFields = useMemo(() => new Set(policy.editableFields), [policy.editableFields]);

    const canEditField = (fieldKey) => editableFields.has(fieldKey);
    const isReadOnly = policy.readOnly;

    return {
        role,
        setRole,
        roleOptions: ROLE_OPTIONS,
        policy,
        canEditField,
        isReadOnly,
    };
};
