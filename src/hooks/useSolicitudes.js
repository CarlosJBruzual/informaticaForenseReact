import { useEffect, useState } from "react";
import { fetchSolicitudes } from "../services/solicitudesService";

export const useSolicitudes = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const items = await fetchSolicitudes();
            setData(Array.isArray(items) ? items : []);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return { data, isLoading, error, refetch: load };
};
