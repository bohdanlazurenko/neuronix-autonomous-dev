/**
 * Server-Sent Events (SSE) Utilities
 * 
 * Provides utilities for creating and managing SSE streams for real-time progress updates.
 */

import { ProgressEvent } from "@/src/types/contracts";

/**
 * Creates a new Server-Sent Events stream
 */
export function createEventStream(): ReadableStream {
  return new ReadableStream({
    start(controller) {
      // Store controller for later use
      (this as Record<string, unknown>).controller = controller;
    },
  });
}

/**
 * Sends an SSE event through the stream
 */
export function sendEvent(
  controller: ReadableStreamDefaultController,
  event: ProgressEvent
): void {
  const encoder = new TextEncoder();
  const data = `data: ${JSON.stringify(event)}\n\n`;
  controller.enqueue(encoder.encode(data));
}

/**
 * Closes an SSE stream
 */
export function closeStream(controller: ReadableStreamDefaultController): void {
  try {
    controller.close();
  } catch (error) {
    // Stream may already be closed
    console.error("Error closing stream:", error);
  }
}

/**
 * Creates a formatted SSE response with proper headers
 */
export function createSSEResponse(stream: ReadableStream): Response {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

/**
 * Helper to create a progress event
 */
export function createProgressEvent(
  projectId: string,
  type: ProgressEvent["type"],
  phase: ProgressEvent["phase"],
  progress: number,
  message: string,
  artifact?: ProgressEvent["artifact"]
): ProgressEvent {
  return {
    id: crypto.randomUUID(),
    type,
    projectId,
    phase,
    progress,
    message,
    artifact,
    timestamp: new Date().toISOString(),
  };
}
