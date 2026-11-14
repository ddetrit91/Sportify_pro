import { notFound } from "next/navigation";
import Link from "next/link";
import { getClubById, getClubs } from "@/lib/storage";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ClubDetailClient } from "./ClubDetailClient";

interface ClubDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const clubs = getClubs();
  return clubs.map((c) => ({ id: c.id }));
}

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { id } = await params;
  const club = getClubById(id);

  if (!club) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-void text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      <Header />
      <ClubDetailClient club={club} />
      <Footer />
    </main>
  );
}
