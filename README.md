<div align="center">

# MC Server Sync

A tool to synchronize your Minecraft server with a remote Git repository.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Deno](https://img.shields.io/badge/Deno-000000?style=for-the-badge&logo=deno&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

</div>

## Features

- **Automatic Sync**: Automatically syncs your Minecraft server world saves with a remote Git repository.
- **Conflict Handling**: Handles conflicts by prompting the user to either revert changes or force push.
- **Server Setup**: Automatically downloads the server and starts with optimized JVM flags.
- **File Watching**: Watches for changes in the world save files and queues pushes to the repository.
- **Graceful Shutdown**: Ensures that changes are pushed to the repository before the server shuts down.

## Compile

1. Clone the repository:
   ```sh
   git clone https://github.com/deezhizyu/mc-server-sync.git
   cd mc-server-sync
   ```

2. Install dependencies:
   ```sh
   deno install
   ```

3. Create a new repository with README.md file

4. Create a fine-grained personal access token with access to only that repository, enable Contents read-write permission
https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token

5. Setup .env file:
   ```sh
   ACCESS_KEY=your_access_token
   REPO=your_repo_url
   SERVER_JAR_URL=your_server_jar_url
   ```

6. Compile:
   ```sh
   sh compile.sh or sh compile-windows.sh
   ```

7. Run compiled binary in `compiled` folder

## Acknowledgements

- [Deno](https://deno.land/)
- [simple-git](https://github.com/steveukx/git-js)
- [Minecraft](https://www.minecraft.net/)
