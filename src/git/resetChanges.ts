import { ResetMode } from "npm:simple-git";
import gitClient from "@src/git/gitClient.ts";

async function resetChanges() {
  await gitClient.checkout(".", ["-f"]);
  await gitClient.reset(ResetMode.HARD, ["FETCH_HEAD"]);
}

export default resetChanges;
