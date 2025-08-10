import { execSync } from "child_process";

export function runCommandSync(command: string): void {
  execSync(command);
}
