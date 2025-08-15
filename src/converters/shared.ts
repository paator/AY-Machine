import { runCommandSync } from "../core/processRunner.js";
import { TOOLS_DIR } from "../config/constants.js";
import { safeRemoveFile } from "../core/fileService.js";
import { renameSync } from "fs";

export function convertToMp3(outputWavPath: string, outputMp3Path: string, bitrate = 320): void {
  const command = `${TOOLS_DIR}ffmpeg -i "${outputWavPath}" -ab ${bitrate}k "${outputMp3Path}" -hide_banner -loglevel error`;
  runCommandSync(command);
  safeRemoveFile(outputWavPath);
}

export function reencodeMP3(inputMp3Path: string, outputMp3Path: string, bitrate: number): void {
  try {
    const tempOutputPath = `${outputMp3Path}.temp.${Date.now()}.mp3`;
    
    const command = `${TOOLS_DIR}ffmpeg -y -i "${inputMp3Path}" -ab ${bitrate}k "${tempOutputPath}" -hide_banner -loglevel error`;
    runCommandSync(command);
    
    safeRemoveFile(inputMp3Path);
    
    renameSync(tempOutputPath, outputMp3Path);
  } catch (error) {
    console.error(`Error reencoding MP3 file: ${error}`);
    throw error;
  }
}