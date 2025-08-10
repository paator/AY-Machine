import { existsSync } from "fs";
import { TOOLS_DIR } from "../config/constants.js";
import { DependencyMissingError } from "../domain/errors.js";

export function checkDependencies(): void {
  const dependencies = ["zxtune123", "furnace", "ffmpeg", "chipnsfx", "SongToWav", "psgplay"];
  for (const dep of dependencies) {
    if (!existsSync(TOOLS_DIR + dep)) {
      console.log(`${dep} not found, quitting`);
      throw new DependencyMissingError(dep);
    }
  }
}
