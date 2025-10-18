"use client";

import { Copy, ExternalLink, Github } from "lucide-react";
import { useState } from "react";

interface ResultCardProps {
  repositoryUrl: string;
  deploymentUrl: string;
}

export default function ResultCard({ repositoryUrl, deploymentUrl }: ResultCardProps) {
  const [copiedRepo, setCopiedRepo] = useState(false);
  const [copiedDeploy, setCopiedDeploy] = useState(false);

  const copyToClipboard = async (text: string, type: "repo" | "deploy") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "repo") {
        setCopiedRepo(true);
        setTimeout(() => setCopiedRepo(false), 2000);
      } else {
        setCopiedDeploy(true);
        setTimeout(() => setCopiedDeploy(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 p-6 bg-zinc-900 border border-zinc-700 rounded-lg space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-green-400 mb-2">
          ✅ Project Created Successfully!
        </h2>
        <p className="text-zinc-400">
          Your project has been generated, deployed, and is ready to use.
        </p>
      </div>

      <div className="space-y-4">
        {/* Repository URL */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-300">
            <Github className="w-4 h-4 inline mr-2" />
            Source Code Repository
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={repositoryUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-mono"
              aria-label="Repository URL"
            />
            <button
              onClick={() => copyToClipboard(repositoryUrl, "repo")}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
              aria-label="Copy repository URL"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
            <a
              href={repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
              aria-label="Open repository in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          {copiedRepo && <p className="text-sm text-green-400">Copied to clipboard!</p>}
        </div>

        {/* Deployment URL */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-300">
            <ExternalLink className="w-4 h-4 inline mr-2" />
            Live Application
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={deploymentUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-mono"
              aria-label="Deployment URL"
            />
            <button
              onClick={() => copyToClipboard(deploymentUrl, "deploy")}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
              aria-label="Copy deployment URL"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
            <a
              href={deploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
              aria-label="Open live application"
            >
              Visit App
            </a>
          </div>
          {copiedDeploy && <p className="text-sm text-green-400">Copied to clipboard!</p>}
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-700">
        <h3 className="text-sm font-medium mb-2">Next Steps:</h3>
        <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
          <li>Clone the repository and explore the code</li>
          <li>Visit the live application to see it in action</li>
          <li>Customize and deploy your own version</li>
          <li>Share with your team or users</li>
        </ul>
      </div>
    </div>
  );
}
