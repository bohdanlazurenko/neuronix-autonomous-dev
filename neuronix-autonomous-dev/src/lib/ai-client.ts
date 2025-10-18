/**
 * Universal AI Client
 * 
 * Supports multiple AI providers: Anthropic Claude, OpenAI, Z.AI
 */

import Anthropic from "@anthropic-ai/sdk";

export type AIProvider = "anthropic" | "openai" | "zai";

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export class AIClient {
  private provider: AIProvider;
  private anthropicClient?: Anthropic;
  private apiKey: string;

  constructor(provider?: AIProvider) {
    // Auto-detect provider based on available API keys
    this.provider = provider || this.detectProvider();
    
    const apiKey = this.getApiKey(this.provider);
    if (!apiKey) {
      throw new Error(`API key not found for provider: ${this.provider}`);
    }
    
    this.apiKey = apiKey;

    // Initialize Anthropic client if needed
    if (this.provider === "anthropic") {
      this.anthropicClient = new Anthropic({ apiKey: this.apiKey });
    }
  }

  private detectProvider(): AIProvider {
    // Check in order of preference
    if (process.env.ANTHROPIC_API_KEY) return "anthropic";
    if (process.env.OPENAI_API_KEY) return "openai";
    if (process.env.ZAI_API_KEY) return "zai";
    
    throw new Error("No AI provider API key found. Set ANTHROPIC_API_KEY, OPENAI_API_KEY, or ZAI_API_KEY");
  }

  private getApiKey(provider: AIProvider): string | undefined {
    switch (provider) {
      case "anthropic":
        return process.env.ANTHROPIC_API_KEY;
      case "openai":
        return process.env.OPENAI_API_KEY;
      case "zai":
        return process.env.ZAI_API_KEY;
    }
  }

  async chat(messages: AIMessage[], options?: {
    temperature?: number;
    maxTokens?: number;
  }): Promise<AIResponse> {
    switch (this.provider) {
      case "anthropic":
        return this.chatAnthropic(messages, options);
      case "openai":
        return this.chatOpenAI(messages, options);
      case "zai":
        return this.chatZAI(messages, options);
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  private async chatAnthropic(
    messages: AIMessage[],
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<AIResponse> {
    if (!this.anthropicClient) {
      throw new Error("Anthropic client not initialized");
    }

    // Separate system messages from user/assistant messages
    const systemMessage = messages.find(m => m.role === "system");
    const conversationMessages = messages.filter(m => m.role !== "system");

    const response = await this.anthropicClient.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: options?.maxTokens || 4000,
      temperature: options?.temperature || 0.7,
      system: systemMessage?.content,
      messages: conversationMessages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Anthropic");
    }

    return {
      content: content.text,
      model: response.model,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  }

  private async chatOpenAI(
    messages: AIMessage[],
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<AIResponse> {
    // OpenAI API implementation
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      model: data.model,
      usage: {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
      },
    };
  }

  private async chatZAI(
    messages: AIMessage[],
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<AIResponse> {
    // Z.AI API implementation with correct endpoint
    // Note: Z.AI may use either 'Authorization: Bearer' or 'api-key' header
    const response = await fetch("https://api.z.ai/api/coding/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        "api-key": this.apiKey, // Some Z.AI endpoints use this format
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 4000,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Z.AI API error (${response.status}):`, error);
      throw new Error(`Z.AI API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      model: data.model,
      usage: {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
      },
    };
  }

  getProvider(): AIProvider {
    return this.provider;
  }

  getModel(): string {
    switch (this.provider) {
      case "anthropic":
        return "claude-sonnet-4-20250514";
      case "openai":
        return "gpt-4o";
      case "zai":
        return "deepseek-chat";
      default:
        return "unknown";
    }
  }
}
