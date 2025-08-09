import { createDiscordClient } from "./adapters/discord/client.js";
import { registerMessageHandler } from "./adapters/discord/messageHandler.js";
import { checkDependencies } from "./core/dependencyCheck.js";
import { BOT_TOKEN } from "./config/env.js";

const client = createDiscordClient();

client.on("ready", () => {
  console.log("Bot operational and ready to process commands.");
});

checkDependencies();
registerMessageHandler(client);

client.login(BOT_TOKEN());
