import type { Message } from "discord.js";
import { COMMAND_PREFIX } from "../../config/commands.js";
import { helpMessage } from "./messages.js";
import { parseUserFlags } from "../../core/parseUserFlags.js";

export type ParsedCommand =
  | { kind: "none" }
  | { kind: "aym-help" }
  | { kind: "aym-ignore" }
  | { kind: "aym-flags"; flagsText: string };

export function parseCommand(message: Message): ParsedCommand {
  const content = message.content?.trim() ?? "";
  if (!content.startsWith(COMMAND_PREFIX)) return { kind: "none" };

  const withoutPrefix = content.slice(COMMAND_PREFIX.length).trim();
  const [cmd, ...rest] = withoutPrefix.split(/\s+/);
  const args = rest.join(" ");

  if (cmd.toLowerCase() === "aym") {
    const sub = rest[0]?.toLowerCase();
    if (sub === "help") return { kind: "aym-help" };
    if (sub === "ignore") return { kind: "aym-ignore" };
    if (!args) return { kind: "aym-help" };
    return { kind: "aym-flags", flagsText: args };
  }
  return { kind: "none" };
}

export async function handleCommand(message: Message): Promise<"handled" | "passthrough"> {
  const parsed = parseCommand(message);
  switch (parsed.kind) {
    case "aym-help": {
      await message.reply({ content: helpMessage, failIfNotExists: false });
      return "handled";
    }
    case "aym-ignore": {
      await message.reply({ content: "✅ This message will be ignored for conversion.", failIfNotExists: false });
      return "handled";
    }
    case "aym-flags": {
      parseUserFlags(parsed.flagsText);
      await message.reply({ content: "✅ AY flags set for this message.", failIfNotExists: false });
      return "passthrough";
    }
    default:
      return "passthrough";
  }
}


