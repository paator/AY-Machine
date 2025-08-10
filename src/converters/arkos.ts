import { runCommandSync } from "../core/processRunner.js";
import { TOOLS_DIR } from "../config/constants.js";
import type { ConversionRequest, ConversionResult } from "../domain/types.js";
import { convertToMp3 } from "./shared.js";

export async function convertWithArkos(request: ConversionRequest): Promise<ConversionResult> {
  const { inputPath } = request;
  const wavPath = `${inputPath}.wav`;
  const mp3Path = `${inputPath}.mp3`;
  const command = `${TOOLS_DIR}SongToWav "${inputPath}" "${wavPath}"`;
  runCommandSync(command);
  convertToMp3(wavPath, mp3Path);
  return { mp3Path };
}
