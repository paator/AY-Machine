import type { ConversionRequest, ConversionResult } from "../domain/types.js";

export interface Converter {
  convert(request: ConversionRequest): Promise<ConversionResult>;
}
