import {
  supportedArkosFormats,
  supportedBitphaseFormats,
  supportedChipnsfxFormats,
  supportedFurnaceFormats,
  supportedMahTrackerFormats,
  supportedOpenMPTFormats,
  supportedPSGplayFormats,
  supportedZXTuneFormats,
} from "../config/constants.js";
import type { ConversionRequest, ConversionResult } from "../domain/types.js";
import { convertWithArkos } from "./arkos.js";
import { convertWithBitphase } from "./bitphase.js";
import { convertWithChipnsfx } from "./chipnsfx.js";
import { convertWithFurnace } from "./furnace.js";
import { convertWithMahTracker } from "./mahtracker.js";
import { convertWithOpenMPT } from "./openmpt.js";
import { convertWithPSGplay } from "./psgplay.js";
import { convertWithZXTune } from "./zxtune.js";

export async function dispatchConversion(request: ConversionRequest): Promise<ConversionResult> {
  const { extension } = request;
  if (supportedArkosFormats.has(extension)) return convertWithArkos(request);
  if (supportedBitphaseFormats.has(extension)) return convertWithBitphase(request);
  if (supportedChipnsfxFormats.has(extension)) return convertWithChipnsfx(request);
  if (supportedFurnaceFormats.has(extension)) return convertWithFurnace(request);
  if (supportedMahTrackerFormats.has(extension)) return convertWithMahTracker(request);
  if (supportedOpenMPTFormats.has(extension)) return convertWithOpenMPT(request);
  if (supportedPSGplayFormats.has(extension)) return convertWithPSGplay(request);
  if (supportedZXTuneFormats.has(extension)) return convertWithZXTune(request);
  throw new Error(`Unsupported extension: ${extension}`);
}
