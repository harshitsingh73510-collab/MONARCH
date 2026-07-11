import { NextResponse } from "next/server";

/**
 * Contact intake. Validates the request and accepts it.
 *
 * To actually deliver these (email/CRM), wire a provider here — e.g. Resend:
 *   const { Resend } = await import("resend");
 *   await new Resend(process.env.RESEND_API_KEY).emails.send({ ... });
 * Add RESEND_API_KEY in the Vercel project env and it goes live with no
 * front-end changes.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const company = String(body?.company ?? "").trim();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !company || !emailOk) {
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 }
      );
    }

    // For now, record the lead server-side. Replace with real delivery.
    console.log("[monarch] access request:", { name, company, email });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
