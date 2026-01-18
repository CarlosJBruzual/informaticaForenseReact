import { useEffect, useState } from "react";
import { fetchSolicitudes } from "../services/solicitudesService";

export const useSolicitudes = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isActive = true;

        fetchSolicitudes()
            .then((items) => {
                if (!isActive) return;
                setData(items);
                setIsLoading(false);
            })
            .catch((err) => {
                if (!isActive) return;
                setError(err);
                setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, []);

    return { data, isLoading, error };
};
