"use client";

import { useState } from "react";
import { supabase } from "@/app/config/supabaseClient";
import { useRouter } from "next/navigation";
import { FaSlack } from "react-icons/fa";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else router.push("/");
  };

  const handleSlackLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "slack_oidc",
    });
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else router.push("/");
  };

  return (
    <form className="flex flex-col gap-4 w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-2xl p-8">
      <h2 className="text-2xl font-semibold text-gray-900 text-left">
        LabGoat: iGEM LIMS
      </h2>
      <p className="text-sm text-gray-500 text-left mb-2">
        Please log in or create an account to continue
      </p>

      <input
        className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        type="button"
        onClick={handleLogin}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 shadow-md"
      >
        Login
      </button>

      <div className="flex items-center justify-between">
        <hr className="w-full border-gray-200" />
        <span className="mx-4 text-gray-400 text-sm">or</span>
        <hr className="w-full border-gray-200" />
      </div>

      <button
        type="button"
        onClick={handleSlackLogin}
        className="w-full flex items-center justify-center gap-2 bg-[#4A154B] hover:bg-[#3e1140] text-white font-medium py-3 rounded-lg transition duration-200 shadow-md"
      >
        <FaSlack className="text-lg" /> Login with Slack
      </button>

      <button
        type="button"
        onClick={handleSignup}
        className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 rounded-lg transition duration-200"
      >
        Create account
      </button>
    </form>
  );
}
