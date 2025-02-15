import initializeRepo from "@src/git/initializeRepo.ts";
import changesCheck from "@src/git/changesCheck.ts";
import fetchServer from "@src/git/fetchServer.ts";
import gitClient from "@src/git/gitClient.ts";

const initializeGit = async () => {
  gitClient;

  await initializeRepo();
  await changesCheck();
  await fetchServer();
};

export default initializeGit;
