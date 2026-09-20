export type SportsStoryKind = "match" | "transfer" | "controversy" | "other";

const MATCH_RE = /ম্যাচ|খেলা|ইনিংস|ওভার|গোল|সেট|ফাইনাল|সেমিফাইনাল|টেস্ট|ওডিআই|টি.?টোয়েন্টি|টি.?টোয়েন্টি|premier league|world cup|fixture|result|score|innings|wicket/i;
const TRANSFER_RE = /ট্রান্সফার|চুক্তি|সাইন|রিলিজ|টিম চেঞ্জ|দল বদল|loan|transfer|contract|signing|released|retain/i;
const CONTROVERSY_RE = /বিতর্ক|অভিযোগ|নিষেধাজ্ঞা|ব্যান|সন্দেহ|ব্যাটিং অর্ডার বিতর্ক|দালাল|ম্যাচ ফিক্সিং|doping|ban|controversy|allegation|protest/i;

export function classifySportsStory(title: string, excerpt = ""): SportsStoryKind {
  const text = `${title} ${excerpt}`;
  if (CONTROVERSY_RE.test(text)) return "controversy";
  if (TRANSFER_RE.test(text)) return "transfer";
  if (MATCH_RE.test(text)) return "match";
  return "other";
}

export function sportsResearchPath(kind: SportsStoryKind): string {
  if (kind === "match") {
    return [
      "STORY TYPE: MATCH.",
      "Research path: event → source coverage → related coverage → chronology → unresolved questions.",
      "Record the fixture, venue, date/time, result and individual performances ONLY if a supplied source states them.",
      "If two sources give different scores, overs, goal-scorers or line-ups, keep both claims attributed and flag for review.",
    ].join(" ");
  }
  if (kind === "transfer") {
    return [
      "STORY TYPE: TRANSFER / PERSONNEL NEWS.",
      "Research path: player/team → multiple sources → source comparison → confirmed vs rumoured.",
      "Do not treat a single-outlet rumour as a completed transfer, signing, injury or selection.",
      "Separate club statement, player comment, agent claim and speculative reporting.",
    ].join(" ");
  }
  if (kind === "controversy") {
    return [
      "STORY TYPE: CONTROVERSY.",
      "Research path: claim → responses → counter-claims → chronology → what remains unverified.",
      "Do not adjudicate. Do not invent motive. Keep each party's wording attributed.",
    ].join(" ");
  }
  return [
    "STORY TYPE: SPORTS NEWS.",
    "Compare sources, keep chronology, and mark single-source claims as unverified.",
  ].join(" ");
}

export const SPORTS_NEWSROOM_RULES = [
  "You work for KhelaTV / খেলাটিভি, a Bangladesh Bangla sports newsroom.",
  "Write in natural Bangladesh Bangla (bn-BD). Use correct sports terminology. No India-Bengali wording.",
  "Never invent team, player, coach, referee or official names.",
  "Never invent scores, match results, tables, rankings, overs, goals, assists, cards, injuries, availability, transfers, fees, tournaments, dates or venues.",
  "Never present one source's claim as an independently verified fact.",
  "If scores, squads, times or venues conflict, keep both sides attributed and set a review flag.",
  "When multiple sources exist, check chronology and factual consistency before synthesising.",
  "Avoid clickbait, trash-talk, and exaggerated sports language. Stay restrained and factual.",
].join("\n");
