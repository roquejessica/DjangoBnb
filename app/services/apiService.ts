import { getAccessToken, getRefreshToken, handleJwtRefresh } from "../lib/actions";

const getTokenFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('session_access_token');
    }
    return null;
};

const apiService = {
    get: async function (url: string): Promise<any> {
        console.log('get', url);
        
        let token: string | null = getTokenFromLocalStorage();
        if (!token) {
            token = await getAccessToken() || null;
        }

        return new Promise((resolve, reject)=>{
            const headers: any = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`,{
                method: 'GET',
                headers: headers
            })
            .then(async response => {
                if (response.status === 401) {
                    console.log('401 detected, trying refresh');

                    try {
                        const refreshToken = await getRefreshToken();

                        if (refreshToken) {
                            const refreshUrl = `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/token/refresh/`;

                            const refreshResponse = await fetch(refreshUrl, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ refresh: refreshToken })
                            });

                            if (refreshResponse.ok) {
                                const data = await refreshResponse.json();
                                console.log('Refresh success');
                                await handleJwtRefresh(data.access, data.refresh || refreshToken);

                                // Update localStorage with new token
                                if (typeof window !== 'undefined') {
                                    localStorage.setItem('session_access_token', data.access);
                                    if (data.refresh) {
                                        localStorage.setItem('session_refresh_token', data.refresh);
                                    }
                                }

                                // Retry original request with new token
                                headers['Authorization'] = `Bearer ${data.access}`;
                                const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                                    method: 'GET',
                                    headers: headers
                                });

                                if (!retryResponse.ok) {
                                    throw new Error(`HTTP error! status: ${retryResponse.status}`);
                                }
                                return retryResponse.json();
                            }
                        }
                    } catch (refreshError) {
                        console.error('RefreshToken failed:', refreshError);
                    }
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((json) => {
                console.log('Response:', json);

                resolve(json);
            })
            .catch((error) => {
                console.error('API Error:', error);
                reject(error);
            })
        })
    },
    post: async function (url: string, data: any): Promise<any> {
        console.log('post', url, data);
        let token: string | null = getTokenFromLocalStorage();
        console.log('Token from localStorage:', token);
        if (!token) {
            console.log('No token in localStorage, trying getAccessToken');
            token = await getAccessToken() || null;
            console.log('Token from getAccessToken:', token);
        }

        return new Promise((resolve, reject)=>{
            const headers: any = {};

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            let body: any;

            // Check if data is FormData
            if (data instanceof FormData) {
                // Don't set Content-Type for FormData - let the browser handle it
                body = data;
            } else {
                // For regular JSON data
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify(data);
            }

            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`,{
                method: 'POST',
                headers: headers,
                body: body
            })
            .then(async response => {
                if (response.status === 401) {
                    console.log('401 detected, trying refresh');

                    try {
                        const refreshToken = await getRefreshToken();

                        if (refreshToken) {
                            const refreshUrl = `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/token/refresh/`;

                            const refreshResponse = await fetch(refreshUrl, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ refresh: refreshToken })
                            });

                            if (refreshResponse.ok) {
                                const data = await refreshResponse.json();
                                console.log('Refresh success');
                                await handleJwtRefresh(data.access, data.refresh || refreshToken);

                                // Update localStorage with new token
                                if (typeof window !== 'undefined') {
                                    localStorage.setItem('session_access_token', data.access);
                                    if (data.refresh) {
                                        localStorage.setItem('session_refresh_token', data.refresh);
                                    }
                                }

                                // Retry original request with new token
                                headers['Authorization'] = `Bearer ${data.access}`;
                                const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                                    method: 'POST',
                                    headers: headers,
                                    body: body
                                });

                                if (!retryResponse.ok) {
                                    throw new Error(`HTTP error! status: ${retryResponse.status}`);
                                }
                                return retryResponse.json();
                            }
                        }
                    } catch (refreshError) {
                        console.error('RefreshToken failed:', refreshError);
                    }
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((json) => {
                console.log('Response:', json);

                resolve(json);
            })
            .catch((error) => {
                console.error('API Error:', error);
                reject(error);
            })
        })
    },

    postWithoutToken: async function (url: string, data: any): Promise<any> {
        console.log('post', url, data);

        return new Promise((resolve, reject)=>{
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error('Error response data:', errorData);
                        throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
                    });
                }
                return response.json();
            })
            .then((json) => {
                console.log('Response:', json);

                resolve(json);
            })
            .catch((error) => {
                console.error('API Error:', error);
                reject(error);
            })
        })
    },

}

export default apiService;