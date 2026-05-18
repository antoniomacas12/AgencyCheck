/**
 * lib/bot-detection.ts
 *
 * Lightweight bot / crawler detection based on User-Agent.
 * Used by API routes that should never track or redirect bots.
 */

// Known crawlers, scrapers, link-preview fetchers, and automation tools.
// Checked case-insensitively against the raw User-Agent string.
const BOT_PATTERNS: RegExp[] = [
  // Search engine crawlers
  /googlebot/i,
  /bingbot/i,
  /slurp/i,           // Yahoo
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /sogou/i,
  /exabot/i,
  /applebot/i,
  /petalbot/i,
  /seznambot/i,

  // AI crawlers
  /perplexitybot/i,   // Perplexity AI
  /gptbot/i,          // OpenAI
  /claudebot/i,       // Anthropic
  /bytespider/i,      // ByteDance / TikTok
  /amazonbot/i,       // Amazon
  /cohere-ai/i,       // Cohere
  /diffbot/i,

  // SEO / analytics tools
  /mj12bot/i,         // Majestic
  /ahrefsbot/i,
  /semrushbot/i,
  /dotbot/i,
  /blexbot/i,
  /rogerbot/i,        // Moz
  /screaming.frog/i,

  // Social media link previews (do NOT redirect these to WA)
  /facebot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /telegrambot/i,
  /discordbot/i,
  /slackbot/i,
  /whatsapp/i,        // WA itself fetches OG tags when a link is shared

  // Archive / cache
  /ia_archiver/i,     // Wayback Machine
  /archive\.org_bot/i,

  // Generic automation / scripting (never a real candidate)
  /python-requests/i,
  /python-urllib/i,
  /go-http-client/i,
  /node-fetch/i,
  /axios/i,
  /okhttp/i,
  /libwww-perl/i,
  /java\//i,
  /curl\//i,
  /wget\//i,
  /httpie/i,
  /insomnia/i,
  /postman/i,
];

/**
 * Returns true if the User-Agent belongs to a known bot / crawler / preview fetcher.
 * A missing (null / empty) User-Agent is also treated as a bot.
 */
export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent || userAgent.trim() === "") return true;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

/**
 * Reads the User-Agent from a NextRequest and returns whether it looks like a bot.
 */
export function isBotRequest(req: { headers: { get(name: string): string | null } }): boolean {
  const ua = req.headers.get("user-agent");
  return isBot(ua);
}
