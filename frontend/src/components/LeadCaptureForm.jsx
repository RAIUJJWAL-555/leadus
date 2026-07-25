import { useState } from "react";
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

export default function LeadCaptureForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", email: "", budget: "", message: "" },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post("/leads", data);
      setSuccess(true);
      reset();
    } catch (err) {
      const msg =
        err.response?.data?.error || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors";
  const label = "block mb-2 text-sm font-medium text-neutral-300";
  const errorText = "mt-1.5 text-sm text-danger";

  return (
    <div id="form" className="mx-auto w-full max-w-xl rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-8 shadow-2xl">
      <h2 className="mb-2 text-2xl font-semibold text-white">
        Get in Touch
      </h2>
      <p className="mb-8 text-neutral-500">
        Tell us about your project and we'll get back to you within 24 hours.
      </p>

      {success && (
        <div className="mb-6 rounded-lg px-4 py-3 text-sm text-success">
          Lead submitted successfully! We'll be in touch soon.
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
            rows={4}
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
          className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
  );
}
