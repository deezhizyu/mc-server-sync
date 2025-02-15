import isFileExists from "@src/utils/isFileExists.ts";
import config from "@src/config.ts";
import logger from "@src/logger.ts";
import gitClient from "@src/git/gitClient.ts";

const initializeRepo = async () => {
  let hasRepository = false;

  try {
    hasRepository = !!(await gitClient.getRemotes()).length;
  } catch {
    hasRepository = false;
  }

  if (!hasRepository || !isFileExists("server/.git")) {
    logger.info("Initializing repository...");

    await gitClient.init();
    await gitClient.addConfig(
      "user.email",
      `${Deno.env.get("USERNAME")}@ostapipi.pi`,
    );
    await gitClient.addConfig("user.name", `${Deno.env.get("USERNAME")}`);

    await gitClient.addRemote(
      "origin",
      `https://${config.accessKey}@${config.repo}`,
    );
  }
};

export default initializeRepo;
