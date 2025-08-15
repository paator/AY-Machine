import { AttachmentBuilder, DiscordAPIError } from "discord.js";
import type { Message } from "discord.js";
import {
  downloadToBuffer,
  readBinaryFile,
  safeRemoveFile,
  writeBinaryFile,
} from "../core/fileService.js";
import { parseUserFlags } from "../core/parseUserFlags.js";
import { dispatchConversion } from "../converters/registry.js";
import { getArtistAndTitleFromMp3 } from "../core/metadata.js";
import {
  conversionErrorMessage,
  conversionStart,
  conversionSuccessMessage,
} from "../adapters/discord/messages.js";
import { logUsage } from "../core/usageLogger.js";
import { reencodeMP3 } from "../converters/shared.js";
import { FileTooLargeError } from "../domain/errors.js";

const DISCORD_FILE_SIZE_LIMIT_ERROR = 40005;
const BITRATE_SEQUENCE = [320, 256, 192, 160, 128];

export async function handleMessageWithAttachment(message: Message): Promise<void> {
  const attachment = message.attachments.first();
  if (!attachment) return;

  const extension = attachment.name.split(".").pop()?.toUpperCase() ?? "";

  const channelName =
    typeof (message.channel as { name?: unknown }).name === "string"
      ? (message.channel as { name?: string }).name!
      : message.channelId;

  await logUsage(
    {
      id: message.author.id,
      username: message.author.username,
      discriminator: message.author.discriminator,
    },
    message.guild ? { id: message.guild.id, name: message.guild.name } : null,
    { id: message.channel.id, name: channelName },
    attachment.name,
  );

  const inputPath = attachment.name;
  const mp3Path = `${inputPath}.mp3`;
  const wavPath = `${inputPath}.wav`;

  const hasInlineFlags = /\b(clock|layout|type)=/i.test(message.content ?? "");
  const flagsFromCommand = hasInlineFlags ? "\n✅ AY flags set for this message." : "";

  const startReply = await message.reply({ content: `${conversionStart}${flagsFromCommand}`, failIfNotExists: false });

  const buffer = await downloadToBuffer(attachment.url);
  writeBinaryFile(inputPath, buffer);

  const flags = parseUserFlags(message.content);

  try {
    const { mp3Path: producedMp3Path } = await dispatchConversion({ inputPath, extension, flags });
    
    let currentBitrateIndex = 0;
    let mp3Buffer = readBinaryFile(producedMp3Path);
    const { artist, title } = await getArtistAndTitleFromMp3(mp3Buffer);
    let usedBitrate = BITRATE_SEQUENCE[currentBitrateIndex];
    let success = false;

    while (!success && currentBitrateIndex < BITRATE_SEQUENCE.length) {
      try {
        await startReply.edit({
          content: conversionSuccessMessage(
            artist, 
            title, 
            currentBitrateIndex > 0 ? usedBitrate : undefined
          ),
          files: [new AttachmentBuilder(mp3Buffer, { name: `${attachment.name}.mp3` })],
        });
        success = true;
      } catch (error) {
        if (
          error instanceof DiscordAPIError && 
          error.code === DISCORD_FILE_SIZE_LIMIT_ERROR &&
          currentBitrateIndex < BITRATE_SEQUENCE.length - 1
        ) {
          currentBitrateIndex++;
          usedBitrate = BITRATE_SEQUENCE[currentBitrateIndex];
          console.log(`File too large for Discord. Reencoding with ${usedBitrate}kbps bitrate.`);
          
          try {
            const originalMp3Copy = `${producedMp3Path}.original`;
            
            const originalBuffer = readBinaryFile(producedMp3Path);
            writeBinaryFile(originalMp3Copy, originalBuffer);
            
            reencodeMP3(producedMp3Path, producedMp3Path, usedBitrate);
            
            mp3Buffer = readBinaryFile(producedMp3Path);
            
            safeRemoveFile(originalMp3Copy);
          } catch (ffmpegError) {
            console.error(`Error during reencoding: ${ffmpegError}`);
            throw new Error(`Failed to reencode audio file at ${usedBitrate}kbps.`);
          }
        } else {
          //not a file size error or we've exhausted all bitrates
          throw error;
        }
      }
    }

    if (!success) {
      throw new FileTooLargeError();
    }
  } catch (error) {
    console.error("Error during conversion:", error);
    await startReply.edit(conversionErrorMessage(error));
  } finally {
    safeRemoveFile(inputPath);
    safeRemoveFile(mp3Path);
    safeRemoveFile(wavPath);
  }
}