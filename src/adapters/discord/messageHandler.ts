import type { Client, Message } from "discord.js";
import {
  supportedArkosFormats,
  supportedChipnsfxFormats,
  supportedFurnaceFormats,
  supportedPSGplayFormats,
  supportedZXTuneFormats,
} from "../../config/constants.js";
import { handleMessageWithAttachment } from "../../application/handleConversion.js";
import { handleCommand } from "./commandHandler.js";

function isEligibleMessage(message: Message): boolean {
  if (message.author.bot) return false;
  if (message.attachments.size <= 0) return false;
  // Support both legacy token and new command for ignoring conversion
  if (message.content?.toLowerCase().includes("$aymignorefile")) return false;
  if (message.content?.toLowerCase().startsWith("!aym ignore")) return false;
  return true;
}

export function registerMessageHandler(client: Client): void {
  client.on("messageCreate", async (message) => {
    // Commands take precedence
    const cmdResult = await handleCommand(message as Message);
    if (cmdResult === "handled") return;

    if (!isEligibleMessage(message)) return;
    const attachment = message.attachments.first();
    if (!attachment) return;
    const extension = attachment.name.split(".").pop()?.toUpperCase() ?? "";
    if (
      supportedZXTuneFormats.has(extension) ||
      supportedFurnaceFormats.has(extension) ||
      supportedChipnsfxFormats.has(extension) ||
      supportedPSGplayFormats.has(extension) ||
      supportedArkosFormats.has(extension)
    ) {
      await handleMessageWithAttachment(message);
    }
  });
}
