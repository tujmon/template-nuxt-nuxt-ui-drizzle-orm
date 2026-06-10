export const getAuthTrustedOrigins = (authUrl: string) => [new URL(authUrl).origin]
