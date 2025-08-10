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
    // Accept either comma-separated (a=b,c=d) or space-separated (a=b c=d)
    const cleaned = messageContent.replaceAll(" ", ",");
    const userFlags = cleaned.split(",").filter(Boolean);
    for (const flag of userFlags) {
      const [rawKey, rawValue] = flag.split("=");
      if (!rawKey || !rawValue) continue;
      const key = rawKey.toLowerCase();
      const value = rawValue.toLowerCase();

      if (key === "clock") {
        const match = commonAYMChipFrequencies.find(([name]) => value.includes(name));
        if (match) {
          aymClockRate = match[1];
        } else {
          const normalized = value.replace(",", ".");
          const numeric = Number(normalized);
          if (Number.isFinite(numeric) && numeric > 0) {
            if (normalized.includes(".")) {
              //it's decimal, so we treat it as MHz
              aymClockRate = Math.round(numeric * 1_000_000);
            } else {
              //it's most likely an integer, so we treat it as Hz
              aymClockRate = Math.round(numeric);
            }
          }
        }
      }
      if (key === "layout") {
        const layoutIndex = commonAYMLayouts.indexOf(value as (typeof commonAYMLayouts)[number]);
        if (layoutIndex !== -1) aymLayout = layoutIndex;
      }
      if (key === "type") {
        if (value === "ym") aymType = 1;
        if (value === "ay") aymType = 0;
      }
    }
  }

  return { aymClockRate, aymLayout, aymType };
}
