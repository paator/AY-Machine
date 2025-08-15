import { writeFileSync, readFileSync, rmSync, existsSync } from "fs";
import fetch from "node-fetch";

export async function downloadToBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export function writeBinaryFile(path: string, buffer: Buffer): void {
  writeFileSync(path, buffer);
}

export function readBinaryFile(path: string): Buffer {
  return readFileSync(path);
}

export function removeFile(path: string): void {
  if (existsSync(path)) {
    rmSync(path);
  }
}

export function safeRemoveFile(path: string): void {
  try {
    removeFile(path);
  } catch (err) {
    console.error(`Failed to remove file: ${path}`, err);
  }
}