import { AttachmentBuilder, Client } from "discord.js";
import "dotenv/config";
import { execSync } from "child_process";
import { existsSync, writeFileSync, rmSync, readFileSync } from "fs";
import fetch from "node-fetch";
import { parseBuffer } from "music-metadata";

const supportedZXTuneFormats = [
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
  "KSS"
];

const supportedFurnaceFormats =[
  "FUR"
];

function isSupportedZXTuneFormat(extension) {
  return supportedZXTuneFormats.includes(extension.toUpperCase());
}

function isSupportedFurnaceFormat(extension) {
  return supportedFurnaceFormats.includes(extension.toUpperCase());
}

if (!existsSync("./zxtune123")) {
  console.log("zxtune CLI not found, quitting");
  process.exit(1);
}

if (!existsSync("./furnace")) {
  console.log("furnace CLI not found, quitting");
  process.exit(1);
}

if (!existsSync("./ffmpeg")) {
  console.log("ffmpeg not found, quitting");
  process.exit(1);
}

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
  failIfNotExists: false,
});

client.on("ready", () => {
  console.log("Bot operational and ready to process commands.");
});

client.on("messageCreate", async (message) => {
  if (!message.author.bot) {
    const def_aymClockRate = 1750000
    const def_aymLayout = 0
    const def_aymType = 0

    // User attachment
    if (message.attachments.size && message.attachments.first()) {
      const attachment = message.attachments.first();
      const extension = attachment.name.split(".").pop();

      if (isSupportedZXTuneFormat(extension)) {
        const reply = await message.reply(
          "🤖 Initiating file conversion to format audible by humans. Please standby...",
          { failIfNotExists: false }
        );

        const moduleFilePath = `./${attachment.name}`;
        const mp3FilePath = `${moduleFilePath}.mp3`;

        try {
          const file = await fetch(attachment.url);
          const buffer = Buffer.from(await file.arrayBuffer());

          writeFileSync(moduleFilePath, buffer);

          // Read user flags
          if (message.content) {
            const userFlags = message.content.replace(" ", "").split(",")

            // Set default values
            var aymClockRate = def_aymClockRate
            var aymLayout = def_aymLayout
            var aymType = def_aymType

            for (let i = 0; i < userFlags.length; i++) {
              if (userFlags[i].split("=")[0] == "AYMClockRate") {
                const aymClockRateValue = Math.min(Math.max(parseInt(userFlags[i].split("=")[1]), 1000000), 9999999);
                var aymClockRate = isNaN(aymClockRateValue) ? def_aymClockRate : aymClockRateValue
              }

              if (userFlags[i].split("=")[0] == "AYMLayout") {
                const aymLayoutValue = Math.min(Math.max(parseInt(userFlags[i].split("=")[1]), 0), 5);
                var aymLayout = isNaN(aymLayoutValue) ? def_aymLayout : aymLayoutValue
              }

              if (userFlags[i].split("=")[0] == "AYMType") {
                const aymTypeValue = (parseInt(userFlags[i].split("=")[1]) > 0) ? 1 : 0;
                var aymType = isNaN(aymTypeValue) ? def_aymType : aymTypeValue
              }
            }
          } else {
            var aymClockRate = def_aymClockRate
            var aymLayout = def_aymLayout
            var aymType = def_aymType
          }

          execSync(`
            ./zxtune123 --core-options aym.clockrate="${aymClockRate}",aym.layout="${aymLayout}",aym.type="${aymType}" --mp3 filename="${mp3FilePath}",bitrate=320 "${moduleFilePath}"
          `);

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
      } else if (isSupportedFurnaceFormat(extension)) {
        const reply = await message.reply(
          "🤖 Initiating file conversion to format audible by humans. Please standby...",
          { failIfNotExists: false }
        );

        const moduleFilePath = `./${attachment.name}`;
        const wavFilePath = `${moduleFilePath}.wav`;
        const mp3FilePath = `${wavFilePath}.mp3`;

        try {
          const file = await fetch(attachment.url);
          const buffer = Buffer.from(await file.arrayBuffer());

          writeFileSync(moduleFilePath, buffer);

          execSync(`./furnace -console "${process.env.PWD}/${moduleFilePath}" -output "${process.env.PWD}/${wavFilePath}"`);
          // Convert wave to mp3
          execSync(`./ffmpeg -i ${wavFilePath} -ab 320k ${mp3FilePath} -hide_banner -loglevel error`);

          const mp3Buffer = readFileSync(mp3FilePath);

          await reply.edit({
            content: `🎶 Your track is ready for listening! 🎧🔥`,
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
          if (existsSync(wavFilePath)) {
            rmSync(wavFilePath);
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
