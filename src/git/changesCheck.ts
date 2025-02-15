import choicePrompt from "@src/utils/choicePrompt.ts";
import resetChanges from "@src/git/resetChanges.ts";
import push from "@src/git/push.ts";
import logger from "@src/logger.ts";
import gitClient from "@src/git/gitClient.ts";

const changesCheck = async () => {
  const status = await gitClient.status();

  if (status.files.length) {
    logger.info("You have unsynced changes in current server");
    logger.error("Delete changes?");

    const shouldDelete = choicePrompt();

    if (shouldDelete) {
      logger.info("Reverting changes...");
      await resetChanges();
    } else {
      logger.error("This overwrite changes in the repository");
      logger.info("Continue anyway?");

      const continueAnyway = choicePrompt();

      if (!continueAnyway) {
        Deno.exit();
      }

      const result = await push({ force: true });

      if (!result) {
        logger.error("Error while pushing changes, exiting...");

        Deno.exit();
      }
    }
  }
};

export default changesCheck;
