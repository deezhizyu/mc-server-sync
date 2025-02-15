import {
  ResetMode,
  SimpleGit,
  simpleGit,
  SimpleGitOptions,
} from "npm:simple-git";

import { getFormattedDate } from "@src/utils/getFormattedDate.ts";
import { getRequiredEnv } from "@src/utils/getRequiredEnv.ts";
import { isFileExists } from "@src/utils/isFileExists.ts";
import { choicePrompt } from "@src/utils/choicePrompt.ts";
import logger from "@src/logger.ts";

const ACCESS_KEY = getRequiredEnv("ACCESS_KEY");

const REPO = getRequiredEnv("REPO");

if (!isFileExists("server")) {
  Deno.mkdirSync("server");
}

const options: Partial<SimpleGitOptions> = {
  baseDir: "server",
  trimmed: false,
};

if (Deno.build.os === "windows") {
  options.binary = "../portable_git/cmd/git.exe";
}

logger.log("Initializing Git");

export const git: SimpleGit = simpleGit(options);

let hasRepository = false;

try {
  hasRepository = !!(await git.getRemotes()).length;
} catch {
  hasRepository = false;
}

if (!hasRepository || !isFileExists("server/.git")) {
  logger.info("Initializing repository...");

  await git.init();
  await git.addConfig("user.email", `${Deno.env.get("USERNAME")}@ostapipi.pi`);
  await git.addConfig("user.name", `${Deno.env.get("USERNAME")}`);

  await git.addRemote("origin", `https://${ACCESS_KEY}@${REPO}`);
}

const status = await git.status();

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

logger.log("Fetching server...");

try {
  await git.pull("origin", "master");
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
  await git.pull("origin", "master");
}

async function resetChanges() {
  await git.checkout(".", ["-f"]);
  await git.reset(ResetMode.HARD, ["FETCH_HEAD"]);
}

let currentTimeout = -1;

export function queuePush(retry?: boolean) {
  clearTimeout(currentTimeout);

  currentTimeout = setTimeout(() => {
    push({ retry });
  }, 5000);
}

export async function push(options?: { retry?: boolean; force?: boolean }) {
  logger.info("\nSyncing server...");

  try {
    await git.add(".");
    await git.commit(
      `${options?.force ? "Override" : "Sync"} world ${getFormattedDate()}`,
    );
    await git.push("origin", "master", options?.force ? ["-f"] : []);

    return true;
  } catch {
    if (options?.retry) {
      logger.error("Error while syncing, trying again in 5 seconds");

      queuePush(true);
    }

    return false;
  }
}
