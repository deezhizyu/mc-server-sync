import { push } from "@src/git.ts";

export function initializeHandlers() {
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
}
