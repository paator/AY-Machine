import { runCommandSync } from "../core/processRunner.js";
import { TOOLS_DIR } from "../config/constants.js";
import type { ConversionRequest, ConversionResult } from "../domain/types.js";

export async function convertWithZXTune(request: ConversionRequest): Promise<ConversionResult> {
  const { inputPath, flags, bitrate = 320 } = request;
  const mp3Path = `${inputPath}.mp3`;

  const { aymClockRate, aymLayout, aymType } = flags;
  const clock = String(aymClockRate);
  const layout = String(aymLayout);
  const type = String(aymType);

  const command = `${TOOLS_DIR}zxtune123 --core-options aym.clockrate="${clock}",aym.layout="${layout}",aym.type="${type}" --mp3 filename="${mp3Path}",bitrate=${bitrate} "${inputPath}"`;
  runCommandSync(command);
  return { mp3Path };
}