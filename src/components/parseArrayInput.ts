export const MAX_COUNT = 200;

export type ParseResult =
  | { ok: true; values: number[] }
  | { ok: false; error: string };

/**
 * Turns whatever the user typed into the list of bar heights.
 *
 * Separators are deliberately permissive: **any run of non-digit characters**
 * splits two numbers. That is not laziness, it is the whole point. On a phone
 * the numeric keypad offers no comma and no space, so a parser that insists on
 * `, ` or ` ` is one a mobile visitor physically cannot satisfy — they type
 * digits, get told to "separate with spaces or commas", and leave. Accepting
 * whatever separator their keyboard actually gives them removes that dead end.
 *
 * Because every part is digits-only by construction, the array is always
 * positive integers — which is exactly what the bar chart needs.
 */
export function parseArrayInput(raw: string): ParseResult {
  const parts = raw.split(/\D+/).filter(Boolean);

  if (parts.length < 2) {
    return { ok: false, error: 'Enter at least 2 numbers.' };
  }
  if (parts.length > MAX_COUNT) {
    return { ok: false, error: `That's too many — max ${MAX_COUNT} numbers.` };
  }

  const values: number[] = [];
  for (const part of parts) {
    const n = Number(part);
    // Digit runs long enough to lose precision would break the chart's scale.
    if (!Number.isSafeInteger(n)) {
      return { ok: false, error: `"${part}" is too large to chart.` };
    }
    if (n <= 0) {
      return { ok: false, error: 'Use numbers above zero — they set the bar heights.' };
    }
    values.push(n);
  }

  return { ok: true, values };
}
