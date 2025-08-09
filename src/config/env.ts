import "dotenv/config";

export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable ${key}`);
  }
  return value;
}

export const BOT_TOKEN = () => getEnv("BOT_TOKEN");
