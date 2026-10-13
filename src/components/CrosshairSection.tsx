import React, { useState } from 'react';
import { Target, Palette, Sparkles, Volume2, RotateCcw } from 'lucide-react';
import { CrosshairSettings } from '../types/settings';
import { DEFAULT_CROSSHAIR } from '../utils/storage';
import { playShotSound, playHitmarkerSound } from '../utils/audio';

interface CrosshairSectionProps {
  crosshair: CrosshairSettings;
  onChangeCrosshair: (updated: Partial<CrosshairSettings>) => void;
  damageHitmarkerFX: boolean;
}

export const CrosshairSection: React.FC<CrosshairSectionProps> = ({
  crosshair,
  onChangeCrosshair,
  damageHitmarkerFX,
}) => {
  const [backdrop, setBackdrop] = useState<'range' | 'desert' | 'night' | 'concrete'>('range');
  const [isFiring, setIsFiring] = useState(false);
  const [shotCount, setShotCount] = useState(0);

  const colors = [
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Amber', hex: '#eab308' },
    { name: 'Crimson', hex: '#ef4444' },
    { name: 'Pure White', hex: '#ffffff' },
    { name: 'Violet', hex: '#a855f7' },
  ];

  const styles: { id: CrosshairSettings['style']; label: string }[] = [
    { id: 'cross', label: 'Classic Cross' },
    { id: 'dot', label: 'Precision Dot' },
    { id: 'circle-dot', label: 'Circle Dot' },
    { id: 'circle', label: 'Hollow Circle' },
    { id: 't-shape', label: 'T-Shape' },
  ];

  const handleTestShot = () => {
    setIsFiring(true);
    setShotCount((c) => c + 1);
    playShotSound();

    if (damageHitmarkerFX) {
      setTimeout(() => {
        playHitmarkerSound(Math.random() > 0.4);
      }, 70);
    }

    setTimeout(() => {
      setIsFiring(false);
    }, 140);
  };

  const getBackdropBg = () => {
    switch (backdrop) {
      case 'desert':
        return 'bg-gradient-to-b from-amber-950/60 via-amber-900/30 to-zinc-950';
      case 'night':
        return 'bg-gradient-to-b from-blue-950/70 via-zinc-950 to-zinc-950';
      case 'concrete':
        return 'bg-gradient-to-b from-zinc-800/80 via-zinc-900 to-zinc-950';
      default:
        return 'bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950';
    }
  };

  const recoilMultiplier = isFiring && crosshair.dynamicRecoilSpread ? 1.6 : 1;
  const currentGap = crosshair.gap * recoilMultiplier;
  const currentSize = crosshair.size;
  const currentThickness = crosshair.thickness;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Tactical Crosshair Customizer
                </h3>
                <p className="text-xs text-zinc-400">
                  Real-time SVG reticle rendering with zero delay. Saved directly to local storage.
                </p>
              </div>

              <button
                onClick={() => onChangeCrosshair(DEFAULT_CROSSHAIR)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Defaults</span>
              </button>
            </div>

            {/* Reticle Style Selector */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-zinc-300 block mb-2">Reticle Geometry</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {styles.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => onChangeCrosshair({ style: st.id })}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition ${
                      crosshair.style === st.id
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-zinc-300 block mb-2">High-Contrast Color</label>
              <div className="flex flex-wrap items-center gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => onChangeCrosshair({ color: c.hex })}
                    title={c.name}
                    className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center border-2 ${
                      crosshair.color === c.hex ? 'scale-110 border-white ring-2 ring-emerald-500/50' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}

                <div className="flex items-center gap-1.5 ml-2 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs">
                  <Palette className="w-3 h-3 text-zinc-400" />
                  <input
                    type="color"
                    value={crosshair.color}
                    onChange={(e) => onChangeCrosshair({ color: e.target.value })}
                    className="w-5 h-5 bg-transparent cursor-pointer rounded border-0 p-0"
                  />
                  <span className="font-mono text-zinc-300 uppercase">{crosshair.color}</span>
                </div>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="space-y-4 pt-3 border-t border-zinc-800/80">
              {/* Size */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Reticle Size</span>
                  <span className="font-mono text-zinc-200 font-bold">{crosshair.size}px</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={30}
                  value={crosshair.size}
                  onChange={(e) => onChangeCrosshair({ size: Number(e.target.value) })}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Gap */}
              {crosshair.style !== 'dot' && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400">Center Gap</span>
                    <span className="font-mono text-zinc-200 font-bold">{crosshair.gap}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={crosshair.gap}
                    onChange={(e) => onChangeCrosshair({ gap: Number(e.target.value) })}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              )}

              {/* Thickness */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Stroke Thickness</span>
                  <span className="font-mono text-zinc-200 font-bold">{crosshair.thickness}px</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={0.5}
                  value={crosshair.thickness}
                  onChange={(e) => onChangeCrosshair({ thickness: Number(e.target.value) })}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Opacity */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Opacity / Alpha</span>
                  <span className="font-mono text-zinc-200 font-bold">{Math.round(crosshair.opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.3}
                  max={1.0}
                  step={0.05}
                  value={crosshair.opacity}
                  onChange={(e) => onChangeCrosshair({ opacity: Number(e.target.value) })}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Toggles */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={crosshair.centerDot}
                    onChange={(e) => onChangeCrosshair({ centerDot: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span>Center Target Dot</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={crosshair.dynamicRecoilSpread}
                    onChange={(e) => onChangeCrosshair({ dynamicRecoilSpread: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span>Dynamic Recoil Spread Bloom</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Live Reticle Range</span>
                <span className="text-[11px] font-mono text-zinc-400">Click preview to test fire</span>
              </div>

              {/* Viewport Box */}
              <div
                onClick={handleTestShot}
                className={`relative w-full aspect-square rounded-2xl border border-zinc-700/80 cursor-crosshair overflow-hidden select-none flex items-center justify-center transition-all ${getBackdropBg()}`}
              >
                {/* Simulated game world grid lines & target silhouette */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Simulated distance target rings */}
                <div className="absolute w-36 h-36 rounded-full border border-dashed border-zinc-600/40 pointer-events-none" />
                <div className="absolute w-24 h-24 rounded-full border border-zinc-600/50 pointer-events-none" />
                <div className="absolute w-12 h-12 rounded-full border border-red-500/30 pointer-events-none" />
                
                {/* Simulated human silhouette target center */}
                <div className="absolute w-8 h-14 bg-zinc-700/30 rounded-t-full pointer-events-none" />
                <div className="absolute w-4 h-4 rounded-full bg-zinc-600/40 -mt-8 pointer-events-none" />

                {/* SVG Rendered Crosshair */}
                <div
                  className="relative z-10 transition-transform duration-75"
                  style={{
                    transform: isFiring ? 'scale(1.1)' : 'scale(1)',
                    opacity: crosshair.opacity,
                  }}
                >
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    className="overflow-visible"
                  >
                    {/* Center Dot */}
                    {(crosshair.centerDot || crosshair.style === 'dot' || crosshair.style === 'circle-dot') && (
                      <circle
                        cx="60"
                        cy="60"
                        r={crosshair.style === 'dot' ? currentSize / 2 : Math.max(1.5, currentThickness / 1.5)}
                        fill={crosshair.color}
                      />
                    )}

                    {/* Crosshair geometry based on style */}
                    {crosshair.style === 'cross' && (
                      <>
                        {/* Top Line */}
                        <line
                          x1="60"
                          y1={60 - currentGap}
                          x2="60"
                          y2={60 - currentGap - currentSize}
                          stroke={crosshair.color}
                          strokeWidth={currentThickness}
                          strokeLinecap="round"
                        />
                        {/* Bottom Line */}
                        <line
                          x1="60"
                          y1={60 + currentGap}
                          x2="60"
                          y2={60 + currentGap + currentSize}
                          stroke={crosshair.color}
                          strokeWidth={currentThickness}
                          strokeLinecap="round"
                        />
                        {/* Left Line */}
                        <line
                          x1={60 - currentGap}
                          y1="60"
                          x2={60 - currentGap - currentSize}
                          y2="60"
                          stroke={crosshair.color}
                          strokeWidth={currentThickness}
                          strokeLinecap="round"
                        />
                        {/* Right Line */}
                        <line
                          x1={60 + currentGap}
                          y1="60"
                          x2={60 + currentGap + currentSize}
                          y2="60"
                          stroke={crosshair.color}
                          strokeWidth={currentThickness}
                          strokeLinecap="round"
                        />
                      </>
                    )}

                    {crosshair.style === 't-shape' && (
                      <>
                        {/* Bottom Line */}
                        <line
                          x1="60"
                          y1={60 + currentGap}
                          x2="60"
                          y2={60 + currentGap + currentSize}
                          stroke={crosshair.color}
                          strokeWidth={currentThickness}
                          strokeLinecap="round"
                        />
                        {/* Left Line */}
                        <line
                          x1={60 - currentGap}
                          y1="60"
                          x2={60 - currentGap - currentSize}
                          y2="60"
                          stroke={crosshair.color}
                          strokeWidth={currentThickness}
                          strokeLinecap="round"
                        />
                        {/* Right Line */}
                        <line
                          x1={60 + currentGap}
                          y1="60"
                          x2={60 + currentGap + currentSize}
                          y2="60"
                          stroke={crosshair.color}
                          strokeWidth={currentThickness}
                          strokeLinecap="round"
                        />
                      </>
                    )}

                    {(crosshair.style === 'circle' || crosshair.style === 'circle-dot') && (
                      <circle
                        cx="60"
                        cy="60"
                        r={currentGap + currentSize / 2}
                        fill="none"
                        stroke={crosshair.color}
                        strokeWidth={currentThickness}
                      />
                    )}

                    {/* Hitmarker FX indicator overlay */}
                    {isFiring && damageHitmarkerFX && (
                      <g stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                        <line x1="53" y1="53" x2="48" y2="48" />
                        <line x1="67" y1="53" x2="72" y2="48" />
                        <line x1="53" y1="67" x2="48" y2="72" />
                        <line x1="67" y1="67" x2="72" y2="72" />
                      </g>
                    )}
                  </svg>
                </div>

                {/* Recoil / Fire banner */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-zinc-400 bg-zinc-950/80 px-2.5 py-1 rounded-lg border border-zinc-800">
                  <span>Shots Tested: {shotCount}</span>
                  <span className={isFiring ? 'text-amber-400 font-bold' : 'text-zinc-500'}>
                    {isFiring ? 'RECOIL BLOOM' : 'READY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Backdrop environment selector */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80">
              <span className="text-xs font-semibold text-zinc-400 block mb-2">Backdrop Atmosphere</span>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {[
                  { id: 'range', label: 'Dark Grid' },
                  { id: 'desert', label: 'Desert' },
                  { id: 'night', label: 'Night Ops' },
                  { id: 'concrete', label: 'Bunker' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBackdrop(b.id as any)}
                    className={`py-1 rounded-lg font-medium transition ${
                      backdrop === b.id
                        ? 'bg-zinc-800 text-white border border-zinc-700'
                        : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-900'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
