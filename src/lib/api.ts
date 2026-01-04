// Use environment variable, otherwise detect current protocol and host for mobile/production
const getBaseApiUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    if (typeof window !== 'undefined') {
        const protocol = window.location.protocol; // http: or https:
        const hostname = window.location.hostname;

        // In production (limitscope.xyz), usually we don't use port 5000 in the URL
        if (hostname.includes('limitscope.xyz')) {
            return `${protocol}//${hostname}/api`;
        }

        // Use same protocol as frontend for consistency in dev
        return `${protocol}//${hostname}:5000/api`;
    }

    return 'http://localhost:5000/api';
};

const API_URL = getBaseApiUrl();

export const getApiUrl = () => API_URL;

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_URL}${endpoint}`;

    // Ensure credentials are included for cookies
    const defaultOptions: RequestInit = {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || 'An error occurred');
        (error as any).status = response.status;
        throw error;
    }

    return response.json();
};
