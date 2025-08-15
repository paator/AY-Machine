import { runCommandSync } from "../core/processRunner.js";
import { TOOLS_DIR } from "../config/constants.js";
import type { ConversionRequest, ConversionResult } from "../domain/types.js";
import { convertToMp3 } from "./shared.js";

export async function convertWithChipnsfx(request: ConversionRequest): Promise<ConversionResult> {
  const { inputPath, bitrate } = request;
  const wavPath = `${inputPath}.wav`;
  const mp3Path = `${inputPath}.mp3`;
  const command = `${TOOLS_DIR}chipnsfx -w "${inputPath}" "${wavPath}"`;
  runCommandSync(command);
  convertToMp3(wavPath, mp3Path, bitrate);
  return { mp3Path };
}