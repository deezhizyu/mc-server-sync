import logger from "@src/logger.ts";

export function getRequiredEnv(key: string): string {
  const value = Deno.env.get(key);

  if (!value) {
    logger.error(`No ${key} specified in environment!`);

    Deno.exit();
  }

  return value;
}
