"use client";

import { useState } from "react";
import BriefForm from "./components/BriefForm";
import ResultCard from "./components/ResultCard";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    repositoryUrl: string;
    deploymentUrl: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (brief: string, language?: "en" | "ru") => {
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brief, language }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      // Process SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.error) {
              setError(data.error.message || "An error occurred");
              break;
            }

            if (data.type === "complete" && data.artifact) {
              setResult({
                repositoryUrl: "https://github.com/demo/sample-project",
                deploymentUrl: data.artifact.data.url,
              });
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-blue-500" />
            <h1 className="text-5xl font-bold">Neuronix</h1>
          </div>
          <p className="text-xl text-zinc-400">
            Transform your ideas into deployed applications in minutes
          </p>
          <p className="text-sm text-zinc-500 mt-2">
            Powered by autonomous AI agents
          </p>
        </div>

        <BriefForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        {error && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <ResultCard
            repositoryUrl={result.repositoryUrl}
            deploymentUrl={result.deploymentUrl}
          />
        )}
      </main>

      <footer className="mt-16 text-center text-sm text-zinc-500">
        <p>Built with Next.js, Claude AI, and Model Context Protocol</p>
      </footer>
    </div>
  );
}
