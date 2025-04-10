"use client";

import { FaSlack, FaDiscord } from "react-icons/fa";
import { slackLogin, discordLogin } from "./action";

export default function AuthForm() {
  const handleSlackLogin = async () => {
    try {
      const url = await slackLogin();

      window.location.href = url;
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const handleDiscordLogin = async () => {
    try {
      const url = await discordLogin();

      window.location.href = url;
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <form className="flex flex-col gap-6 w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-2xl p-8">
      <h2 className="text-2xl font-semibold text-gray-900 text-left">
        LabGoat: iGEM LIMS
      </h2>
      <p className="text-sm text-gray-500 text-left">
        Log in to your team account using your preferred platform:
      </p>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={handleSlackLogin}
          className="w-full flex items-center justify-center gap-2 bg-[#4A154B] hover:bg-[#3e1140] text-white font-medium py-3 rounded-lg transition duration-200 shadow-md"
        >
          <FaSlack className="text-lg" />
          Sign in with Slack
        </button>

        <button
          type="button"
          onClick={handleDiscordLogin}
          className="w-full flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-3 rounded-lg transition duration-200 shadow-md"
        >
          <FaDiscord className="text-lg" />
          Sign in with Discord
        </button>
      </div>
    </form>
  );
}
