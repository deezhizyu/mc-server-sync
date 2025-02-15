import signEula from "@src/serverTools/signEula.ts";
import downloadServer from "@src/serverTools/downloadServer.ts";
import watchWorldSaves from "@src/serverTools/watchWorldSaves.ts";
import isFileExists from "@src/utils/isFileExists.ts";

import startServer from "@src/startServer.ts";
import initializeHandlers from "@src/utils/exitHandlers.ts";
import choicePrompt from "@src/utils/choicePrompt.ts";
import logger from "@src/logger.ts";
import config from "@src/config.ts";
import initializeGit from "@src/git/initializeGit.ts";

const gitignorePath = `${config.serverPath}/.gitignore`;
const worldPath = `${config.serverPath}/world`;
const replaceWorldPath = `${config.serverPath}/replaceworld`;
const serverJarPath = `${config.serverPath}/server.jar`;
const eulaPath = `${config.serverPath}/eula.txt`;

if (!isFileExists(gitignorePath)) {
  Deno.copyFileSync("server.gitignore", gitignorePath);
}

if (isFileExists(replaceWorldPath)) {
  logger.info(
    "Replacement world detected. Do you want to replace the current world?",
  );

  const choice = choicePrompt();

  if (choice) {
    Deno.removeSync(worldPath);

    Deno.renameSync(
      replaceWorldPath,
      worldPath,
    );

    logger.info(
      "World was replaced successfully",
    );
  }
}

if (!isFileExists(serverJarPath)) {
  await downloadServer(serverJarPath);
}

if (!isFileExists(eulaPath)) {
  await signEula(eulaPath);
}

await initializeGit();

startServer();
watchWorldSaves();
initializeHandlers();
