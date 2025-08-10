import type { Client, ChatInputCommandInteraction, ApplicationCommandDataResolvable } from "discord.js";
import { buildHelpMessage } from "./messages.js";

export async function registerSlashCommands(client: Client): Promise<void> {
  const commands: ApplicationCommandDataResolvable[] = [
    {
      name: "help",
      description: "Show AY Machine help and usage",
      dmPermission: true,
      defaultMemberPermissions: null,
      type: 1
    },
  ];

  await client.application?.commands.set(commands);
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


