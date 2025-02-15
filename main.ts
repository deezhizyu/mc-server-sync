import { signEula } from "@src/serverTools/signEula.ts";
import { downloadServer } from "@src/serverTools/downloadServer.ts";
import { watchWorldSaves } from "@src/serverTools/watchWorldSaves.ts";
import { isFileExists } from "@src/utils/isFileExists.ts";

import { startServer } from "@src/startServer.ts";
import { initializeHandlers } from "@src/utils/exitHandlers.ts";
import { choicePrompt } from "@src/utils/choicePrompt.ts";
import logger from "@src/logger.ts";

if (!isFileExists("server/.gitignore")) {
  Deno.copyFileSync("server.gitignore", "server/.gitignore");
}

if (isFileExists("server/replaceworld")) {
  logger.info(
    "Replacement world detected. Do you want to replace the current world?",
  );

  const choice = choicePrompt();

  if (choice) {
    Deno.removeSync("server/world");

    Deno.renameSync("server/replaceworld", "server/world");

    logger.info(
      "World was replaced successfully",
    );
  }
}

if (!isFileExists("server/server.jar")) {
  await downloadServer("server/server.jar");
}

if (!isFileExists("server/eula.txt")) {
  await signEula("server/eula.txt");
}

startServer();

watchWorldSaves();

initializeHandlers();
