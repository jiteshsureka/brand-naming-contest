"use client";

import { useRef, useState, type DragEvent } from "react";
import { submitEntry } from "@/app/actions";
import { isContestOpen } from "@/lib/contest-config";

const ACCEPTED = ".png,.jpg,.jpeg,.svg,.pdf";
const MAX_SIZE = 10 * 1024 * 1024;

export function SubmissionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ referenceCode: string } | null>(null);

  function handleFile(file: File | null) {
    setFileError(null);
    if (!file) {
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }
    if (file.size > MAX_SIZE) {
      setFileError("File must be under 10MB.");
      return;
    }
    setLogoFile(file);
    if (file.type.startsWith("image/")) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(null);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  }

  async function onSubmit(formData: FormData) {
    setError(null);
    if (!isContestOpen()) {
      setError("The contest is now closed. Thank you to everyone who participated.");
      return;
    }
    if (logoFile) formData.set("logo", logoFile);
    setPending(true);
    const res = await submitEntry(formData);
    setPending(false);
    if (res.ok) {
      setResult({ referenceCode: res.referenceCode });
    } else {
      setError(res.error);
    }
  }

  if (result) {
    return (
      <div className="panel p-10 text-center">
        <h3 className="text-2xl font-semibold text-gradient">You&rsquo;re In.</h3>
        <p className="mt-3 text-muted max-w-md mx-auto">
          Your idea has been submitted successfully. Now let&rsquo;s see if
          you&rsquo;ve named our next chapter.
        </p>
        <p className="mt-6 font-mono text-sm text-muted">
          Reference: <span className="text-white">{result.referenceCode}</span>
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={onSubmit} className="panel p-6 sm:p-10 space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your Name" name="fullName" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Phone Number" name="phone" type="tel" required autoComplete="tel" />
        <Field label="Optional Tagline" name="tagline" helper="If your name has a tagline, we'd love to see it." />
      </div>

      <div>
        <label htmlFor="brandName" className="block text-sm font-medium mb-2">
          Proposed Brand Name <span className="text-accent">*</span>
        </label>
        <textarea
          id="brandName" name="brandName" required rows={2}
          className="w-full rounded-xl bg-black/30 border border-panel-border px-4 py-3 focus:outline-none focus:border-accent"
        />
        <p className="mt-1.5 text-xs text-muted">Short, memorable and easy to build a global technology brand around.</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Logo <span className="text-accent">*</span>
        </label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
            dragOver ? "border-accent bg-accent-soft" : "border-panel-border hover:border-accent/50"
          }`}
          onClick={() => document.getElementById("logo-input")?.click()}
        >
          <input
            id="logo-input" type="file" accept={ACCEPTED} className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          {logoFile ? (
            <div className="flex items-center justify-center gap-4">
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoPreview} alt="Logo preview" className="h-16 w-16 object-contain rounded-lg bg-white/5" />
              ) : (
                <span className="text-2xl">📄</span>
              )}
              <span className="text-sm">{logoFile.name}</span>
            </div>
          ) : (
            <p className="text-sm text-muted">
              Drag and drop your logo, or click to browse<br />
              <span className="text-xs">PNG, JPG, SVG or PDF · up to 10MB</span>
            </p>
          )}
        </div>
        {fileError && <p className="mt-1.5 text-xs text-red-400">{fileError}</p>}
      </div>

      <TextArea label="Why This Name?" name="whyName" placeholder="Explain your idea in 1–3 lines." required />
      <TextArea label="Why This Logo?" name="whyLogo" placeholder="Explain the visual idea in 1–3 lines." required />
      <Field label="Optional Portfolio / Social Link" name="portfolioUrl" type="url" />

      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="agreed" value="true" required className="mt-1 accent-[var(--accent)]" />
        I confirm that this submission is my original work and I agree to the contest terms.
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-accent px-6 py-3.5 font-medium text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Submitting…" : "Submit My Idea →"}
      </button>
    </form>
  );
}

function Field({
  label, name, type = "text", required, autoComplete, helper,
}: { label: string; name: string; type?: string; required?: boolean; autoComplete?: string; helper?: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name} name={name} type={type} required={required} autoComplete={autoComplete}
        className="w-full rounded-xl bg-black/30 border border-panel-border px-4 py-3 focus:outline-none focus:border-accent"
      />
      {helper && <p className="mt-1.5 text-xs text-muted">{helper}</p>}
    </div>
  );
}

function TextArea({
  label, name, placeholder, required,
}: { label: string; name: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <textarea
        id={name} name={name} required={required} placeholder={placeholder} rows={3}
        className="w-full rounded-xl bg-black/30 border border-panel-border px-4 py-3 focus:outline-none focus:border-accent placeholder:text-muted/60"
      />
    </div>
  );
}
