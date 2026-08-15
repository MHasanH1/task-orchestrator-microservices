import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

type ServiceHealth = {
  status: "UP" | "DOWN" | "DEGRADED";
  latencyMs?: number;
  error?: string;
};

type HealthReport = {
  status: "UP" | "DEGRADED";
  timestamp: string;
  uptimeSeconds: number;
  services: {
    database?: ServiceHealth;
    redis?: ServiceHealth;
  };
  totalLatencyMs?: number;
};

export async function GET() {
  const startTime = Date.now();
  const healthReport: HealthReport = {
    status: "UP",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    services: {},
  };

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    healthReport.services.database = {
      status: "UP",
      latencyMs: Date.now() - dbStart,
    };
  } catch (err: unknown) {
    healthReport.status = "DEGRADED";
    healthReport.services.database = {
      status: "DOWN",
      error: err instanceof Error ? err.message : "Unknown database error",
    };
  }

  try {
    const redisStart = Date.now();
    const pong = await redis.ping();
    healthReport.services.redis = {
      status: pong === "PONG" ? "UP" : "DEGRADED",
      latencyMs: Date.now() - redisStart,
    };
  } catch (err: unknown) {
    healthReport.status = "DEGRADED";
    healthReport.services.redis = {
      status: "DOWN",
      error: err instanceof Error ? err.message : "Unknown database error",
    };
  }

  healthReport.totalLatencyMs = Date.now() - startTime;

  const statusCode = healthReport.status === "UP" ? 200 : 503;
  return NextResponse.json(healthReport, { status: statusCode });
}
