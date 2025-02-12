import { push } from "@src/git.ts";
import logger from "@src/logger.ts";

export function startServer() {
  logger.info("Starting server!");

  const command = new Deno.Command("java", {
    cwd: "server",
    args: [
      "-Xmx8192M",
      "--add-modules=jdk.incubator.vector",
      "-XX:+UseG1GC",
      "-XX:+ParallelRefProcEnabled",
      "-XX:MaxGCPauseMillis=200",
      "-XX:+UnlockExperimentalVMOptions",
      "-XX:+DisableExplicitGC",
      "-XX:+AlwaysPreTouch",
      "-XX:G1HeapWastePercent=5",
      "-XX:G1MixedGCCountTarget=4",
      "-XX:InitiatingHeapOccupancyPercent=15",
      "-XX:G1MixedGCLiveThresholdPercent=90",
      "-XX:G1RSetUpdatingPauseTimePercent=5",
      "-XX:SurvivorRatio=32",
      "-XX:+PerfDisableSharedMem",
      "-XX:MaxTenuringThreshold=1",
      "-Dusing.aikars.flags=https://mcflags.emc.gs",
      "-Daikars.new.flags=true",
      "-XX:G1NewSizePercent=30",
      "-XX:G1MaxNewSizePercent=40",
      "-XX:G1HeapRegionSize=8M",
      "-XX:G1ReservePercent=20",
      "-jar",
      "server.jar",
      "--nogui",
    ],
  });

  const serverProcess = command.spawn();

  serverProcess.status.then(async () => {
    let synced = false;

    while (!synced) {
      synced = await push();

      if (!synced) {
        logger.error("Error while syncing, trying again...");
      }
    }

    logger.info("Server was stopped");

    Deno.exit();
  });
}
