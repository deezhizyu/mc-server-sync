import logger from "@src/logger.ts";
import { getRequiredEnv } from "@src/utils/getRequiredEnv.ts";

const SERVER_JAR_URL = getRequiredEnv("SERVER_JAR_URL");

export async function downloadServer(filename: string) {
  logger.log("Downloading server.jar...");

  const file = await Deno.open(filename, {
    create: true,
    write: true,
  });

  const request = await fetch(SERVER_JAR_URL);

  if (!request.body) {
    Deno.exit(1);
  }

  await request.body?.pipeTo(file.writable);
}
