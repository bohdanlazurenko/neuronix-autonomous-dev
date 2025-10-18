"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface BriefFormProps {
  onSubmit: (brief: string, language?: "en" | "ru") => void;
  isSubmitting: boolean;
}

export default function BriefForm({ onSubmit, isSubmitting }: BriefFormProps) {
  const [brief, setBrief] = useState("");
  const [language, setLanguage] = useState<"en" | "ru">("en");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (brief.trim().length >= 10) {
      onSubmit(brief, language);
    }
  };

  const charCount = brief.length;
  const isValid = charCount >= 10 && charCount <= 5000;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-4">
      <div>
        <label htmlFor="brief" className="block text-sm font-medium mb-2">
          Describe your project idea
        </label>
        <textarea
          id="brief"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="e.g., Create a habit tracking app where users can add daily habits, track their progress, and see streak counts. Include reminders and a motivational dashboard."
          className="w-full h-40 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isSubmitting}
          aria-describedby="char-count"
          aria-invalid={!isValid && charCount > 0}
        />
        <div id="char-count" className="flex justify-between text-sm mt-2">
          <span className={charCount > 5000 ? "text-red-400" : "text-zinc-500"}>
            {charCount} / 5000 characters
          </span>
          {charCount > 0 && charCount < 10 && (
            <span className="text-yellow-400">Minimum 10 characters required</span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="language" className="block text-sm font-medium mb-2">
          Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as "en" | "ru")}
          className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating your project...
          </>
        ) : (
          "Create Project"
        )}
      </button>
    </form>
  );
}
