import { runCommandSync } from "../core/processRunner.js";
import { TOOLS_DIR } from "../config/constants.js";
import { safeRemoveFile } from "../core/fileService.js";

export function convertToMp3(outputWavPath: string, outputMp3Path: string): void {
  const command = `${TOOLS_DIR}ffmpeg -i "${outputWavPath}" -ab 320k "${outputMp3Path}" -hide_banner -loglevel error`;
  runCommandSync(command);
  safeRemoveFile(outputWavPath);
}