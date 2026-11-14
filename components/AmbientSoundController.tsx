"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function AmbientSoundController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Pre-initialize audio element with Dark Cinematic Ambient Beat by Rockot
    const audio = new Audio("/audio/dark-cinematic-ambient.mp3");
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const fadeIn = (targetVolume = 0.35, duration = 1200) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const stepTime = 50;
    const steps = duration / stepTime;
    const stepVolume = targetVolume / steps;

    audioRef.current.volume = 0;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        fadeIntervalRef.current = setInterval(() => {
          if (!audioRef.current) return;
          if (audioRef.current.volume + stepVolume >= targetVolume) {
            audioRef.current.volume = targetVolume;
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          } else {
            audioRef.current.volume = Math.min(targetVolume, audioRef.current.volume + stepVolume);
          }
        }, stepTime);
      })
      .catch((e) => {
        console.warn("Audio autoplay blocked by browser policy:", e);
        setIsPlaying(false);
      });
  };

  const fadeOut = (duration = 900) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const currentVol = audioRef.current.volume || 0.35;
    const stepTime = 50;
    const steps = duration / stepTime;
    const stepVolume = currentVol / steps;

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return;
      if (audioRef.current.volume - stepVolume <= 0.02) {
        audioRef.current.volume = 0;
        audioRef.current.pause();
        setIsPlaying(false);
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      } else {
        audioRef.current.volume = Math.max(0, audioRef.current.volume - stepVolume);
      }
    }, stepTime);
  };

  const toggleSound = () => {
    if (isPlaying) {
      fadeOut();
    } else {
      fadeIn();
    }
  };

  return (
    <button
      onClick={toggleSound}
      title={
        isPlaying
          ? "Выключить: Dark Cinematic Ambient Beat (Rockot)"
          : "Включить: Dark Cinematic Ambient Beat (Rockot)"
      }
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-semibold ${
        isPlaying
          ? "border-[#d4ff00] bg-[#d4ff00]/15 text-[#d4ff00] shadow-[0_0_14px_rgba(212,255,0,0.35)]"
          : "border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 bg-white/70 dark:bg-black/40 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
      }`}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#d4ff00] animate-pulse" />
          {/* Animated Equalizer Bars */}
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 h-full bg-[#d4ff00] rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-0.5 h-2/3 bg-[#d4ff00] rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-0.5 h-full bg-[#d4ff00] rounded-full animate-bounce [animation-delay:300ms]" />
            <span className="w-0.5 h-1/2 bg-[#d4ff00] rounded-full animate-bounce [animation-delay:200ms]" />
          </div>
          <span className="text-[10px] tracking-wider font-extrabold uppercase hidden sm:inline">
            DARK AMBIENT BEAT
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] tracking-wider font-bold uppercase hidden sm:inline">
            ЭМБИЕНТ ЗВУК
          </span>
        </>
      )}
    </button>
  );
}
