import choicePrompt from "@src/utils/choicePrompt.ts";
import resetChanges from "@src/git/resetChanges.ts";
import logger from "@src/logger.ts";
import gitClient from "@src/git/gitClient.ts";

const fetchServer = async () => {
  logger.log("Fetching server...");

  try {
    await gitClient.pull("origin", "master");
  } catch {
    logger.error("Error while pulling");
    logger.info("Try to remove all changes?");

    const yes = choicePrompt();

    if (!yes) {
      Deno.exit();
    }

    logger.info("Removing changes...");
    await resetChanges();

    logger.info("Fetching again...");
    await gitClient.pull("origin", "master");
  }
};

export default fetchServer;
