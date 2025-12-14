'use server';

import { cookies } from 'next/headers';

export async function handleRefresh() {
    console.log('handleRefresh');

    const refreshToken = await getRefreshToken();

    const token = await fetch('http://localhost:8000/api/auth/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({
            refresh: refreshToken
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(async (json) => {
            console.log('Response - Refresh:', json);

            if (json.access) {
                const cookieStore = await cookies();
                cookieStore.set('session_access_token', json.access, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60, // 60 minutes
                    path: '/'
                });

                return json.access;
            } else {
                resetAuthCookies();
            }
        })
        .catch((error) => {
            console.log('error', error);

            resetAuthCookies();
        })

    return token;
}


export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    try {
        const cookieStore = await cookies();
        const cookieOptions = {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
            sameSite: 'lax' as const
        };

        cookieStore.set('session_userid', userId, cookieOptions);
        cookieStore.set('session_access_token', accessToken, cookieOptions);
        cookieStore.set('session_refresh_token', refreshToken, cookieOptions);
    } catch (error) {
        console.error('Error setting cookies:', error);
    }
}

export async function resetAuthCookies() {
    const cookieStore = await cookies();
    // Delete cookies by setting maxAge to 0
    cookieStore.set('session_userid', '', { maxAge: 0, path: '/' });
    cookieStore.set('session_access_token', '', { maxAge: 0, path: '/' });
    cookieStore.set('session_refresh_token', '', { maxAge: 0, path: '/' });
}

export async function getUserId() {
    if (typeof window === 'undefined') {
        // Server-side
        const cookieStore = await cookies();
        return cookieStore.get('session_userid')?.value || null;
    } else {
        // Client-side
        const value = document.cookie;
        const parts = value.split('; session_userid=');
        if (parts.length === 2) {
            const part = parts.pop();
            if (part) {
                return part.split(';').shift() || null;
            }
        }
        return null;
    }
}

export async function getAccessToken() {
    let accessToken = (await cookies()).get('session_access_token')?.value;

    if (!accessToken) {
        accessToken = await handleRefresh();
    }

    return accessToken;
}

export async function getRefreshToken() {
    let refreshToken = (await cookies()).get('session_refresh_token')?.value;

    return refreshToken;
}

export async function handleJwtRefresh(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();
    const cookieOptions = {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax' as const
    };

    cookieStore.set('session_access_token', accessToken, cookieOptions);
    cookieStore.set('session_refresh_token', refreshToken, cookieOptions);
}

export async function getConversations() {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return [];
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/chat/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch conversations:', response.status);
            return [];
        }

        const conversations = await response.json();
        return conversations;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }
}