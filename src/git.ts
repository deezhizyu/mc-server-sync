import {
  simpleGit,
  SimpleGit,
  SimpleGitOptions,
  ResetMode,
} from "npm:simple-git";

import { getFormattedDate } from "@src/utils/getFormattedDate.ts";
import { yesNoPrompt } from "@src/utils/yesNoPrompts.ts";
import { isFileExists } from "@src/utils/isFileExists.ts";

const ACCESS_KEY = Deno.env.get("ACCESS_KEY");

if (!ACCESS_KEY) {
  console.log("%c- No ACCESS_KEY specified!", "color: red");

  Deno.exit();
}

const REPO = Deno.env.get("REPO");

if (!REPO) {
  console.log("%c- No REPO specified!", "color: red");

  Deno.exit();
}

if (!isFileExists("server")) {
  Deno.mkdirSync("server");
}

const options: Partial<SimpleGitOptions> = {
  baseDir: "server",
  binary: "../portable_git/cmd/git.exe",
  trimmed: false,
};

console.log("- Initializing Git");
export const git: SimpleGit = simpleGit(options);

let hasRepository = false;

try {
  hasRepository = !!(await git.getRemotes()).length;
} catch {
  hasRepository = false;
}

if (!hasRepository) {
  console.log("- Initializing repository...");
  await git.init();
  await git.addConfig("user.email", `${Deno.env.get("USERNAME")}@ostapipi.pi`);
  await git.addConfig("user.name", `${Deno.env.get("USERNAME")}`);

  await git.addRemote("origin", `https://${ACCESS_KEY}@${REPO}`);
}

const status = await git.status();

if (status.files.length) {
  console.log("%cYou have unsynced changes in current server", "color: yellow");
  console.log("%cOverride current changes?", "color: red; font-weight: bold");

  const yes = yesNoPrompt();

  if (!yes) {
    Deno.exit();
  }

  console.log("- Overriding changes...");
  await resetChanges();
}

console.log("- Fetching server...");

try {
  await git.pull("origin", "master");
} catch {
  console.log("%cError while pulling", "color: yellow");
  console.log("%cTry to remove all changes?", "color: red; font-weight: bold");

  const yes = yesNoPrompt();

  if (!yes) {
    Deno.exit();
  }

  console.log("- Removing changes...");
  await resetChanges();

  console.log("- Fetching again...");
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
    push(retry);
  }, 5000);
}

export async function push(retry?: boolean) {
  console.log("\n- Syncing server...");

  try {
    await git.add(".");
    await git.commit(`Sync world ${getFormattedDate()}`);
    await git.push("origin", "master");
  } catch {
    if (!retry) {
      return;
    }

    console.log("%c- Error syncing, tring again in 5 seconds", "color: red");
    queuePush(true);
  }
}
