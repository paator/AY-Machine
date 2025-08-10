import { createDiscordClient } from "./adapters/discord/client.js";
import { registerMessageHandler } from "./adapters/discord/messageHandler.js";
import { registerSlashCommands, registerSlashHandler } from "./adapters/discord/slash.js";
import { checkDependencies } from "./core/dependencyCheck.js";
import { BOT_TOKEN } from "./config/env.js";

const client = createDiscordClient();

client.on("ready", async () => {
  console.log("Bot operational and ready to process commands.");
  try {
    await registerSlashCommands(client);
    console.log("Slash commands registered.");
  } catch (err) {
    console.error("Failed to register slash commands:", err);
  }
});

checkDependencies();
registerMessageHandler(client);
registerSlashHandler(client);

client.login(BOT_TOKEN());
