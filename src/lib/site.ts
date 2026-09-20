export const SITE_NAME = "KhelaTV";
export const SITE_NAME_BN = "খেলাটিভি";
export const SITE_DOMAIN = "khelatv.com";
export const SITE_URL = "https://khelatv.com";
export const SITE_TAGLINE = "বাংলাদেশের খেলা, নির্ভরযোগ্য বাংলায়";
export const SITE_DESCRIPTION =
  "KhelaTV / খেলাটিভি — ক্রিকেট, ফুটবল, টেনিস, অ্যাথলেটিক্সসহ বাংলাদেশি ও আন্তর্জাতিক খেলার খবর, বিশ্লেষণ ও ফিচার।";
export const DEFAULT_CATEGORY_SLUG = "cricket";
export const SITE_EMAIL = "editor@khelatv.com";
export const SITE_PHONE = "+8801819525247";
export const SITE_EDITOR = "সোহেইল জাফর";
export const SITE_ADDRESS = "ঢাকা, বাংলাদেশ";
export const FACEBOOK_URL = "https://www.facebook.com/khelatv";
export const YOUTUBE_URL = "https://www.youtube.com/@khelatv";
export const DESK_USER_AGENT = "KhelaTVDesk/1.0 (+https://khelatv.com)";

export function pageTitle(title?: string | null) {
  const value = (title || "").trim();
  return value ? `${value} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_NAME_BN}`;
}
