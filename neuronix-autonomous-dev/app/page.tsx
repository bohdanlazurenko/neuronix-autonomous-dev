"use client";

import { useState } from "react";
import BriefForm from "./components/BriefForm";
import ResultCard from "./components/ResultCard";
import ProgressTracker from "./components/ProgressTracker";
import { Sparkles } from "lucide-react";

interface ProgressStep {
  phase: string;
  label: string;
  status: "pending" | "in-progress" | "complete";
  message?: string;
}

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    repositoryUrl: string;
    deploymentUrl: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    { phase: "brief", label: "Validate Brief", status: "pending" },
    { phase: "prd", label: "Generate Product Requirements", status: "pending" },
    { phase: "plan", label: "Create Implementation Plan", status: "pending" },
    { phase: "code", label: "Generate Code", status: "pending" },
    { phase: "deploy", label: "Deploy to Vercel", status: "pending" },
  ]);

  const updateStepStatus = (phase: string, status: "pending" | "in-progress" | "complete", message?: string) => {
    setProgressSteps((prev) =>
      prev.map((step) =>
        step.phase === phase ? { ...step, status, message } : step
      )
    );
  };

  const handleSubmit = async (brief: string, language?: "en" | "ru") => {
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    
    // Reset progress
    setProgressSteps([
      { phase: "brief", label: "Validate Brief", status: "pending" },
      { phase: "prd", label: "Generate Product Requirements", status: "pending" },
      { phase: "plan", label: "Create Implementation Plan", status: "pending" },
      { phase: "code", label: "Generate Code", status: "pending" },
      { phase: "deploy", label: "Deploy to Vercel", status: "pending" },
    ]);

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

      console.log('🔵 [Frontend] SSE stream opened, waiting for events...');
      let eventCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('🔵 [Frontend] Stream ended, total events:', eventCount);
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              eventCount++;
              console.log(`🔵 [Frontend] Event ${eventCount}:`, data.type, data.phase, data.message);

              if (data.error) {
                setError(data.error.message || "An error occurred");
                break;
              }

              // Update progress based on event type
              if (data.type === "phase_start") {
                updateStepStatus(data.phase, "in-progress", data.message);
              } else if (data.type === "phase_complete") {
                updateStepStatus(data.phase, "complete", data.message);
              } else if (data.type === "complete" && data.artifact) {
                updateStepStatus("deploy", "complete", "Deployment ready!");
                setResult({
                  repositoryUrl: "https://github.com/demo/sample-project",
                  deploymentUrl: data.artifact.data.url,
                });
              }
            } catch (parseError) {
              console.error("🔴 [Frontend] Failed to parse SSE data:", parseError);
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

        {isSubmitting && <ProgressTracker steps={progressSteps} />}

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
