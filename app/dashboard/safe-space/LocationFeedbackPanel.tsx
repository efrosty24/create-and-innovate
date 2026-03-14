"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useLocationFeedback } from "./useSafeData";
import { feedbackAuthorName } from "@/types/safe";
import type { SafeLocation } from "@/types/safe";
import type { SafeArea } from "@/types/safe";

type Props = {
  safeLocation: SafeLocation | null;
  safeArea: SafeArea | null;
  onClose: () => void;
};

export default function LocationFeedbackPanel({ safeLocation, safeArea, onClose }: Props) {
  const { user } = useAuth();
  const { feedback, loading, addFeedback, refetch } = useLocationFeedback(
    safeLocation?.id ?? null,
    safeArea?.id ?? null
  );
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const name = safeLocation?.establishment_name ?? safeArea?.name ?? "this place";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setSubmitting(true);
    const ok = await addFeedback(content.trim());
    setSubmitting(false);
    if (ok) setContent("");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Comments & feedback — {name}</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-zinc-500">Loading comments…</p>
      ) : feedback.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">No comments yet. Be the first to share feedback.</p>
      ) : (
        <ul className="mt-4 space-y-3 max-h-60 overflow-y-auto">
          {feedback.map((f) => (
            <li key={f.id} className="rounded-lg border border-white/5 bg-black/20 p-3">
              <p className="text-sm text-white">{f.content}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {feedbackAuthorName(f)} · {new Date(f.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      {user ? (
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share a comment or feedback…"
            rows={2}
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35] resize-none"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="rounded-full bg-[#ff6b35] px-4 py-2 text-sm font-medium text-white hover:bg-[#e85a2a] disabled:opacity-50 transition-all"
            >
              {submitting ? "Posting…" : "Post"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm text-zinc-500">Sign in to post a comment.</p>
      )}
    </div>
  );
}
