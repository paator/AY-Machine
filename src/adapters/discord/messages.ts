export const conversionStart =
  "🤖 Initiating file conversion to format audible by humans. Please standby...";

export function conversionSuccessMessage(artist?: string, title?: string): string {
  if (artist && title) {
    return `🎶 Your track "${title}" by ${artist} is ready for listening! 🎧🔥`;
  }
  if (artist) {
    return `🎶 Your track by ${artist} is ready for listening! 🎧🔥`;
  }
  if (title) {
    return `🎶 Your track "${title}" is ready for listening! 🎧🔥`;
  }
  return `🎶 Your track is ready for listening! 🎧🔥`;
}

export function conversionErrorMessage(error: unknown): string {
  return `🤖 An error occurred during the conversion process. Please try again. ${String(error)}`;
}
