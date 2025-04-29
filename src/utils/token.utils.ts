export function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    );
    const expiry = decoded.exp * 1000; // Convert to milliseconds
    console.log('Token Expires At:', new Date(expiry).toISOString());

    return Date.now() >= expiry;
  } catch (e) {
    console.error('Failed to decode token:', e.message);
    return true; // treat as expired if decoding fails
  }
}
