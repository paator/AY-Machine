import { parseBuffer } from "music-metadata";

export async function getArtistAndTitleFromMp3(mp3Buffer: Buffer): Promise<{
  artist?: string;
  title?: string;
}> {
  const metadata = await parseBuffer(mp3Buffer, {
    mimeType: "audio/mpeg",
    size: mp3Buffer.length,
  });
  return {
    artist: metadata.common.artist ?? undefined,
    title: metadata.common.title ?? undefined,
  };
}
