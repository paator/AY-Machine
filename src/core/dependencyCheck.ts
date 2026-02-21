import { existsSync } from "fs";
import path from "node:path";
import { TOOLS_DIR, BITPHASE_DIR } from "../config/constants.js";
import { DependencyMissingError } from "../domain/errors.js";

export function checkDependencies(): void {
  const toolDeps = ["zxtune123", "furnace", "ffmpeg", "chipnsfx", "SongToWav", "psgplay", "openmpt123"];
  for (const dep of toolDeps) {
    if (!existsSync(TOOLS_DIR + dep)) {
      console.log(`${dep} not found, quitting`);
      throw new DependencyMissingError(dep);
    }
  }

  const bitphaseWasm = path.join(BITPHASE_DIR, "public", "ayumi.wasm");
  if (!existsSync(bitphaseWasm)) {
    console.log("bitphase/public/ayumi.wasm not found, quitting");
    throw new DependencyMissingError("bitphase (run: pnpm build:wasm)");
  }
}
