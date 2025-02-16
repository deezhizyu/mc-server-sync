import getRequiredEnv from "@src/utils/getRequiredEnv.ts";

const config = {
  serverPath: "server",
  accessKey: getRequiredEnv("ACCESS_KEY"),
  repo: getRequiredEnv("REPO"),
};

export default config;
