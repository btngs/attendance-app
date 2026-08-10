import axios from "axios";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

API.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
API.interceptors.response.use( 
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 && 
            !originalRequest._retry && 
            !originalRequest.url?.includes('/auth/refresh-token')
        ) {
            originalRequest._retry = true;

            try {
                const res = await API.post('/auth/refresh-token');

                const newAccessToken = res.data.accessToken;
                if (newAccessToken) {
                    localStorage.setItem('token', newAccessToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }
                    
                    return API(originalRequest);
                }
            } catch (refreshError) {
                console.error('Session expired or Refresh Token failed:', refreshError);
                
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/src/auth/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default API;