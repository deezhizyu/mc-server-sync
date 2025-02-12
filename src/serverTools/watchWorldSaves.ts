import { isFileExists } from "@src/utils/isFileExists.ts";
import { queuePush } from "@src/git.ts";
import logger from "@src/logger.ts";

export async function watchWorldSaves() {
  let levelExists = false;

  while (!levelExists) {
    levelExists = isFileExists("server/world/level.dat");

    if (!levelExists) {
      logger.info("Waiting for level.dat...");

      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  const watcher = Deno.watchFs("server/world/level.dat");

  for await (const _ of watcher) {
    queuePush(true);
  }
}
