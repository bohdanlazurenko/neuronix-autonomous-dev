/**
 * Health Check API Endpoint
 * 
 * GET /api/ping
 * Returns service status and agent availability
 */

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const timestamp = new Date().toISOString();
    const version = process.env.npm_package_version || "1.0.0";

    // TODO: Check actual agent availability when agents are implemented
    const agents = {
      pmAgent: "available",
      devAgent: "available",
      integrationAgent: "available",
    };

    return NextResponse.json({
      status: "ok",
      timestamp,
      version,
      agents,
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        message: "Service unhealthy",
      },
      { status: 503 }
    );
  }
}
