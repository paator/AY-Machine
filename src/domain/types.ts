export type UserFlags = {
  aymClockRate: string | number;
  aymLayout: number;
  aymType: number;
  openMPTStereoSeparation: number;
  openMPTUseInterpolation: boolean
};

export type ConversionRequest = {
  inputPath: string;
  extension: string; // already uppercased
  flags: UserFlags;
  bitrate?: number;
};

export type ConversionResult = {
  mp3Path: string;
};