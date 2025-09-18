// src/lib/server/sanitize.ts
// Minimal, dependency-free sanitization helpers for server-side use

export function normalizeEmail(raw: string | null | undefined): string {
  if (!raw) return '';
  return String(raw).trim().toLowerCase();
}

export function sanitizeName(raw: string | null | undefined): string {
  if (!raw) return '';
  const trimmed = String(raw).trim();
  // collapse multiple spaces
  return trimmed.replace(/\s{2,}/g, ' ').slice(0, 100);
}

export function sanitizePassword(raw: string | null | undefined): string {
  if (!raw) return '';
  // do not alter content other than trimming to avoid breaking user input
  return String(raw).trim();
}

export function isLikelyValidEmail(email: string): boolean {
  if (!email) return false;
  // simple but robust email regex; keep server-side light-weight
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function passwordMeetsBaselinePolicy(password: string): boolean {
  if (!password || password.length < 8) return false;
  // baseline: at least 8 chars; add stricter policy later if needed
  return true;
}


