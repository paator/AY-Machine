import { FileTooLargeError } from "../../domain/errors.js";
import { commonAYMChipFrequencies, commonAYMLayouts } from "../../config/constants.js";

export const conversionStart =
  "🤖 Initiating file conversion to format audible by humans. Please standby...";

export function conversionSuccessMessage(artist?: string, title?: string, reducedBitrate?: number): string {
  let message = "";
  if (artist && title) {
    message = `🎶 Your track "${title}" by ${artist} is ready for listening! 🎧🔥`;
  } else if (artist) {
    message = `🎶 Your track by ${artist} is ready for listening! 🎧🔥`;
  } else if (title) {
    message = `🎶 Your track "${title}" is ready for listening! 🎧🔥`;
  } else {
    message = `🎶 Your track is ready for listening! 🎧🔥`;
  }

  if (reducedBitrate) {
    message += `\n⚠️ Due to Discord file size limits, the audio quality was reduced to ${reducedBitrate}kbps.`;
  }

  return message;
}

export function conversionErrorMessage(error: unknown): string {
  if (error instanceof FileTooLargeError) {
    return `⚠️ **File Size Error**: The converted audio is too large to send via Discord even at the very low bitrate.`;
  }
  
  const errorMessage = String(error);
  
  if (errorMessage.includes("ffmpeg") && errorMessage.includes("Command failed")) {
    return `🤖 **Conversion Error**: There was a problem processing your audio file. The conversion tool encountered an error. Please try again with a different file.`;
  }
  
  return `🤖 An error occurred during the conversion process. Please try again. ${errorMessage}`;
}

export function buildHelpMessage(): string {
  const presets = commonAYMChipFrequencies
    .map(([name, hz]) => `${name}=${hz}`)
    .join(", ");
  const layouts = commonAYMLayouts.join(", ");

  return `
AY Machine – chiptune to MP3 bot

Usage:
- Attach a supported chiptune file and the bot will convert it automatically.
- To control AY options in files compatible with zxtune (e.g. .pt3), put flags anywhere in your message, no prefix required:
  clock=<chip_preset|hz> layout=<${layouts}> type=<ay|ym>
- To skip conversion for a specific attached track, include "ignore" anywhere in your message

Current AY chip presets:
  ${presets}

Examples:
- clock=zx layout=abc
- clock=1.75 type=ym
- clock=1750000
`;
}