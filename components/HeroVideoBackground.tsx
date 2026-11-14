"use client";

import { useState, useEffect } from "react";
import { Loader2, RefreshCw, Film } from "lucide-react";

// Curated high-energy mountain trail running, uphill sprints, and alpine athletic YouTube streams
export const HERO_SPORTS_VIDEOS = [
  {
    id: "dgrCDnsbmro",
    title: "Swiss Alps Mountain Trail Sprint (4K)",
    location: "Швейцарские Альпы // Подъем в гору",
  },
  {
    id: "32EPPSJgsyk",
    title: "Rocky Mountain Ridge Sprint (4K)",
    location: "Каменистый горный хребет // Скоростной бег",
  },
  {
    id: "WkdT6NcSg0A",
    title: "Mont Blanc Alpine Trail Run (4K)",
    location: "Массив Монблан // Высокогорный марафон",
  },
  {
    id: "bbKQESO-Zw8",
    title: "Epic Mountain Downhill & Sprint (4K)",
    location: "Горный спуск и спринт // Экстремальный трейл",
  },
  {
    id: "3ir525RbNqY",
    title: "Alpine Mountain Summit Trail Run (4K)",
    location: "Штурм вершины // Горный беговой маршрут",
  },
];

export function HeroVideoBackground() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    // Pick a random video on page load / mount
    const randomIndex = Math.floor(Math.random() * HERO_SPORTS_VIDEOS.length);
    setCurrentIndex(randomIndex);
    setHasMounted(true);

    // Timeout fallback ensures preloader smoothly fades out even if iframe load event is throttled
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const handleNextVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoaded(false);
    setCurrentIndex((prev) => (prev + 1) % HERO_SPORTS_VIDEOS.length);
    setTimeout(() => setIsLoaded(true), 1800);
  };

  const currentVideo = HERO_SPORTS_VIDEOS[currentIndex];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#08090b]">
      {/* 1. Preloader & Fallback Athletic Poster */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 z-10 flex items-center justify-center bg-[#08090b] ${
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <img
          src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1600&auto=format&fit=crop"
          alt="Sports Video Preload"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35]"
        />
        <div className="relative z-20 flex flex-col items-center gap-3 px-4 text-center">
          <div className="w-12 h-12 rounded-full border border-[#d4ff00]/30 bg-black/60 backdrop-blur-md flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#d4ff00]" />
          </div>
          <div className="space-y-1">
            <span className="telemetry-chip text-[11px] text-[#d4ff00] block tracking-widest">
              ПОДКЛЮЧЕНИЕ СПОРТИВНОГО ВИДЕОПОТОКА (БЕГ В ГОРУ 4K)...
            </span>
            <span className="text-xs text-white/70 font-mono">
              {currentVideo ? currentVideo.title : "Mountain Trail Athletic Stream"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Responsive YouTube Video Background */}
      {hasMounted && currentVideo && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] h-[180vh] min-w-[177.77vh] min-h-[56.25vw] pointer-events-none">
          <iframe
            key={currentVideo.id}
            src={`https://www.youtube-nocookie.com/embed/${currentVideo.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${currentVideo.id}&playsinline=1&rel=0&showinfo=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1`}
            title={`SPORTIFY Live Athletic Stream: ${currentVideo.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      )}

      {/* 3. Darkening & Cinema Grading Overlays */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[0.5px] z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-black/40 to-[#08090b]/80 z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090b]/90 via-transparent to-[#08090b]/80 z-[2]" />

      {/* 4. Telemetry Stream Status Badge (Interactive HUD) */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/80 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse" />
        <Film className="w-3.5 h-3.5 text-[#d4ff00]" />
        <span className="max-w-[210px] truncate">{currentVideo?.title}</span>
        <button
          onClick={handleNextVideo}
          title="Сменить фоновое видео (бег в гору)"
          className="ml-1 p-1 hover:text-[#d4ff00] transition-colors flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 hover:text-white"
        >
          <RefreshCw className="w-3 h-3 hover:rotate-180 transition-transform duration-500" />
          <span>Сменить</span>
        </button>
      </div>
    </div>
  );
}