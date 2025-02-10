import { queuePush } from "@src/git.ts";

export async function watchWorldSaves() {
  const watcher = Deno.watchFs("server/world/level.dat");

  for await (const _ of watcher) {
    queuePush(true);
  }
}
