import { runCommandSync } from "../core/processRunner.js";
import { TOOLS_DIR } from "../config/constants.js";
import type { ConversionRequest, ConversionResult } from "../domain/types.js";
import { convertToMp3 } from "./shared.js";

export async function convertWithOpenMPT(request: ConversionRequest): Promise<ConversionResult> {
  const { inputPath, bitrate = 320 } = request;
  const wavPath = `${inputPath}.wav`;
  const mp3Path = `${inputPath}.mp3`;
  const command = `${TOOLS_DIR}openmpt123 --samplerate 44100 --render --ctl render.resampler.emulate_amiga=1 -- "${inputPath}"`;
  runCommandSync(command);
  convertToMp3(wavPath, mp3Path, bitrate);
  return { mp3Path };
}