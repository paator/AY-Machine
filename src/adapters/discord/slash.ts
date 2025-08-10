import type { Client, ChatInputCommandInteraction } from "discord.js";
import { buildHelpMessage } from "./messages.js";

export async function registerSlashCommands(client: Client): Promise<void> {
  await client.application?.commands.set([
    {
      name: "help",
      description: "Show AY Machine help and usage",
    },
  ]);
}

export function registerSlashHandler(client: Client): void {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const chat = interaction as ChatInputCommandInteraction;
    if (chat.commandName === "help") {
      await chat.reply({ content: buildHelpMessage(), ephemeral: true });
    }
  });
}


