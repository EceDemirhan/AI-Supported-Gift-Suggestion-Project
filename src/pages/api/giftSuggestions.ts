/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
import type { NextApiRequest, NextApiResponse } from "next";

import { ensureWorkingLink } from "../../lib/links";

import { getGiftSuggestions } from "../../lib/openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST" });

  try {
    const form = req.body;

    const raw = await getGiftSuggestions(form); 

    // Linkleri doğrula/iyileştir
    const hardened = await Promise.all(
      (raw || []).slice(0, 3).map(async (x: any) => {
        const baslik = String(x?.baslik || "").trim();
        const aciklama = String(x?.aciklama || "").trim();
        const link = String(x?.link || "").trim();

        const workingLink = await ensureWorkingLink(link, baslik || aciklama || "hediye");
        return { baslik, aciklama, link: workingLink };
      })
    );

    return res.status(200).json({ ok: true, data: hardened });
  } catch (e: any) {
    const code = e?.status || e?.response?.status || 500;
    const msg = e?.message || "internal error";
    console.error("giftSuggestions api error:", code, msg);
    return res.status(code).json({ ok: false, error: msg });
  }
}
