export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://qualfi.co.uk";
export const INSTAGRAM_URL = "https://instagram.com/qualfiapp";
export const INSTAGRAM_DM_URL = "https://ig.me/m/qualfiapp";
export const SUPPORT_EMAIL = "scalixvip@gmail.com";

export const THEME_STORAGE_KEY = "qualfi-theme";
export const THEME_CHANGE_EVENT = "qualfi-theme-change";

export type Sex = "male" | "female";
export type Days = 2 | 3 | 4 | 5 | 6;
export type Phase = "idle" | "sending" | "sent";

export const SEX_OPTIONS: readonly Sex[] = ["female", "male"];
export const TRAINING_DAYS: readonly Days[] = [2, 3, 4, 5, 6];
export const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"] as const;
export const TYPING_DOT_DELAYS = [0, 150, 300] as const;
export const TOTAL_DIAGNOSTIC_STEPS = 4;
