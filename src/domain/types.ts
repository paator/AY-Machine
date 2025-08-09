export type UserFlags = {
  aymClockRate: string | number;
  aymLayout: number;
  aymType: number;
};

export type ConversionRequest = {
  inputPath: string;
  extension: string; // already uppercased
  flags: UserFlags;
};

export type ConversionResult = {
  mp3Path: string;
};
