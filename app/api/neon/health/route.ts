import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { getS3Client } from "@/lib/storage-s3";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

export async function GET() {
  const result: any = {
    timestamp: new Date().toISOString(),
    status: "ok",
    services: {},
  };

  // 1. Проверка Neon Lakebase Postgres
  const pgStart = Date.now();
  try {
    const sql = getDb();
    if (!sql) {
      result.services.postgres = {
        status: "error",
        error: "DATABASE_URL is not configured",
      };
    } else {
      await initDb();
      const rows = await sql`
        SELECT 
          NOW() as server_time,
          current_database() as database,
          current_user as user,
          version() as version,
          (SELECT COUNT(*) FROM leads) as leads_count;
      `;
      result.services.postgres = {
        status: "healthy",
        latencyMs: Date.now() - pgStart,
        database: rows[0].database,
        leadsCount: Number(rows[0].leads_count),
        serverTime: rows[0].server_time,
        version: rows[0].version.split(" ")[0] + " " + rows[0].version.split(" ")[1],
      };
    }
  } catch (pgError: any) {
    result.services.postgres = {
      status: "error",
      error: pgError.message,
    };
    result.status = "degraded";
  }

  // 2. Проверка Neon Object Storage
  const s3Start = Date.now();
  try {
    const s3 = getS3Client();
    if (!s3) {
      result.services.objectStorage = {
        status: "error",
        error: "AWS S3 credentials or endpoint not configured",
      };
    } else {
      const list = await s3.send(
        new ListObjectsV2Command({
          Bucket: "assets",
          MaxKeys: 10,
        })
      );
      result.services.objectStorage = {
        status: "healthy",
        latencyMs: Date.now() - s3Start,
        bucket: "assets",
        objectsCount: list.KeyCount || 0,
        sampleKeys: list.Contents?.map((c) => c.Key) || [],
      };
    }
  } catch (s3Error: any) {
    result.services.objectStorage = {
      status: "error",
      error: s3Error.message,
    };
    result.status = "degraded";
  }

  return NextResponse.json(result);
}
