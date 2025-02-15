import getFormattedDate from "@src/utils/getFormattedDate.ts";
import gitClient from "@src/git/gitClient.ts";
import queuePush from "@src/git/queuePush.ts";
import logger from "@src/logger.ts";

async function push(options?: { retry?: boolean; force?: boolean }) {
  logger.info("Syncing server...");

  try {
    await gitClient.add(".");
    await gitClient.commit(
      `${options?.force ? "Override" : "Sync"} world ${getFormattedDate()}`,
    );
    await gitClient.push("origin", "master", options?.force ? ["-f"] : []);

    return true;
  } catch {
    if (options?.retry) {
      logger.error("Error while syncing, trying again in 5 seconds");

      queuePush(true);
    }

    return false;
  }
}

export default push;
