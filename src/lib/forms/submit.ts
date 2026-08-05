import type { SubmitResult } from "./types";

/**
 * Placeholder submit — no backend/service is wired up yet (no Formspree/EmailJS/Getform).
 * Swap the body of this function for a real request once a backend is chosen.
 */
export async function submitFormPlaceholder<T extends Record<string, string>>(
  _data: T
): Promise<SubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ok: true };
}
