/**
 * Product Manager Agent
 * 
 * Analyzes user briefs and generates Product Requirements Documents (PRD)
 */

import { BaseAgent, AgentContext, AgentResult } from "./base";
import {
  ProductRequirementsDocument,
  ImplementationPlan,
} from "@/src/types/contracts";
import { AIClient } from "@/src/lib/ai-client";

export class PMAgent extends BaseAgent {
  private client: AIClient;

  constructor() {
    super("PMAgent");

    try {
      this.client = new AIClient();
    } catch {
      throw new Error(
        "AI API key required. Set ANTHROPIC_API_KEY, OPENAI_API_KEY, or ZAI_API_KEY"
      );
    }
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    try {
      const { brief, language = "en" } = context;

      if (!brief) {
        return {
          success: false,
          error: "Brief is required",
        };
      }

      // Generate PRD using Claude
      const prd = await this.generatePRD(brief as string, language as "en" | "ru");

      // Generate implementation plan
      const plan = await this.generateImplementationPlan(prd);

      return {
        success: true,
        data: {
          prd,
          plan,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async generatePRD(
    brief: string,
    _language: "en" | "ru"
  ): Promise<ProductRequirementsDocument> {
    const prompt = `You are a product manager. Analyze this project brief and create a structured Product Requirements Document (PRD).

Brief: ${brief}

Generate a JSON response with this structure:
{
  "projectName": "kebab-case-name",
  "goal": "primary objective",
  "features": ["feature 1", "feature 2", ...],
  "techDecisions": {
    "framework": "suggested framework",
    "language": "suggested language",
    "styling": "suggested styling solution",
    "dependencies": ["key library 1", "key library 2"]
  }
}

Respond ONLY with valid JSON, no markdown or explanations.`;

    const response = await this.client.chat(
      [{ role: "user", content: prompt }],
      { maxTokens: 2048 }
    );

    const prdData = JSON.parse(response.content);

    return {
      id: crypto.randomUUID(),
      projectName: prdData.projectName,
      goal: prdData.goal,
      features: prdData.features,
      techDecisions: prdData.techDecisions,
      createdAt: new Date().toISOString(),
      generatedBy: "PMAgent",
    };
  }

  private async generateImplementationPlan(
    prd: ProductRequirementsDocument
  ): Promise<ImplementationPlan> {
    const prompt = `Based on this PRD, create an implementation plan listing all files to create.

PRD:
- Project: ${prd.projectName}
- Goal: ${prd.goal}
- Features: ${prd.features.join(", ")}
- Stack: ${prd.techDecisions.framework}, ${prd.techDecisions.language}

Generate a JSON response with this structure:
{
  "projectName": "${prd.projectName}",
  "stack": {
    "framework": "${prd.techDecisions.framework}",
    "language": "${prd.techDecisions.language}",
    "styling": "${prd.techDecisions.styling}",
    "testing": "suggested testing framework",
    "deployment": "suggested deployment platform"
  },
  "files": [
    {
      "path": "relative/path/to/file.ext",
      "purpose": "what this file does",
      "dependencies": ["other files it depends on"]
    }
  ]
}

Respond ONLY with valid JSON.`;

    const response = await this.client.chat(
      [{ role: "user", content: prompt }],
      { maxTokens: 4096 }
    );

    const planData = JSON.parse(response.content);

    return {
      id: crypto.randomUUID(),
      projectName: planData.projectName,
      stack: planData.stack,
      files: planData.files,
      createdAt: new Date().toISOString(),
      generatedBy: "PMAgent",
    };
  }
}
