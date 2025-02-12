function log(message: string) {
  console.log(`[LOG] ${message}`);
}

function info(message: string) {
  console.log(`%c[INFO] ${message}`, "color: yellow");
}

function error(message: string) {
  console.log(`%c[ERROR] ${message}`, "color: red; font-weight: bold");
}

const logger = { log, info, error };

export default logger;
