export class DependencyMissingError extends Error {
  constructor(public dependencyName: string) {
    super(`${dependencyName} not found, quitting`);
    this.name = "DependencyMissingError";
  }
}

export class FileTooLargeError extends Error {
  constructor() {
    super("Failed to upload file even with very low bitrate. MP3 file is too large for Discord.");
    this.name = "FileTooLargeError";
  }
}
