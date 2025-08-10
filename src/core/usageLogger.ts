import { existsSync } from "fs";
import fs from "fs/promises";

type UserInfo = { id: string; username: string; discriminator: string };
type GuildInfo = { id: string; name: string } | null;
type ChannelInfo = { id: string; name: string };

export async function logUsage(
  user: UserInfo,
  guild: GuildInfo,
  channel: ChannelInfo,
  attachmentName: string,
): Promise<void> {
  const logFile = "usage_log.json";
  let logData: Array<{
    timestamp: string;
    user: UserInfo;
    guild: GuildInfo;
    channel: ChannelInfo;
    attachment: string;
  }> = [];

  try {
    if (existsSync(logFile)) {
      const fileContent = await fs.readFile(logFile, "utf-8");
      logData = JSON.parse(fileContent) as typeof logData;
    }

    logData.push({
      timestamp: new Date().toISOString(),
      user: { ...user },
      guild: guild ? { ...guild } : null,
      channel: { ...channel },
      attachment: attachmentName,
    });

    await fs.writeFile(logFile, JSON.stringify(logData, null, 2));
  } catch (error) {
    console.error("Error logging usage:", error);
  }
}
