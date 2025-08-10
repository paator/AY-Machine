import { createDiscordClient } from "./adapters/discord/client.js";
import { registerMessageHandler } from "./adapters/discord/messageHandler.js";
import { registerSlashCommands, registerSlashHandler } from "./adapters/discord/slash.js";
import { checkDependencies } from "./core/dependencyCheck.js";
import { BOT_TOKEN } from "./config/env.js";

const client = createDiscordClient();

client.on("ready", () => {
  console.log("Bot operational and ready to process commands.");
});

checkDependencies();
registerMessageHandler(client);
registerSlashHandler(client);

client.login(BOT_TOKEN()).then(async () => {
  try {
    await registerSlashCommands(client);
  } catch (err) {
    console.error("Failed to register slash commands:", err);
  }
});
