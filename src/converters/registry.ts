import {
  supportedArkosFormats,
  supportedChipnsfxFormats,
  supportedFurnaceFormats,
  supportedOpenMPTFormats,
  supportedPSGplayFormats,
  supportedZXTuneFormats,
} from "../config/constants.js";
import type { ConversionRequest, ConversionResult } from "../domain/types.js";
import { convertWithZXTune } from "./zxtune.js";
import { convertWithFurnace } from "./furnace.js";
import { convertWithChipnsfx } from "./chipnsfx.js";
import { convertWithPSGplay } from "./psgplay.js";
import { convertWithArkos } from "./arkos.js";
import { convertWithOpenMPT } from "./openmpt.js";

export async function dispatchConversion(request: ConversionRequest): Promise<ConversionResult> {
  const { extension } = request;
  if (supportedZXTuneFormats.has(extension)) return convertWithZXTune(request);
  if (supportedFurnaceFormats.has(extension)) return convertWithFurnace(request);
  if (supportedChipnsfxFormats.has(extension)) return convertWithChipnsfx(request);
  if (supportedPSGplayFormats.has(extension)) return convertWithPSGplay(request);
  if (supportedArkosFormats.has(extension)) return convertWithArkos(request);
  if (supportedOpenMPTFormats.has(extension)) return convertWithOpenMPT(request);
  throw new Error(`Unsupported extension: ${extension}`);
}
