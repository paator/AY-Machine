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

export const helpMessage = `
AY Machine – chiptune to MP3 bot

Usage:
- Attach a supported chiptune file and the bot will convert it automatically.
- To skip conversion for a specific message, include: !aym ignore (preferred) or legacy: $aymignorefile
- To control AY options in files compatible with zxtune, use:
  !aym clock=<chip|hz>, layout=<abc|acb|bac|bca|cba|cab|mono>, type=<ay|ym>

Examples:
- !aym clock=zx layout=abc
- !aym clock=1750000 type=ym

Notes:
- You can still place flags directly in the message without !aym for backward compatibility.
- Supported flags: clock, layout, type (ay|ym).
- Help: !aym help
`;
