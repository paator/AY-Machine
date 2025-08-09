import { commonAYMChipFrequencies, commonAYMLayouts } from "../config/constants.js";
import type { UserFlags } from "../domain/types.js";

export function parseUserFlags(messageContent: string | null | undefined): UserFlags {
  const def_aymClockRate = 1750000;
  const def_aymLayout = 0;
  const def_aymType = 0;

  let aymClockRate: number | string = def_aymClockRate;
  let aymLayout = def_aymLayout;
  let aymType = def_aymType;

  if (messageContent) {
    const userFlags = messageContent.replaceAll(" ", "").split(",");
    for (const flag of userFlags) {
      const [rawKey, rawValue] = flag.split("=");
      if (!rawKey || !rawValue) continue;
      const key = rawKey.toLowerCase();
      const value = rawValue.toLowerCase();

      if (key === "clock") {
        const match = commonAYMChipFrequencies.find(([name]) => value.includes(name));
        if (match) aymClockRate = match[1];
      }
      if (key === "layout") {
        const layoutIndex = commonAYMLayouts.indexOf(value as (typeof commonAYMLayouts)[number]);
        if (layoutIndex !== -1) aymLayout = layoutIndex;
      }
      if (key === "type" && value === "ym") {
        aymType = 1;
      }
    }
  }

  return { aymClockRate, aymLayout, aymType };
}
