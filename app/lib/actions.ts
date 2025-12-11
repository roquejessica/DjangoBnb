'use server';

import { cookies } from 'next/headers';

export async function handleLogin(
    userId: string,
    accessToken: string,
    refreshToken: string
) {
    const cookieStore = await cookies();

    cookieStore.set('session_userid', userId, {
        httpOnly: false,
        secure: false,
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    });

    cookieStore.set('session_access_token', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60, // 60 minutes
        path: '/',
    });

    cookieStore.set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    });
}

export async function resetAuthCookies(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set('session_userid', '');
    cookieStore.set('session_access_token', '');
    cookieStore.set('session_refresh_token', '');
}

export async function getUserId() {
  const cookieStore = await cookies();

  const userIdCookie = await cookieStore.get('session_userid');

  const userId = userIdCookie?.value ?? null;
  return userId;
}

export async function getAccessToken() {
    let accessToken = (await cookies()).get('session_access_token')?.value;

    return accessToken;
}

export async function getConversations() {
    const accessToken = await getAccessToken();

    console.log('Access token:', accessToken);

    if (!accessToken) {
        console.log('No access token found');
        return null;
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/chat/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response:', errorText);
            return null;
        }

        const data = await response.json();
        console.log('Conversations data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return null;
    }
}