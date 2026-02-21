import path from "node:path";
import { execSync } from "child_process";
import { BITPHASE_DIR } from "../config/constants.js";
import type { ConversionRequest, ConversionResult } from "../domain/types.js";
import { convertToMp3 } from "./shared.js";

export async function convertWithBitphase(request: ConversionRequest): Promise<ConversionResult> {
  const { inputPath, bitrate } = request;
  const wavPath = `${inputPath}.wav`;
  const mp3Path = `${inputPath}.mp3`;

  const absInput = path.resolve(process.cwd(), inputPath);
  const absWav = path.resolve(process.cwd(), wavPath);

  const bitphasePath = path.resolve(process.cwd(), BITPHASE_DIR);
  const tsxPath = path.join(process.cwd(), "node_modules", ".bin", "tsx");
  const command = `cd "${bitphasePath}" && "${tsxPath}" cli/btp-to-wav.ts "${absInput}" "${absWav}"`;

  try {
    execSync(command, {
      stdio: "pipe",
      encoding: "utf-8",
      maxBuffer: 128 * 1024 * 1024,
    });
  } catch (err) {
    const stderr = err instanceof Error && "stderr" in err ? String((err as { stderr?: Buffer | string }).stderr) : "";
    const stdout = err instanceof Error && "stdout" in err ? String((err as { stdout?: Buffer | string }).stdout) : "";
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[bitphase] stderr:", stderr);
    console.error("[bitphase] stdout:", stdout);
    const shortMsg = msg.includes("jszip") || msg.includes("ERR_MODULE_NOT_FOUND")
      ? "Bitphase dependencies missing. Run: cd bitphase && pnpm install"
      : msg.split("\n")[0] ?? msg;
    throw new Error(shortMsg);
  }

  convertToMp3(wavPath, mp3Path, bitrate);
  return { mp3Path };
}
