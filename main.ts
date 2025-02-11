import { downloadFile } from "@src/utils/downloadFile.ts";
import { watchWorldSaves } from "@src/utils/watchWorldSaves.ts";
import { signEula } from "@src/utils/signEula.ts";
import { startServer } from "./src/startServer.ts";
import { isFileExists } from "@src/utils/isFileExists.ts";

import { push } from "@src/git.ts";

const FABRIC_JAR_URL = Deno.env.get("FABRIC_JAR_URL");

if (!FABRIC_JAR_URL) {
  console.log("%c- No FABRIC_JAR_URL specified!", "color: red");

  Deno.exit();
}

if (!isFileExists("server/fabric.jar")) {
  console.log("- Downloading fabric.jar...");

  await downloadFile("server/fabric.jar", FABRIC_JAR_URL);
}

if (!isFileExists("server/eula.txt")) {
  console.log("- Signing EULA...");

  await signEula("server/eula.txt");
}

if (!isFileExists("server/.gitignore")) {
  Deno.copyFileSync("server.gitignore", "server/.gitignore");
}

// Start server
startServer();

// Watch world saves to sync
watchWorldSaves();

// Cleanup handler
let stopping = false;

function exitHandler() {
  if (stopping) {
    return;
  }

  stopping = true;

  setTimeout(async () => {
    await push();

    Deno.exit();
  }, 1500);
}

globalThis.addEventListener("unload", exitHandler);

Deno.addSignalListener("SIGINT", exitHandler);
Deno.addSignalListener("SIGBREAK", exitHandler);
