/**
 * Temporary type stubs for `botid` — used only until `npm i botid` is run.
 * Once the real package is installed, its own type declarations take precedence
 * and this file becomes a no-op (the installed types override it at resolution).
 *
 * @see https://vercel.com/docs/botid/get-started
 */

declare module "botid/client" {
  export interface BotIdProtectRule {
    path: string;
    method?: string;
  }

  export interface BotIdClientProps {
    protect: readonly BotIdProtectRule[];
  }

  /** Client-side challenge component — place in <head> of your root layout. */
  export function BotIdClient(props: BotIdClientProps): JSX.Element | null;
}

declare module "botid/server" {
  export interface BotIdVerification {
    /** true if the request is classified as a bot */
    isBot: boolean;
    /** present when Basic validation fails or no challenge token was found */
    error?: string;
  }

  /**
   * Call this on the server side (API route, Server Action, middleware) to
   * verify that the request came from a real browser that passed the BotID
   * client-side challenge.
   *
   * Basic mode (free): validates challenge integrity — catches most bots.
   * Deep Analysis (paid): ML model on top of Basic — catches sophisticated bots.
   */
  export function checkBotId(): Promise<BotIdVerification>;
}

declare module "botid/next/config" {
  import type { NextConfig } from "next";
  /** Wraps your Next.js config to add the BotID proxy rewrites automatically. */
  export function withBotId(config: NextConfig): NextConfig;
}
