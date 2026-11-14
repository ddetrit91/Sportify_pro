"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function AmbientSoundController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // Initialize Web Audio API procedural atmospheric sports drone
  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Low-pass filter for smooth, warm gym / stadium atmospheric resonance
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(260, ctx.currentTime);
      filter.connect(masterGain);
      filterNodeRef.current = filter;

      // Oscillator 1: Warm Root drone (55Hz - A1 sub harmonic)
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(55, ctx.currentTime);

      // Oscillator 2: Perfect fifth (82.5Hz - E2)
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(82.4, ctx.currentTime);

      // Oscillator 3: Harmonic octave (110Hz - A2 warm body)
      const osc3 = ctx.createOscillator();
      osc3.type = "triangle";
      osc3.frequency.setValueAtTime(110, ctx.currentTime);

      // LFO for breathing subtle sports pulse (0.25 Hz)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
      lfoGain.gain.setValueAtTime(60, ctx.currentTime);
      lfo.connect(filter.frequency);
      lfo.start();

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);

      osc1.start();
      osc2.start();
      osc3.start();

      oscillatorsRef.current = [osc1, osc2, osc3, lfo];
      setIsPlaying(true);
    } catch (e) {
      console.warn("Web Audio ambient error:", e);
    }
  };

  const stopAudio = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        oscillatorsRef.current = [];
        if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
          audioCtxRef.current.close().catch(() => {});
        }
        setIsPlaying(false);
      }, 850);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  useEffect(() => {
    return () => {
      if (isPlaying) {
        stopAudio();
      }
    };
  }, [isPlaying]);

  return (
    <button
      onClick={toggleSound}
      title={isPlaying ? "Выключить фоновый эмбиент-звук" : "Включить фоновый спортивный эмбиент-звук"}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-semibold ${
        isPlaying
          ? "border-[#d4ff00] bg-[#d4ff00]/15 text-[#d4ff00] shadow-[0_0_12px_rgba(212,255,0,0.3)]"
          : "border-white/10 hover:border-white/30 bg-black/40 text-slate-400 hover:text-white"
      }`}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#d4ff00]" />
          {/* Animated Equalizer Bars */}
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 h-full bg-[#d4ff00] rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-0.5 h-2/3 bg-[#d4ff00] rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-0.5 h-full bg-[#d4ff00] rounded-full animate-bounce [animation-delay:300ms]" />
            <span className="w-0.5 h-1/2 bg-[#d4ff00] rounded-full animate-bounce [animation-delay:200ms]" />
          </div>
          <span className="text-[10px] tracking-wider font-extrabold uppercase hidden sm:inline">ЭМБИЕНТ ВКЛ</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] tracking-wider font-bold uppercase hidden sm:inline">ЭМБИЕНТ ЗВУК</span>
        </>
      )}
    </button>
  );
}