/**
 * Agent Orchestrator
 * 
 * Coordinates the workflow between multiple AI agents (PM → Dev → Integration).
 * Handles agent execution, context passing, and error recovery.
 */

import { BaseAgent, AgentContext, AgentResult } from "@/src/agents/base";
import { ProgressEvent } from "@/src/types/contracts";
import { AppError, ErrorCode } from "./errors";

export interface OrchestratorConfig {
  projectId: string;
  brief: string;
  language?: "en" | "ru";
  maxRetries?: number;
  timeout?: number; // in milliseconds
}

export interface OrchestratorResult {
  success: boolean;
  data?: {
    repositoryUrl?: string;
    deploymentUrl?: string;
    artifacts?: Record<string, unknown>;
  };
  error?: string;
}

export class AgentOrchestrator {
  private agents: BaseAgent[] = [];
  private maxRetries: number;
  private timeout: number;
  private onProgress?: (event: ProgressEvent) => void;

  constructor(config?: { maxRetries?: number; timeout?: number }) {
    this.maxRetries = config?.maxRetries ?? 3;
    this.timeout = config?.timeout ?? 15 * 60 * 1000; // 15 minutes default
  }

  /**
   * Registers an agent in the workflow
   */
  registerAgent(agent: BaseAgent): void {
    this.agents.push(agent);
  }

  /**
   * Sets a callback for progress updates
   */
  setProgressCallback(callback: (event: ProgressEvent) => void): void {
    this.onProgress = callback;
  }

  /**
   * Executes the agent workflow
   */
  async execute(config: OrchestratorConfig): Promise<OrchestratorResult> {
    const startTime = Date.now();
    const context: AgentContext = {
      projectId: config.projectId,
      brief: config.brief,
      language: config.language,
    };

    try {
      // Execute agents sequentially
      for (let i = 0; i < this.agents.length; i++) {
        const agent = this.agents[i];
        const agentName = agent.getName();

        // Determine phase name for progress events
        const phaseMap: Record<string, string> = {
          "PMAgent": "prd",
          "DevAgent": "implementation",
          "IntegrationAgent": "deploy",
        };
        const phaseName = phaseMap[agentName] || "unknown";

        // Check timeout
        if (Date.now() - startTime > this.timeout) {
          throw new AppError(
            `Workflow timeout exceeded after ${this.timeout}ms`,
            ErrorCode.TIMEOUT,
            408
          );
        }

        // Check agent availability
        const available = await agent.isAvailable();
        if (!available) {
          throw new AppError(
            `Agent ${agent.getName()} is unavailable`,
            ErrorCode.AGENT_UNAVAILABLE,
            503
          );
        }

        // Send phase start event
        if (this.onProgress) {
          const progressPercent = 10 + (i * 30); // 10, 40, 70
          this.onProgress({
            id: crypto.randomUUID(),
            type: "phase_start",
            projectId: config.projectId,
            phase: phaseName,
            progress: progressPercent,
            message: `${agentName} starting...`,
            timestamp: new Date().toISOString(),
          });
        }

        // Execute agent with retry logic
        const result = await this.executeWithRetry(agent, context);

        if (!result.success) {
          return {
            success: false,
            error: result.error || `Agent ${agent.getName()} failed`,
          };
        }

        // Send phase complete event
        if (this.onProgress) {
          const progressPercent = 30 + (i * 30); // 30, 60, 90
          this.onProgress({
            id: crypto.randomUUID(),
            type: "phase_complete",
            projectId: config.projectId,
            phase: phaseName,
            progress: progressPercent,
            message: `${agentName} completed`,
            timestamp: new Date().toISOString(),
          });
        }

        // Pass result to next agent via context
        if (result.data) {
          Object.assign(context, result.data);
        }
      }

      const finalContext = context as Record<string, unknown>;
      return {
        success: true,
        data: {
          repositoryUrl: finalContext.repositoryUrl as string | undefined,
          deploymentUrl: finalContext.deploymentUrl as string | undefined,
          artifacts: context,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("[Orchestrator] Workflow failed:", errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Executes an agent with exponential backoff retry logic
   */
  private async executeWithRetry(
    agent: BaseAgent,
    context: AgentContext
  ): Promise<AgentResult> {
    let lastError: string | undefined;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const result = await agent.execute(context);

        if (result.success) {
          return result;
        }

        lastError = result.error;

        // Wait before retry (exponential backoff)
        if (attempt < this.maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          await this.sleep(delay);
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);

        // Wait before retry
        if (attempt < this.maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          await this.sleep(delay);
        }
      }
    }

    return {
      success: false,
      error: lastError || "Agent execution failed after retries",
    };
  }

  /**
   * Helper to sleep for a given duration
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Emits a progress event
   */
  protected emitProgress(event: ProgressEvent): void {
    if (this.onProgress) {
      this.onProgress(event);
    }
  }
}
