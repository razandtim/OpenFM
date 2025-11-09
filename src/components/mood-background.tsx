"use client";

import { usePlayer } from "@/context/player-context";
import { MOOD_CONFIG } from "@/lib/moods";

export const MoodBackground = () => {
  const { currentMood } = usePlayer();
  const mood = MOOD_CONFIG[currentMood];

  // Helpers to produce a nice "dark -> color" gradient per mood
  const hexToRgb = (hex: string) => {
    const m = hex.replace('#','');
    const bigint = parseInt(m.length === 3 ? m.split('').map(c=>c+c).join('') : m, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };
  const mix = (a: {r:number;g:number;b:number}, b:{r:number;g:number;b:number}, t:number) => ({
    r: Math.round(a.r*(1-t)+b.r*t),
    g: Math.round(a.g*(1-t)+b.g*t),
    b: Math.round(a.b*(1-t)+b.b*t),
  });
  const rgbToCss = ({r,g,b}:{r:number;g:number;b:number}) => `rgb(${r}, ${g}, ${b})`;

  const base = hexToRgb(mood.accent);
  const dark = mix(base, {r:0,g:0,b:0}, 0.70); // darker start
  const light = mix(base, {r:255,g:255,b:255}, 0.15); // slightly lighter tail

  const background = `
    linear-gradient(180deg, ${rgbToCss(light)} 0%, ${mood.accent} 40%, ${rgbToCss(dark)} 100%),
    radial-gradient(circle at 70% 120%, rgba(255,255,255,0.08), rgba(255,255,255,0) 60%)
  `;

  return (
    <div
      className="absolute inset-0"
      style={{ background, opacity: 0.75, transition: "background 250ms ease, opacity 150ms ease" }}
      aria-hidden
    />
  );
};
