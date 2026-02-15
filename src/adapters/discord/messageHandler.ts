import type { Client, Message } from "discord.js";
import {
  supportedArkosFormats,
  supportedChipnsfxFormats,
  supportedFurnaceFormats,
  supportedMahTrackerFormats,
  supportedOpenMPTFormats,
  supportedPSGplayFormats,
  supportedZXTuneFormats,
} from "../../config/constants.js";
import { handleMessageWithAttachment } from "../../application/handleConversion.js";

function isEligibleMessage(message: Message): boolean {
  if (message.author.bot) return false;
  if (message.attachments.size <= 0) return false;
  if (message.content?.toLowerCase().includes("$aymignorefile")) return false;
  if (/\bignore\b/i.test(message.content ?? "")) return false;
  return true;
}

export function registerMessageHandler(client: Client): void {
  client.on("messageCreate", async (message) => {
    if (!isEligibleMessage(message)) return;
    const attachment = message.attachments.first();
    if (!attachment) return;
    const extension = attachment.name.split(".").pop()?.toUpperCase() ?? "";
    if (
      supportedArkosFormats.has(extension) ||
      supportedChipnsfxFormats.has(extension) ||
      supportedFurnaceFormats.has(extension) ||
      supportedMahTrackerFormats.has(extension) ||
      supportedOpenMPTFormats.has(extension) ||
      supportedPSGplayFormats.has(extension) ||
      supportedZXTuneFormats.has(extension)
    ) {
      await handleMessageWithAttachment(message);
    }
  });
}
