/**
 * Base Agent Interface
 * 
 * Defines the contract that all AI agents must implement.
 */

export interface AgentContext {
  projectId: string;
  brief?: string;
  language?: "en" | "ru";
  [key: string]: unknown;
}

export interface AgentResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export abstract class BaseAgent {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Executes the agent's primary task
   */
  abstract execute(context: AgentContext): Promise<AgentResult>;

  /**
   * Returns the agent's name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Validates agent availability
   */
  async isAvailable(): Promise<boolean> {
    // Default implementation - can be overridden
    return true;
  }

  /**
   * Handles errors during execution
   */
  protected handleError(error: unknown): AgentResult {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[${this.name}] Error:`, errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}
