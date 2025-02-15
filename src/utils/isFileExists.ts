function isFileExists(path: string) {
  try {
    Deno.lstatSync(path);

    return true;
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }

    return false;
  }
}

export default isFileExists;
