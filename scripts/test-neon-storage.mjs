import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import fs from "fs";

// Load .env.local manually and clean quotes/CRLF
const envContent = fs.readFileSync(".env.local", "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

async function testStorage() {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  const region = process.env.AWS_REGION || "us-east-2";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const bucket = "assets";

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing AWS S3 credentials in .env.local");
  }

  const s3 = new S3Client({
    endpoint,
    region,
    forcePathStyle: true, // MANDATORY for Neon Object Storage
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const testKey = "sportify-telemetry/status.json";
  const testPayload = JSON.stringify({
    platform: "SPORTIFY Tashkent",
    service: "Neon Object Storage",
    timestamp: new Date().toISOString(),
    status: "active",
  });

  console.log(`Uploading to bucket "${bucket}" at key "${testKey}"...`);
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: testKey,
      Body: Buffer.from(testPayload, "utf-8"),
      ContentType: "application/json",
    })
  );
  console.log("Upload SUCCESS!");

  console.log(`Listing objects in bucket "${bucket}"...`);
  const listRes = await s3.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: "sportify-telemetry/",
    })
  );
  console.log("List SUCCESS! Found:", listRes.Contents?.map((c) => c.Key));

  console.log(`Reading back "${testKey}"...`);
  const getRes = await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: testKey,
    })
  );
  const bodyText = await getRes.Body.transformToString();
  console.log("Download SUCCESS! Content:", bodyText);
}

testStorage().catch((err) => {
  console.error("Storage test failed:", err);
  process.exit(1);
});
