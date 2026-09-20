export const TRUSTED_DISCOVERY_DOMAINS = [
  "bbc.com",
  "bbc.co.uk",
  "espncricinfo.com",
  "espn.com",
  "theguardian.com",
  "reuters.com",
  "skysports.com",
  "icc-cricket.com",
  "fifa.com",
  "prothomalo.com",
  "tbsnews.net",
  "thedailystar.net",
  "bcb.com.bd",
  "bff.com.bd",
] as const;

export function hostnameOf(urlOrHost: string): string {
  try {
    const value = urlOrHost.includes("://") ? urlOrHost : `https://${urlOrHost}`;
    return new URL(value).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return urlOrHost.replace(/^www\./, "").toLowerCase();
  }
}

export function isTrustedDiscoveryDomain(urlOrHost: string): boolean {
  const host = hostnameOf(urlOrHost);
  return TRUSTED_DISCOVERY_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

export function googleNewsSiteFilter(): string {
  return [
    "site:bbc.com/sport",
    "site:espncricinfo.com",
    "site:prothomalo.com/sports",
    "site:thedailystar.net/sports",
    "site:tbsnews.net",
    "site:icc-cricket.com",
  ].join(" OR ");
}
