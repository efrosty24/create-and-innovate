"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { PasswordInput } from "@/app/components/PasswordInput";
import { createClient } from "@/lib/supabase/client";

export default function PreferencesPage() {
  const { user, updateProfile, updatePassword } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
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
    const updates: {
      first_name?: string;
      last_name?: string;
      email?: string;
      username?: string;
      avatar_url?: string;
    } = {};
    if (firstName.trim() !== (user?.first_name ?? "")) updates.first_name = firstName.trim() || undefined;
    if (lastName.trim() !== (user?.last_name ?? "")) updates.last_name = lastName.trim() || undefined;
    if (email.trim() !== (user?.email ?? "")) updates.email = email.trim() || undefined;
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
        Edit your profile picture, name, email, username, and password.
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
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-white/20 bg-white/5 hover:border-[#ff6b35] hover:bg-white/10 transition-colors"
            >
              {avatarPreview ? (
                <span className="relative block h-full w-full">
                  <Image
                    src={avatarPreview}
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized={avatarPreview.startsWith("blob:")}
                    sizes="96px"
                  />
                </span>
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
            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:flex-wrap">
              <div className="min-w-0 flex-1">
                <label htmlFor="firstName" className="block text-sm font-medium text-zinc-300">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-2 w-full max-w-xs rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
                  placeholder="First name"
                />
              </div>
              <div className="min-w-0 flex-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-zinc-300">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-2 w-full max-w-xs rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
                  placeholder="Last name"
                />
              </div>
              <div className="min-w-0 flex-1">
                <label htmlFor="prefs-email" className="block text-sm font-medium text-zinc-300">
                  Email
                </label>
                <input
                  id="prefs-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full max-w-xs rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
                  placeholder="you@example.com"
                />
              </div>
              <div className="min-w-0 flex-1">
                <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-2 w-full max-w-xs rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
                  placeholder="Display name"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 rounded-full bg-[#ff6b35] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#e85a2a] hover:scale-[1.02] active:scale-[0.99] transition-all"
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
            <PasswordInput
              id="password"
              label="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              placeholder="At least 6 characters"
              className="mt-2 w-full max-w-xs rounded-lg border border-white/10 bg-black/20 px-4 py-3 pr-12 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
            />
            <PasswordInput
              id="passwordConfirm"
              label="Confirm new password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Repeat password"
              className="mt-2 w-full max-w-xs rounded-lg border border-white/10 bg-black/20 px-4 py-3 pr-12 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
            />
          </div>
          <button
            type="submit"
            className="mt-6 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 hover:scale-[1.02] active:scale-[0.99] transition-all"
          >
            Update password
          </button>
        </section>
      </form>
    </div>
  );
}
