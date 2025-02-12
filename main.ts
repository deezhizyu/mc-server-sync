import { signEula } from "./src/serverTools/signEula.ts";
import { downloadFabric } from "./src/serverTools/downloadFabric.ts";
import { watchWorldSaves } from "./src/serverTools/watchWorldSaves.ts";
import { isFileExists } from "@src/utils/isFileExists.ts";

import { startServer } from "@src/startServer.ts";
import { initializeHandlers } from "@src/utils/exitHandlers.ts";

if (!isFileExists("server/.gitignore")) {
  Deno.copyFileSync("server.gitignore", "server/.gitignore");
}

if (!isFileExists("server/fabric.jar")) {
  await downloadFabric("server/server.jar");
}

if (!isFileExists("server/eula.txt")) {
  await signEula("server/eula.txt");
}

startServer();

watchWorldSaves();

initializeHandlers();
