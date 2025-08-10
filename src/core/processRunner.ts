import { execSync } from "child_process";

export function runCommandSync(command: string): void {
  execSync(command, { stdio: "ignore", maxBuffer: 128 * 1024 * 1024 });
}
