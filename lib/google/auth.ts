import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = typeof window !== 'undefined' 
  ? `${window.location.origin}/auth/callback` 
  : process.env.NEXT_PUBLIC_SITE_URL + '/auth/callback';

export const getGoogleOAuth2Client = (accessToken?: string, refreshToken?: string) => {
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  if (accessToken || refreshToken) {
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  return oauth2Client;
};

export const refreshGoogleAccessToken = async (refreshToken: string) => {
  const oauth2Client = getGoogleOAuth2Client(undefined, refreshToken);
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    return credentials.access_token;
  } catch (error) {
    console.error('Error refreshing Google access token:', error);
    throw error;
  }
};
