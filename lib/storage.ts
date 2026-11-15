import fs from "fs";
import path from "path";
import { Club, Sport, Lead, LeadStatus } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const CLUBS_FILE = path.join(DATA_DIR, "clubs.json");
const SPORTS_FILE = path.join(DATA_DIR, "sports.json");

function ensureDirectoryExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Read-only filesystem in serverless environments (e.g. Vercel)
  }
}

export function getLeads(): Lead[] {
  try {
    ensureDirectoryExists();
    if (!fs.existsSync(LEADS_FILE)) {
      try {
        fs.writeFileSync(LEADS_FILE, "[]", "utf-8");
      } catch {
        // Read-only filesystem fallback
      }
      return [];
    }
    const data = fs.readFileSync(LEADS_FILE, "utf-8");
    return JSON.parse(data) as Lead[];
  } catch (error) {
    console.error("Error reading leads:", error);
    return [];
  }
}

export function saveLead(newLead: Partial<Lead> & { name: string; phone: string }): Lead {
  ensureDirectoryExists();
  const leads = getLeads();
  
  const lead: Lead = {
    ...newLead,
    id: newLead.id || `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: newLead.createdAt || new Date().toISOString(),
    status: newLead.status || "new",
    source: newLead.source || "landing_form",
  };

  leads.unshift(lead);
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.warn("Storage notice: Could not write leads.json (serverless read-only environment):", err);
  }
  return lead;
}

export function updateLead(id: string, updates: { status?: LeadStatus; notes?: string }): Lead | null {
  ensureDirectoryExists();
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;

  leads[index] = {
    ...leads[index],
    ...updates,
  };

  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.warn("Storage notice: Could not update leads.json (serverless read-only environment):", err);
  }
  return leads[index];
}

export function deleteLead(id: string): boolean {
  ensureDirectoryExists();
  const leads = getLeads();
  const filtered = leads.filter((l) => l.id !== id);
  if (filtered.length === leads.length) return false;

  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  } catch (err) {
    console.warn("Storage notice: Could not delete in leads.json (serverless read-only environment):", err);
  }
  return true;
}

export function getClubs(): Club[] {
  try {
    ensureDirectoryExists();
    if (!fs.existsSync(CLUBS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(CLUBS_FILE, "utf-8");
    return JSON.parse(data) as Club[];
  } catch (error) {
    console.error("Error reading clubs:", error);
    return [];
  }
}

export function getClubById(id: string): Club | undefined {
  const clubs = getClubs();
  return clubs.find((c) => c.id === id || c.slug === id);
}

export function getClubBySlug(slug: string): Club | undefined {
  const clubs = getClubs();
  return clubs.find((c) => c.slug === slug || c.id === slug);
}

export function getSports(): Sport[] {
  try {
    ensureDirectoryExists();
    if (!fs.existsSync(SPORTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(SPORTS_FILE, "utf-8");
    return JSON.parse(data) as Sport[];
  } catch (error) {
    console.error("Error reading sports:", error);
    return [];
  }
}

export function getSportBySlug(slug: string): Sport | undefined {
  const sports = getSports();
  return sports.find((s) => s.slug === slug || s.id === slug);
}
