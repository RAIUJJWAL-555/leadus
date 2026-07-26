import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema } from "../lib/validation.js";
import api from "../lib/api.js";

const budgetLabels = {
  under_1k: "Under $1k",
  "1k_5k": "$1k – $5k",
  "5k_20k": "$5k – $20k",
  "20k_plus": "$20k+",
};

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors =
    type === "success"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
      : "border-red-500/40 bg-red-500/10 text-red-400";

  return (
    <div className="pointer-events-auto fixed bottom-6 right-6 z-50 animate-[slideUp_0.3s_ease-out]">
      <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${colors}`}>
        {type === "success" ? (
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
        ) : (
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
        )}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">&times;</button>
      </div>
    </div>
  );
}

export default function LeadCaptureForm() {
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", email: "", budget: "", message: "" },
  });

  const showToast = useCallback((message, type) => {
    setToast({ message, type, key: Date.now() });
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      await api.post("/api/leads", data);
      showToast("Lead submitted successfully! We'll be in touch soon.", "success");
      reset();
    } catch (err) {
      const raw = err.response?.data?.error ?? err.message ?? "Something went wrong.";
      const msg = typeof raw === "string" ? raw : JSON.stringify(raw);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-2.5 text-white placeholder:text-neutral-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-sm";
  const label = "block mb-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider";
  const errorText = "mt-1 text-xs text-danger";

  return (
    <>
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div id="form" className="mx-auto w-full max-w-4xl rounded-3xl border border-neutral-800 bg-[#0a0a0a] shadow-2xl flex flex-col md:flex-row overflow-hidden backdrop-blur-md">
        {/* Left Side: Cat Image Banner */}
        <div className="relative hidden md:flex md:w-5/12 bg-black flex-col justify-end p-8 overflow-hidden min-h-[450px]">
          {/* Image */}
          <img
            src="/cat.jpg"
            alt="Roaring lead capture visual"
            className="absolute inset-0 w-full h-full object-cover opacity-75 transition-transform duration-700 hover:scale-105"
          />
          {/* Vignette overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

          {/* Banner text content */}
          <div className="relative z-10 space-y-2">
            <h3 className="text-xl font-black text-white leading-tight">
              Grow Your Agency.
              <br />
              Secure the Bag.
            </h3>
            <p className="text-xs text-neutral-400">
              A premium lead channel constructed for agencies who demand results.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 md:p-10 bg-[#0c0c0c]/80 flex flex-col justify-center">
          <h2 className="text-2xl font-black tracking-tight text-white mb-1">
            Get in Touch
          </h2>
          <p className="text-sm text-neutral-500 mb-6">
            Tell us about your project and we'll get back to you within 24 hours.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className={label}>
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Jane Doe"
                className={field}
                {...register("name")}
              />
              {errors.name && (
                <p className={errorText}>{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className={label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="jane@company.com"
                className={field}
                {...register("email")}
              />
              {errors.email && (
                <p className={errorText}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="budget" className={label}>
                Budget Range
              </label>
              <select
                id="budget"
                className={field + " appearance-none"}
                {...register("budget")}
              >
                <option value="">Select a range…</option>
                {Object.entries(budgetLabels).map(([value, text]) => (
                  <option key={value} value={value}>
                    {text}
                  </option>
                ))}
              </select>
              {errors.budget && (
                <p className={errorText}>{errors.budget.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className={label}>
                Message
              </label>
              <textarea
                id="message"
                rows={3}
                placeholder="Tell us about your project…"
                className={field + " resize-none"}
                {...register("message")}
              />
              {errors.message && (
                <p className={errorText}>{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
            >
              {submitting && (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
