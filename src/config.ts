import * as path from "jsr:@std/path";
import getRequiredEnv from "@src/utils/getRequiredEnv.ts";

const config = {
  serverPath: "server",
  windowsPortableGitPath: path.join(
    import.meta.dirname || ".",
    "..",
    "portable_git\\cmd\\git.exe",
  ),
  accessKey: getRequiredEnv("ACCESS_KEY"),
  repo: getRequiredEnv("REPO"),
};

console.log(config);

export default config;
