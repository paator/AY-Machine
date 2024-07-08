import { AttachmentBuilder, Client } from "discord.js";
import "dotenv/config";
import { execSync } from "child_process";
import { existsSync, writeFileSync, rmSync, readFileSync } from "fs";
import fetch from "node-fetch";
import { parseBuffer } from "music-metadata";

const supportedZXTuneFormats = new Set([
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
]);

const supportedFurnaceFormats = new Set(["FUR"]);

const commonAYMChipFrequencies = [
  ["zx", "1773400"],
  ["pentagon", "1750000"],
  ["bk", "1710000"],
  ["vectrex", "1500000"],
  ["cpc", "1000000"],
  ["st", "2000000"],
  ["taganrog", "3000000"],
];

const commonAYMLayouts = ["abc", "acb", "bac", "bca", "cba", "cab", "mono"];

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
  failIfNotExists: false,
});

const checkDependencies = () => {
  const dependencies = ["./zxtune123", "./furnace", "./ffmpeg"];
  for (const dep of dependencies) {
    if (!existsSync(dep)) {
      console.log(`${dep} not found, quitting`);
      process.exit(1);
    }
  }
};

const parseUserFlags = (messageContent) => {
  const def_aymClockRate = 1750000;
  const def_aymLayout = 0;
  const def_aymType = 0;

  let aymClockRate = def_aymClockRate;
  let aymLayout = def_aymLayout;
  let aymType = def_aymType;

  if (messageContent) {
    const userFlags = messageContent.replaceAll(" ", "").split(",");

    for (const flag of userFlags) {
      const [key, value] = flag.split("=").map((s) => s.toLowerCase());
      if (key === "clock") {
        const match = commonAYMChipFrequencies.find(([name]) =>
          value.includes(name)
        );
        if (match) aymClockRate = match[1];
      }
      if (key === "layout") {
        const layoutIndex = commonAYMLayouts.indexOf(value);
        if (layoutIndex !== -1) aymLayout = layoutIndex;
      }
      if (key === "type" && value === "ym") {
        aymType = 1;
      }
    }
  }

  return { aymClockRate, aymLayout, aymType };
};

const downloadAttachment = async (url, path) => {
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(path, buffer);
  return buffer;
};

const convertWithZXTune = (
  inputPath,
  outputPath,
  { aymClockRate, aymLayout, aymType }
) => {
  execSync(
    `./zxtune123 --core-options aym.clockrate="${aymClockRate}",aym.layout="${aymLayout}",aym.type="${aymType}" --mp3 filename="${outputPath}",bitrate=320 "${inputPath}"`
  );
};

const convertWithFurnace = (inputPath, outputWavPath, outputMp3Path) => {
  execSync(
    `./furnace -console "${process.cwd()}/${inputPath}" -output "${process.cwd()}/${outputWavPath}"`
  );
  execSync(
    `./ffmpeg -i "${outputWavPath}" -ab 320k "${outputMp3Path}" -hide_banner -loglevel error`
  );
};

const handleConversion = async (message, extension, buffer, attachment) => {
  const inputPath = attachment.name;
  const mp3Path = `${inputPath}.mp3`;
  const reply = await message.reply(
    "🤖 Initiating file conversion to format audible by humans. Please standby...",
    { failIfNotExists: false }
  );

  writeFileSync(inputPath, buffer);

  const userFlags = parseUserFlags(message.content);

  try {
    if (supportedZXTuneFormats.has(extension)) {
      convertWithZXTune(inputPath, mp3Path, userFlags);
    } else if (supportedFurnaceFormats.has(extension)) {
      const wavPath = `${inputPath}.wav`;
      convertWithFurnace(inputPath, wavPath, mp3Path);
      rmSync(wavPath);
    }

    const mp3Buffer = readFileSync(mp3Path);
    const metadata = await parseBuffer(mp3Buffer, {
      mimeType: "audio/mpeg",
      size: mp3Buffer.length,
    });
    const artist = metadata.common.artist;
    const title = metadata.common.title;

    let messageContent;
    if (artist && title) {
      messageContent = `🎶 Your track "${title}" by ${artist} is ready for listening! 🎧🔥`;
    } else if (artist) {
      messageContent = `🎶 Your track by ${artist} is ready for listening! 🎧🔥`;
    } else if (title) {
      messageContent = `🎶 Your track "${title}" is ready for listening! 🎧🔥`;
    } else {
      messageContent = `🎶 Your track is ready for listening! 🎧🔥`;
    }

    await reply.edit({
      content: messageContent,
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
    rmSync(inputPath);
    rmSync(mp3Path);
  }
};

client.on("ready", () => {
  console.log("Bot operational and ready to process commands.");
});

client.on("messageCreate", async (message) => {
  if (!message.author.bot && message.attachments.size > 0) {
    const attachment = message.attachments.first();
    const extension = attachment.name.split(".").pop().toUpperCase();

    if (
      supportedZXTuneFormats.has(extension) ||
      supportedFurnaceFormats.has(extension)
    ) {
      const buffer = await downloadAttachment(attachment.url, attachment.name);
      await handleConversion(message, extension, buffer, attachment);
    }
  }
});

checkDependencies();
client.login(process.env.BOT_TOKEN);
