import { AttachmentBuilder } from "discord.js";
import type { Message } from "discord.js";
import {
  downloadToBuffer,
  readBinaryFile,
  removeFile,
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

  const startReply = await message.reply({ content: conversionStart, failIfNotExists: false });

  const buffer = await downloadToBuffer(attachment.url);
  writeBinaryFile(inputPath, buffer);

  const flags = parseUserFlags(message.content);

  try {
    const { mp3Path: producedMp3Path } = await dispatchConversion({ inputPath, extension, flags });
    const mp3Buffer = readBinaryFile(producedMp3Path);
    const { artist, title } = await getArtistAndTitleFromMp3(mp3Buffer);

    await startReply.edit({
      content: conversionSuccessMessage(artist, title),
      files: [new AttachmentBuilder(mp3Buffer, { name: `${attachment.name}.mp3` })],
    });
  } catch (error) {
    console.error("Error during conversion:", error);
    await startReply.edit(conversionErrorMessage(error));
  } finally {
    // Swallow errors on cleanup, but avoid empty catch blocks
    try {
      removeFile(inputPath);
    } catch (err) {
      void err;
    }
    try {
      removeFile(mp3Path);
    } catch (err) {
      void err;
    }
  }
}
