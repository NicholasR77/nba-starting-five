import { useEffect, useState } from "react";
import axios from 'axios';

interface ConfigParamsInterface {
    url?: string;
    method?: string;
    baseURL?: string;
    data?: any;
    headers?: any;
}

const useAxios = (configParams: ConfigParamsInterface) => {
    const [response, setResponse] = useState<any>(null);
    const [status, setStatus] = useState<null | number>(null);
    const [error, setError] = useState('');
    const [loading, setloading] = useState(true);

    const fetchData = () => {
        axios
            .request(configParams)
            .then((res) => {
                setStatus(res?.status);
                setResponse(res?.data);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setloading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [configParams?.data]);

    // custom hook returns value
    return { response, status, error, loading };
};

export default useAxios;