import getRequiredEnv from "@src/utils/getRequiredEnv.ts";

const config = {
  serverPath: "server",
  windowsPortableGitPath: "../portable_git/cmd/git.exe",
  accessKey: getRequiredEnv("ACCESS_KEY"),
  repo: getRequiredEnv("REPO"),
};

export default config;
