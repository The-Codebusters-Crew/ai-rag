export const betterAuthSecret = process.env.BETTER_AUTH_SECRET || process.exit(1);

export const serverUrl = process.env.SERVER_URL || process.exit(1);

export const webClientUrl = process.env.WEB_CLIENT_URL ||  process.env.WEB_CLIENT_URL_2 || process.exit(1);