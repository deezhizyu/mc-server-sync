export async function downloadFile(filename: string, url: string) {
  const file = await Deno.open(filename, {
    create: true,
    write: true,
  });

  const request = await fetch(url, { read: true });

  if (!request.body) {
    Deno.exit(1);
  }

  await request.body?.pipeTo(file.writable);
}
