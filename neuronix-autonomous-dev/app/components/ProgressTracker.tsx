"use client";

import { Check, Loader2 } from "lucide-react";

interface ProgressStep {
  phase: string;
  label: string;
  status: "pending" | "in-progress" | "complete";
  message?: string;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
}

export default function ProgressTracker({ steps }: ProgressTrackerProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Project Creation Progress</h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.phase} className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              {step.status === "complete" ? (
                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : step.status === "in-progress" ? (
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-zinc-700 border-2 border-zinc-600" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className={`font-medium ${
                  step.status === "complete" ? "text-green-400" :
                  step.status === "in-progress" ? "text-blue-400" :
                  "text-zinc-400"
                }`}>
                  {step.label}
                </h4>
                {step.status === "in-progress" && (
                  <span className="text-xs text-zinc-500">In progress...</span>
                )}
              </div>
              {step.message && (
                <p className="text-sm text-zinc-500 mt-1">{step.message}</p>
              )}
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="absolute left-[11px] mt-8 w-0.5 h-8 bg-zinc-700" 
                   style={{ marginLeft: '23px' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
