/**
 * API Route: Get AI Provider Info
 * 
 * Returns information about which AI provider is currently configured
 */

export const runtime = 'edge';

import { NextResponse } from "next/server";
import { AIClient } from "@/src/lib/ai-client";

export async function GET() {
  try {
    const client = new AIClient();
    
    return NextResponse.json({
      provider: client.getProvider(),
      model: client.getModel(),
      available: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        available: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
