export class DependencyMissingError extends Error {
  constructor(public dependencyName: string) {
    super(`${dependencyName} not found, quitting`);
    this.name = "DependencyMissingError";
  }
}
