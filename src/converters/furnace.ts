import { runCommandSync } from "../core/processRunner.js";
import { TOOLS_DIR } from "../config/constants.js";
import type { ConversionRequest, ConversionResult } from "../domain/types.js";

export async function convertWithFurnace(request: ConversionRequest): Promise<ConversionResult> {
  const { inputPath, bitrate = 320 } = request;
  const mp3Path = `${inputPath}.mp3`;
  const command = `${TOOLS_DIR}furnace -console "${process.cwd()}/${inputPath}" -outformat mp3 -bitrate "${bitrate}" -output "${process.cwd()}/${mp3Path}"`;
  runCommandSync(command);
  return { mp3Path };
}
