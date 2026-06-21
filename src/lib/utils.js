/**
 * Format a large number to a compact string.
 * 413 → "413"  |  4977 → "4.9K"  |  1200000 → "1.2M"
 */
export function formatCount(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000) {
    const v = (n / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return v + "M";
  }
  if (n >= 1_000) {
    const v = (n / 1_000).toFixed(1).replace(/\.0$/, "");
    return v + "K";
  }
  return String(n);
}

/**
 * Returns true if the given ISO date string is within `days` days of now.
 */
export function isNew(dateStr, days = 7) {
  if (!dateStr) return false;
  const ms = Date.now() - new Date(dateStr).getTime();
  return ms >= 0 && ms <= days * 24 * 60 * 60 * 1000;
}
