import { getFormattedDate } from "@src/utils/getFormattedDate.ts";

export async function signEula(file: string) {
  const signed = `#By changing the setting below to TRUE you are indicating your agreement to our EULA (https://aka.ms/MinecraftEULA).
#${getFormattedDate()}
eula=TRUE`;

  const eulaFile = await Deno.open(file, {
    create: true,
    write: true,
  });

  const encoder = new TextEncoder();
  const data = encoder.encode(signed);

  await eulaFile.write(data);
}
