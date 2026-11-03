import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Sanity webhook target: expires the cache whenever content is published.
// <SanityLive /> only revalidates while a visitor has the site open, so this
// is what keeps the site fresh when an editor publishes with nobody browsing.
// Setup (webhook URL, projection, secret) lives in apps/frontend/CLAUDE.md.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(
    req,
    secret,
    true,
  );
  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  // Pages tag their fetches by document type (see the `tags` passed to
  // sanityFetch), but a type can feed several pages — e.g. projects appear on
  // the home page — so also invalidate every route to be safe. The site is
  // small enough that this is cheap.
  if (body?._type) revalidateTag(body._type, { expire: 0 });
  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, type: body?._type ?? null });
}
