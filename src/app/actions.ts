"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isContestOpen, REQUIRE_LOGO } from "@/lib/contest-config";

export type SubmitResult =
  | { ok: true; referenceCode: string }
  | { ok: false; error: string };

function makeReferenceCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `NX-${code}`;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "application/pdf"];
const MAX_SIZE = 10 * 1024 * 1024;

export async function submitEntry(formData: FormData): Promise<SubmitResult> {
  if (!isContestOpen()) {
    return { ok: false, error: "The contest is now closed. Thank you to everyone who participated." };
  }

  const { userId } = await auth();
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
      return { ok: false, error: "Logo must be under 10MB." };
    }
  }

  const { data: existing } = await supabaseAdmin
    .from("submissions")
    .select("reference_code")
    .eq("clerk_user_id", userId)
    .maybeSingle();
  if (existing) {
    return { ok: false, error: "You've already submitted an entry. One submission per person." };
  }

  const referenceCode = makeReferenceCode();
  const ext = logo!.name.split(".").pop() || "png";
  const path = `${userId}/${referenceCode}.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("logos")
    .upload(path, logo!, { contentType: logo!.type, upsert: false });
  if (uploadError) {
    return { ok: false, error: "Failed to upload logo. Please try again." };
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from("logos").getPublicUrl(path);

  const { data: submission, error: insertError } = await supabaseAdmin
    .from("submissions")
    .insert({
      clerk_user_id: userId,
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
    return { ok: false, error: "Failed to save your submission. Please try again." };
  }

  return { ok: true, referenceCode };
}
