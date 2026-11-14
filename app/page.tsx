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
import { CinematicSportsAtmosphere } from "@/components/CinematicSportsAtmosphere";
import { FloatingAiWidget } from "@/components/FloatingAiWidget";

export default function Home() {
  const clubs = getClubs();
  const sports = getSports();

  return (
    <main className="relative flex-1 flex flex-col bg-slate-50 dark:bg-void text-slate-900 dark:text-white min-h-screen transition-colors duration-300">
      {/* Header and Hero Section: 100% Intact & Untouched */}
      <Header />
      <HeroSection />

      {/* Cinematic Sports Atmosphere & Parallax Experience (Strictly Below Hero) */}
      <div className="relative w-full overflow-hidden bg-slate-50 dark:bg-[#07080a] transition-colors duration-500">
        <CinematicSportsAtmosphere />
        <div className="relative z-10">
          <TrendingSportsBento sports={sports} />
          <FeaturedClubsSection clubs={clubs} />
          <AIQuizSection clubs={clubs} />
          <EditorialAdvantages />
          <AthleteStories />
          <InteractiveFaq />
          <FinalBookingTerminal />
          <Footer />
        </div>
      </div>

      {/* Floating Interactive AI Assistant (Bottom-Right Chat Widget) */}
      <FloatingAiWidget />
    </main>
  );
}