import { runCommandSync } from "../core/processRunner.js";
import { TOOLS_DIR } from "../config/constants.js";
import { safeRemoveFile } from "../core/fileService.js";

export function convertToMp3(outputWavPath: string, outputMp3Path: string, bitrate = 320): void {
  const command = `${TOOLS_DIR}ffmpeg -i "${outputWavPath}" -ab ${bitrate}k "${outputMp3Path}" -hide_banner -loglevel error`;
  runCommandSync(command);
  safeRemoveFile(outputWavPath);
}

export function reencodeMP3(inputMp3Path: string, outputMp3Path: string, bitrate: number): void {
  const tempOutputPath = `${outputMp3Path}.temp`;
  const command = `${TOOLS_DIR}ffmpeg -i "${inputMp3Path}" -ab ${bitrate}k "${tempOutputPath}" -hide_banner -loglevel error`;
  runCommandSync(command);
  
  safeRemoveFile(inputMp3Path);
  const renameCommand = process.platform === 'win32' 
    ? `move "${tempOutputPath}" "${outputMp3Path}"` 
    : `mv "${tempOutputPath}" "${outputMp3Path}"`;
  runCommandSync(renameCommand);
}