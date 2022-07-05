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
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [loading, setloading] = useState(true);

    const fetchData = () => {
        axios
            .request(configParams)
            .then((res) => {
                setResponse(res.data);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setloading(false);
            });
    };

    useEffect(() => {
        console.log('hello 3')
        fetchData();
    }, [configParams?.data]);

    // custom hook returns value
    return { response, error, loading };
};

export default useAxios;