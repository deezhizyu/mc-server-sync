import { simpleGit, SimpleGitOptions } from "npm:simple-git";

import isFileExists from "@src/utils/isFileExists.ts";
import config from "@src/config.ts";
import logger from "@src/logger.ts";

if (!isFileExists(config.serverPath)) {
  Deno.mkdirSync(config.serverPath);
}

const options: Partial<SimpleGitOptions> = {
  baseDir: "server",
  trimmed: false,
};

if (Deno.build.os === "windows") {
  options.binary = config.windowsPortableGitPath;
}

logger.log("Initializing Git");
const gitClient = simpleGit(options);

export default gitClient;
