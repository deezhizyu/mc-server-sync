import isFileExists from "@src/utils/isFileExists.ts";
import sleep from "@src/utils/sleep.ts";
import logger from "@src/logger.ts";
import queuePush from "@src/git/queuePush.ts";

async function watchWorldSaves() {
  let levelExists = false;

  while (!levelExists) {
    levelExists = isFileExists("server/world/level.dat");

    if (!levelExists) {
      logger.info("Waiting for level.dat...");

      await sleep(5000);
    }
  }

  const watcher = Deno.watchFs("server/world/level.dat");

  for await (const _ of watcher) {
    queuePush(true);
  }
}

export default watchWorldSaves;
