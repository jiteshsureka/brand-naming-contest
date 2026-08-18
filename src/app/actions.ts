"use server";

import { auth0 } from "@/lib/auth0";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isContestOpen, REQUIRE_LOGO, MAX_SUBMISSIONS_PER_PERSON } from "@/lib/contest-config";

export type SubmitResult =
  | { ok: true; referenceCode: string; remaining: number }
  | { ok: false; error: string };

function makeReferenceCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `NX-${code}`;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "application/pdf"];
const MAX_SIZE = 4 * 1024 * 1024;

export async function submitEntry(formData: FormData): Promise<SubmitResult> {
  if (!isContestOpen()) {
    return { ok: false, error: "The contest is now closed. Thank you to everyone who participated." };
  }

  const session = await auth0.getSession();
  const userId = session?.user?.sub;
  if (!userId) {
    return { ok: false, error: "Please sign in to submit your idea." };
  }

  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const brandName = String(formData.get("brandName") || "").trim();
  const whyName = String(formData.get("whyName") || "").trim();
  const whyLogo = String(formData.get("whyLogo") || "").trim();
  const tagline = String(formData.get("tagline") || "").trim();
  const portfolioUrl = String(formData.get("portfolioUrl") || "").trim();
  const agreed = formData.get("agreed") === "true";
  const logo = formData.get("logo") as File | null;

  if (!fullName || !email || !phone || !brandName || !whyName || !whyLogo) {
    return { ok: false, error: "Please fill in all required fields." };
  }
  if (!agreed) {
    return { ok: false, error: "Please confirm this is your original work." };
  }
  if (REQUIRE_LOGO && (!logo || logo.size === 0)) {
    return { ok: false, error: "Please upload a logo file." };
  }
  if (logo && logo.size > 0) {
    if (!ACCEPTED_TYPES.includes(logo.type)) {
      return { ok: false, error: "Logo must be PNG, JPG, SVG or PDF." };
    }
    if (logo.size > MAX_SIZE) {
      return { ok: false, error: "Logo must be under 4MB." };
    }
  }

  const { count: existingCount } = await supabaseAdmin
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("auth_user_id", userId);
  if ((existingCount ?? 0) >= MAX_SUBMISSIONS_PER_PERSON) {
    return {
      ok: false,
      error: `You've already submitted ${MAX_SUBMISSIONS_PER_PERSON} entries — that's the max per person.`,
    };
  }

  const referenceCode = makeReferenceCode();
  const ext = logo!.name.split(".").pop() || "png";
  // Auth0 ids like "google-oauth2|123" contain '|', which Storage object keys reject.
  const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const path = `${safeUserId}/${referenceCode}.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("logos")
    .upload(path, logo!, { contentType: logo!.type, upsert: false });
  if (uploadError) {
    console.error("logo upload failed:", uploadError);
    return { ok: false, error: "Failed to upload logo. Please try again." };
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from("logos").getPublicUrl(path);

  const { data: submission, error: insertError } = await supabaseAdmin
    .from("submissions")
    .insert({
      auth_user_id: userId,
      reference_code: referenceCode,
      brand_name: brandName,
      why_name: whyName,
      why_logo: whyLogo,
      tagline: tagline || null,
      portfolio_url: portfolioUrl || null,
      logo_url: publicUrlData.publicUrl,
      logo_path: path,
    })
    .select("id")
    .single();

  if (insertError || !submission) {
    console.error("submission insert failed:", insertError);
    await supabaseAdmin.storage.from("logos").remove([path]);
    return { ok: false, error: "Failed to save your submission. Please try again." };
  }

  const { error: contactError } = await supabaseAdmin.from("submission_contacts").insert({
    submission_id: submission.id,
    full_name: fullName,
    email,
    phone,
  });
  if (contactError) {
    console.error("contact insert failed:", contactError);
    return { ok: false, error: "Failed to save your submission. Please try again." };
  }

  return { ok: true, referenceCode, remaining: MAX_SUBMISSIONS_PER_PERSON - (existingCount ?? 0) - 1 };
}

export type MyVotesResult = { signedIn: boolean; votes: Record<string, 1 | -1> };

export async function getMyVotes(): Promise<MyVotesResult> {
  const session = await auth0.getSession();
  const userId = session?.user?.sub;
  if (!userId) return { signedIn: false, votes: {} };

  const { data } = await supabaseAdmin.from("votes").select("submission_id, value").eq("voter_user_id", userId);
  const votes = Object.fromEntries((data ?? []).map((v) => [v.submission_id, v.value as 1 | -1]));
  return { signedIn: true, votes };
}

export type VoteResult =
  | { ok: true; myVote: 1 | -1 | 0; upvotes: number; downvotes: number }
  | { ok: false; error: string };

export async function castVote(submissionId: string, value: 1 | -1): Promise<VoteResult> {
  const session = await auth0.getSession();
  const userId = session?.user?.sub;
  if (!userId) {
    return { ok: false, error: "Please sign in to vote." };
  }

  const { data: existing } = await supabaseAdmin
    .from("votes")
    .select("value")
    .eq("submission_id", submissionId)
    .eq("voter_user_id", userId)
    .maybeSingle();

  let myVote: 1 | -1 | 0;
  if (existing?.value === value) {
    await supabaseAdmin.from("votes").delete().eq("submission_id", submissionId).eq("voter_user_id", userId);
    myVote = 0;
  } else {
    await supabaseAdmin
      .from("votes")
      .upsert(
        { submission_id: submissionId, voter_user_id: userId, value },
        { onConflict: "submission_id,voter_user_id" }
      );
    myVote = value;
  }

  const { data: row } = await supabaseAdmin
    .from("submissions")
    .select("upvotes, downvotes")
    .eq("id", submissionId)
    .single();

  return { ok: true, myVote, upvotes: row?.upvotes ?? 0, downvotes: row?.downvotes ?? 0 };
}
