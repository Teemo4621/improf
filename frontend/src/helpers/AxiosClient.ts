import axios, { AxiosError } from "axios";
import Cookies from "js-cookie"

const AxiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "content-type": "application/json" },
    timeout: 10 * 1000,
});

AxiosClient.interceptors.request.use(config => {
    const token = Cookies.get('auth.token') ?? null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

AxiosClient.interceptors.response.use(response => {
    if (response.config.url === "/auth/discord") {
        console.log(response.data);
        Cookies.set('auth.token', response.data.data.token);
        Cookies.set('auth.reftoken', response.data.data.refresh_token);
    }
    return response
}, async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && originalRequest.url !== "/auth/refresh_token") {
        try {
            const refresh_token = Cookies.get('auth.refresh_token') ?? null;
            const access_token = Cookies.get('auth.token') ?? null;

            if (!refresh_token || !access_token) {
                return Promise.reject(error);
            }

            const data = {
                "refresh_token": refresh_token
            };

            const res = await axios.post(import.meta.env.VITE_API_URL + "/auth/refresh_token", data);

            if (res.status === 200) {
                const newAccess_token = res.data.data.token;
                const newRefesh_token = res.data.data.refresh_token;
                Cookies.set('auth.token', newAccess_token);
                Cookies.set('auth.refresh_token', newRefesh_token);

                originalRequest.headers.Authorization = `Bearer ${newAccess_token}`;
                return AxiosClient(originalRequest);
            }
        } catch (err) {
            Cookies.remove('auth.token');
            Cookies.remove('auth.refresh_token');
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
})
export default AxiosClient