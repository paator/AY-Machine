import path from "node:path";
import { runCommandSync } from "../core/processRunner.js";
import { BITPHASE_DIR } from "../config/constants.js";
import type { ConversionRequest, ConversionResult } from "../domain/types.js";
import { convertToMp3 } from "./shared.js";

export async function convertWithBitphase(request: ConversionRequest): Promise<ConversionResult> {
  const { inputPath, bitrate } = request;
  const wavPath = `${inputPath}.wav`;
  const mp3Path = `${inputPath}.mp3`;

  const absInput = path.resolve(process.cwd(), inputPath);
  const absWav = path.resolve(process.cwd(), wavPath);

  const command = `cd ${BITPHASE_DIR} && pnpm btp-to-wav "${absInput}" "${absWav}"`;
  runCommandSync(command);
  convertToMp3(wavPath, mp3Path, bitrate);
  return { mp3Path };
}
