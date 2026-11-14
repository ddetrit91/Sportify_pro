import { getClubs, getSports } from "@/lib/storage";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TrendingSportsBento } from "@/components/TrendingSportsBento";
import { FeaturedClubsSection } from "@/components/FeaturedClubsSection";
import { AIQuizSection } from "@/components/AIQuizSection";
import { EditorialAdvantages } from "@/components/EditorialAdvantages";
import { AthleteStories } from "@/components/AthleteStories";
import { InteractiveFaq } from "@/components/InteractiveFaq";
import { FinalBookingTerminal } from "@/components/FinalBookingTerminal";
import { Footer } from "@/components/Footer";
import { Athletic3DBackground } from "@/components/Athletic3DBackground";
import { FloatingAiWidget } from "@/components/FloatingAiWidget";

export default function Home() {
  const clubs = getClubs();
  const sports = getSports();

  return (
    <main className="relative flex-1 flex flex-col bg-void text-white min-h-screen">
      {/* 3D Kinetic Athletic Wireframe & Particle Stream Background across the entire page */}
      <Athletic3DBackground />

      <Header />
      <HeroSection />
      <TrendingSportsBento sports={sports} />
      <FeaturedClubsSection clubs={clubs} />
      <AIQuizSection clubs={clubs} />
      <EditorialAdvantages />
      <AthleteStories />
      <InteractiveFaq />
      <FinalBookingTerminal />
      <Footer />

      {/* Floating Interactive AI Assistant (Bottom-Right Chat Widget) */}
      <FloatingAiWidget />
    </main>
  );
}