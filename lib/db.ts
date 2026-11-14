import { neon } from "@neondatabase/serverless";
import { Lead, LeadStatus } from "./types";

/**
 * Возвращает SQL-клиент Neon Serverless.
 * Работает поверх легкого HTTP-транспорта без необходимости управлять пулами соединений.
 */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const cleanUrl = url.replace(/^['"]|['"]$/g, "").trim();
  return neon(cleanUrl);
}

let isInitialized = false;

/**
 * Инициализирует схему таблиц в Neon Postgres (если они еще не созданы).
 */
export async function initDb() {
  if (isInitialized) return;
  const sql = getDb();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        sport_interest VARCHAR(255),
        club_id VARCHAR(255),
        club_name VARCHAR(255),
        budget VARCHAR(255),
        source VARCHAR(100) DEFAULT 'landing_form',
        ai_summary TEXT,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Создаем индекс по дате создания для быстрой выборки
    await sql`
      CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
    `;

    isInitialized = true;
  } catch (error) {
    console.error("Neon DB schema initialization error:", error);
  }
}

/**
 * Получение всех лидов из Neon Postgres.
 */
export async function dbGetLeads(): Promise<Lead[]> {
  const sql = getDb();
  if (!sql) return [];

  await initDb();
  const rows = await sql`
    SELECT 
      id,
      name,
      phone,
      sport_interest as "sportInterest",
      club_id as "clubId",
      club_name as "clubName",
      budget,
      source,
      ai_summary as "aiSummary",
      notes,
      status,
      created_at as "createdAt"
    FROM leads
    ORDER BY created_at DESC;
  `;

  return rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    sportInterest: r.sportInterest || undefined,
    clubId: r.clubId || undefined,
    clubName: r.clubName || undefined,
    budget: r.budget || undefined,
    source: r.source || "landing_form",
    aiSummary: r.aiSummary || undefined,
    notes: r.notes || undefined,
    status: (r.status as LeadStatus) || "new",
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
  }));
}

/**
 * Сохранение новой заявки в Neon Postgres.
 */
export async function dbSaveLead(lead: Lead): Promise<Lead> {
  const sql = getDb();
  if (!sql) return lead;

  await initDb();
  await sql`
    INSERT INTO leads (
      id,
      name,
      phone,
      sport_interest,
      club_id,
      club_name,
      budget,
      source,
      ai_summary,
      notes,
      status,
      created_at
    ) VALUES (
      ${lead.id},
      ${lead.name},
      ${lead.phone},
      ${lead.sportInterest || null},
      ${lead.clubId || null},
      ${lead.clubName || null},
      ${lead.budget || null},
      ${lead.source || "landing_form"},
      ${lead.aiSummary || null},
      ${lead.notes || null},
      ${lead.status || "new"},
      ${lead.createdAt ? new Date(lead.createdAt).toISOString() : new Date().toISOString()}
    );
  `;

  return lead;
}

/**
 * Обновление статуса и заметок заявки в Neon Postgres.
 */
export async function dbUpdateLead(
  id: string,
  updates: { status?: LeadStatus; notes?: string }
): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;

  await initDb();
  if (updates.status && updates.notes !== undefined) {
    await sql`
      UPDATE leads 
      SET status = ${updates.status}, notes = ${updates.notes}
      WHERE id = ${id};
    `;
  } else if (updates.status) {
    await sql`
      UPDATE leads 
      SET status = ${updates.status}
      WHERE id = ${id};
    `;
  } else if (updates.notes !== undefined) {
    await sql`
      UPDATE leads 
      SET notes = ${updates.notes}
      WHERE id = ${id};
    `;
  }

  return true;
}

/**
 * Удаление заявки из Neon Postgres.
 */
export async function dbDeleteLead(id: string): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;

  await initDb();
  await sql`DELETE FROM leads WHERE id = ${id};`;
  return true;
}
