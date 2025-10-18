/**
 * Create Project API Endpoint
 * 
 * POST /api/create
 * Accepts project briefs and streams progress via SSE
 */

export const runtime = 'edge';
export const maxDuration = 300; // 5 minutes

import { NextRequest } from "next/server";
import { validateBrief } from "@/src/lib/validation";
import { createValidationError, handleError } from "@/src/lib/errors";
import { createSSEResponse, sendEvent, createProgressEvent } from "@/src/lib/sse";
import { AgentOrchestrator } from "@/src/lib/orchestrator";
import { PMAgent } from "@/src/agents/PMAgent";
import { DevAgent } from "@/src/agents/DevAgent";
import { IntegrationAgent } from "@/src/agents/IntegrationAgent";

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let keepAliveInterval: ReturnType<typeof setInterval> | null = null;
      
      try {
        // Parse request body
        const body = await request.json();
        const { brief, language } = body;

        // Validate brief
        const validation = validateBrief(brief);
        if (!validation.valid) {
          const error = createValidationError(validation.error!);
          const errorResponse = handleError(error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorResponse })}\n\n`)
          );
          controller.close();
          return;
        }

        const projectId = crypto.randomUUID();

        // Send initial event
        sendEvent(
          controller,
          createProgressEvent(projectId, "phase_start", "brief", 0, "Validating brief...")
        );

        // Create and configure orchestrator
        const orchestrator = new AgentOrchestrator({
          maxRetries: 3,
          timeout: 15 * 60 * 1000, // 15 minutes
        });

        // Register agents
        orchestrator.registerAgent(new PMAgent());
        orchestrator.registerAgent(new DevAgent());
        orchestrator.registerAgent(new IntegrationAgent());

        // Set progress callback
        orchestrator.setProgressCallback((event) => {
          console.log('[API] Progress event received:', event.type, event.phase);
          sendEvent(controller, event);
        });

        // Send brief validated event
        sendEvent(
          controller,
          createProgressEvent(projectId, "phase_complete", "brief", 10, "Brief validated")
        );

        // Send keep-alive comments every 5 seconds to prevent timeout
        keepAliveInterval = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(': keep-alive\n\n'));
          } catch {
            if (keepAliveInterval) clearInterval(keepAliveInterval);
          }
        }, 5000);

        console.log('[API] Starting orchestrator.execute()');
        // Execute workflow (orchestrator will send progress events for each agent)
        const result = await orchestrator.execute({
          projectId,
          brief,
          language,
        });
        console.log('[API] Orchestrator.execute() finished:', result.success);
        
        if (keepAliveInterval) clearInterval(keepAliveInterval);

        if (!result.success) {
          sendEvent(
            controller,
            createProgressEvent(
              projectId,
              "error",
              "deploy",
              50,
              result.error || "Workflow failed"
            )
          );
          controller.close();
          return;
        }

        // Send completion event
        sendEvent(
          controller,
          createProgressEvent(
            projectId,
            "complete",
            "deploy",
            100,
            "✅ Project completed successfully!",
            {
              type: "deployment",
              data: {
                url: result.data?.deploymentUrl || "",
                status: "ready",
              },
            }
          )
        );

        controller.close();
      } catch (error) {
        if (keepAliveInterval) clearInterval(keepAliveInterval);
        const errorResponse = handleError(error);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errorResponse })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return createSSEResponse(stream);
}
