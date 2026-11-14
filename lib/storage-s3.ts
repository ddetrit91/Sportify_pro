import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const BUCKET_NAME = "assets";

/**
 * Инициализирует S3-клиент для Neon Object Storage.
 * Важно: Neon требует path-style адресацию (forcePathStyle: true).
 */
export function getS3Client() {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "us-east-2";

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    endpoint: endpoint.trim(),
    region: region.trim(),
    forcePathStyle: true, // Обязательно для Neon S3
    credentials: {
      accessKeyId: accessKeyId.trim(),
      secretAccessKey: secretAccessKey.trim(),
    },
  });
}

/**
 * Загрузка объекта в Neon Object Storage.
 */
export async function uploadToStorage(
  key: string,
  content: string | Buffer | Uint8Array,
  contentType: string = "application/json"
): Promise<boolean> {
  const s3 = getS3Client();
  if (!s3) return false;

  try {
    const body = typeof content === "string" ? Buffer.from(content, "utf-8") : content;
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );
    return true;
  } catch (error) {
    console.error(`Error uploading to Neon Object Storage (${key}):`, error);
    return false;
  }
}

/**
 * Чтение текстового объекта из Neon Object Storage.
 */
export async function readFromStorage(key: string): Promise<string | null> {
  const s3 = getS3Client();
  if (!s3) return null;

  try {
    const res = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );
    return await res.Body!.transformToString();
  } catch (error) {
    console.error(`Error reading from Neon Object Storage (${key}):`, error);
    return null;
  }
}

/**
 * Получение списка объектов в бакете.
 */
export async function listStorageObjects(prefix: string = ""): Promise<string[]> {
  const s3 = getS3Client();
  if (!s3) return [];

  try {
    const res = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
      })
    );
    return res.Contents?.map((c) => c.Key || "").filter(Boolean) || [];
  } catch (error) {
    console.error("Error listing Neon Object Storage:", error);
    return [];
  }
}

/**
 * Удаление объекта из хранилища.
 */
export async function deleteFromStorage(key: string): Promise<boolean> {
  const s3 = getS3Client();
  if (!s3) return false;

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );
    return true;
  } catch (error) {
    console.error(`Error deleting from Neon Object Storage (${key}):`, error);
    return false;
  }
}
