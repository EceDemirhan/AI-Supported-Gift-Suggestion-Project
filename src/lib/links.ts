/* eslint-disable prettier/prettier */
// src/lib/links.ts

// --- Helpers ---------------------------------------------------------------

function toSafeString(v?: string | null): string {
  return (v ?? "").toString().trim();
}

function repairUrl(raw?: string | null): string | null {
  const input = toSafeString(raw);
  if (!input) return null;

  let u = input;


  if (!/^https?:\/\//i.test(u)) u = `https://${  u.replace(/^\/+/, "")}`;

  u = u.replace(/^https?:\/\/https?:\/\//i, (m) => m.replace(/https?:\/\//i, ""));

  try {
    const url = new URL(u);

    if (!["http:", "https:"].includes(url.protocol)) return null;


    if (url.protocol === "http:") {
      url.protocol = "https:";
    }

    return url.toString();
  } catch {
    return null;
  }
}

export async function urlExists(url: string, timeoutMs = 4000): Promise<boolean> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);

  try {
    const head = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: ac.signal,
    });
    clearTimeout(t);
    if (head.ok) return true;
  } catch {
    // HEAD başarısız olabilir get denenebilir
  }

  const ac2 = new AbortController();
  const t2 = setTimeout(() => ac2.abort(), timeoutMs);

  try {
    const get = await fetch(url, {
      method: "GET",
      headers: { Range: "bytes=0-0" }, 
      redirect: "follow",
      signal: ac2.signal,
    });
    clearTimeout(t2);
    return get.ok;
  } catch {
    clearTimeout(t2);
    return false;
  }
}

function encodeQ(q?: string | null) {
  return encodeURIComponent(toSafeString(q).replace(/\s+/g, " "));
}

export function buildSearchFallbacks(title?: string | null): string[] {
  const q = encodeQ(title || "");
  return [
    `https://www.amazon.com.tr/s?k=${q}`,
    `https://www.trendyol.com/sr?q=${q}`,
    `https://www.hepsiburada.com/ara?q=${q}`,
    `https://www.n11.com/arama?q=${q}`,
    `https://www.mediamarkt.com.tr/tr/search.html?query=${q}`,
    `https://www.teknosa.com/arama?q=${q}`,
    `https://www.dr.com.tr/search?q=${q}`,
    `https://www.google.com/search?q=${q}`,
  ];
}


export async function ensureWorkingLink(
  wantedUrl?: string | null,
  titleForSearch?: string | null
): Promise<string> {
  const fixed = repairUrl(wantedUrl);
  if (fixed && (await urlExists(fixed))) return fixed;

  const candidates = buildSearchFallbacks(titleForSearch);
  // eslint-disable-next-line no-restricted-syntax
  for (const c of candidates) {
    if (await urlExists(c)) return c;
  }
  // Teoride hiçbiri patlamaz; yine de ilkini ver
  return candidates[0] ?? "";
}
