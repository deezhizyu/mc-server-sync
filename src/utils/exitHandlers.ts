import push from "@src/git/push.ts";

function initializeHandlers() {
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

  if (Deno.build.os === "windows") {
    Deno.addSignalListener("SIGTERM", exitHandler);
  } else {
    Deno.addSignalListener("SIGBREAK", exitHandler);
  }
}

export default initializeHandlers;
