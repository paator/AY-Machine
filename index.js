import { AttachmentBuilder, Client } from "discord.js";
import "dotenv/config";
import { execSync } from "child_process";
import { existsSync, writeFileSync, rmSync, readFileSync } from "fs";
import fetch from "node-fetch";
import { parseBuffer } from "music-metadata";

const supportedFormats = [
  "ASC",
  "FTC",
  "GTR",
  "PSC",
  "PSG",
  "PSM",
  "PT1",
  "PT2",
  "PT3",
  "SQT",
  "STC",
  "ST1",
  "ST3",
  "STP",
  "VTX",
  "YM",
  "TXT",
  "CHI",
  "DMM",
  "DST",
  "ET1",
  "PDT",
  "SQD",
  "STR",
  "TFC",
  "TFD",
  "TFE",
  "669",
  "AMF",
  "DMF",
  "FAR",
  "FNK",
  "GDM",
  "IMF",
  "IT",
  "LIQ",
  "PSM",
  "MDL",
  "MTM",
  "PTM",
  "RTM",
  "S3M",
  "STIM",
  "STM",
  "STX",
  "ULT",
  "XM",
  "DBM",
  "EMOD",
  "MOD",
  "MTN",
  "IMS",
  "MED",
  "OKT",
  "PT36",
  "SFX",
  "AHX",
  "DTM",
  "GTK",
  "TCB",
  "SAP",
  "DTT",
  "COP",
  "SID",
  "AYC",
  "SPC",
  "MTC",
  "VGM",
  "GYM",
  "NSF",
  "NSFe",
  "GBS",
  "GSF",
  "HES",
  "KSS",
];

function isSupportedFormat(extension) {
  return supportedFormats.includes(extension.toUpperCase());
}

if (!existsSync("./zxtune123")) {
  console.log("zxtune CLI not found");
  process.exit(1);
}

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

client.on("ready", () => {
  console.log("Bot operational and ready to process commands.");
});

client.on("messageCreate", async (message) => {
  if (!message.author.bot) {
    if (message.attachments.size && message.attachments.first()) {
      const attachment = message.attachments.first();
      const extension = attachment.name.split(".").pop();

      if (isSupportedFormat(extension)) {
        const reply = await message.reply(
          "🤖 Initiating file conversion to format audible by humans. Please standby..."
        );

        const moduleFilePath = `./${attachment.name}`;
        const mp3FilePath = `${moduleFilePath}`;

        try {
          const file = await fetch(attachment.url);
          const buffer = Buffer.from(await file.arrayBuffer());

          writeFileSync(moduleFilePath, buffer);

          execSync(
            `./zxtune123 --mp3 filename="${mp3FilePath}",bitrate=320 ${moduleFilePath}`
          );

          const mp3Buffer = readFileSync(mp3FilePath);

          const metadata = await parseBuffer(mp3Buffer, {
            mimeType: "audio/mpeg",
            size: mp3Buffer.length,
          });
          const artist = metadata.common.artist || "Unknown Artist";
          const title = metadata.common.title || "Unknown Title";

          await reply.edit({
            content: `🎶 Your track "${title}" by ${artist} is ready for listening! 🎧🔥`,
            files: [
              new AttachmentBuilder()
                .setName(`${attachment.name}.mp3`)
                .setFile(mp3Buffer),
            ],
          });
        } catch (error) {
          console.error("Error during conversion:", error);
          await reply.edit(
            `🤖 An error occurred during the conversion process. Please try again. ${error}`
          );
        } finally {
          if (existsSync(moduleFilePath)) {
            rmSync(moduleFilePath);
          }
          if (existsSync(mp3FilePath)) {
            rmSync(mp3FilePath);
          }
        }
      }
    }
  }
});

client.login(process.env.BOT_TOKEN);
