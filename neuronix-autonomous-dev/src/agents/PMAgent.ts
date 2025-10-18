/**
 * Product Manager Agent
 * 
 * Analyzes user briefs and generates Product Requirements Documents (PRD)
 */

import Anthropic from "@anthropic-ai/sdk";
import { BaseAgent, AgentContext, AgentResult } from "./base";
import {
  ProductRequirementsDocument,
  ImplementationPlan,
} from "@/src/types/contracts";

export class PMAgent extends BaseAgent {
  private client: Anthropic;

  constructor() {
    super("PMAgent");

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is required");
    }

    this.client = new Anthropic({ apiKey });
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

    const message = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const prdData = JSON.parse(content.text);

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

    const message = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const planData = JSON.parse(content.text);

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
