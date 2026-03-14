"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

export default function PreferencesPage() {
  const { user, updateProfile, updatePassword } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url ?? null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please choose an image file." });
      return;
    }
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const updates: { username?: string; avatar_url?: string } = {};
    if (username.trim() !== (user?.username ?? "")) updates.username = username.trim() || undefined;

    const supabase = createClient();
    if (avatarFile && supabase?.auth) {
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      if (u) {
        const ext = avatarFile.name.split(".").pop() || "jpg";
        const path = `${u.id}/avatar.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true });
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
          updates.avatar_url = urlData.publicUrl;
        }
      }
    }

    if (Object.keys(updates).length === 0 && !avatarFile) {
      setMessage({ type: "success", text: "No changes to save." });
      return;
    }
    const ok = await updateProfile(updates);
    if (ok) {
      setMessage({ type: "success", text: "Profile updated." });
      setAvatarFile(null);
    } else {
      setMessage({ type: "error", text: "Could not update profile. Is Supabase configured?" });
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (password !== passwordConfirm) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    const ok = await updatePassword(password);
    if (ok) {
      setMessage({ type: "success", text: "Password updated." });
      setPassword("");
      setPasswordConfirm("");
    } else {
      setMessage({ type: "error", text: "Could not update password. Is Supabase configured?" });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">Preferences</h1>
      <p className="mt-2 text-zinc-400">
        Edit your profile picture, username, and password.
      </p>

      {message && (
        <p
          className={`mt-6 rounded-lg px-4 py-2 text-sm ${
            message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Profile: avatar + username */}
      <form onSubmit={handleSubmitProfile} className="mt-8 space-y-6">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium text-white">Profile</h2>

          <div className="mt-6 flex items-center gap-6">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white/20 bg-white/5 hover:border-[#ff6b35] transition-colors"
            >
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized={avatarPreview.startsWith("blob:")}
                  width={96}
                  height={96}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-3xl text-zinc-500">
                  👤
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div className="flex-1">
              <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full max-w-xs rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
                placeholder="Your display name"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 rounded-full bg-[#ff6b35] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#e85a2a] transition-colors"
          >
            Save profile
          </button>
        </section>
      </form>

      {/* Password */}
      <form onSubmit={handleSubmitPassword} className="mt-8">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium text-white">Change password</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                New password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="mt-2 w-full max-w-xs rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-zinc-300">
                Confirm new password
              </label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="mt-2 w-full max-w-xs rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
                placeholder="Repeat password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-colors"
          >
            Update password
          </button>
        </section>
      </form>
    </div>
  );
}
