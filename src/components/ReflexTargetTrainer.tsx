import React, { useState, useEffect, useRef } from 'react';
import { Target, Play, RotateCcw, Trophy, Zap, Crosshair } from 'lucide-react';
import { CrosshairSettings, ToggleSettings } from '../types/settings';
import { playShotSound, playHitmarkerSound } from '../utils/audio';

interface ReflexTargetTrainerProps {
  crosshair: CrosshairSettings;
  toggles: ToggleSettings;
}

interface TargetEntity {
  id: number;
  x: number; // percentage 10% to 90%
  y: number; // percentage 15% to 85%
  size: number;
  spawnTime: number;
  isHeadshot: boolean;
}

export const ReflexTargetTrainer: React.FC<ReflexTargetTrainerProps> = ({
  crosshair,
  toggles,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [totalShots, setTotalShots] = useState(0);
  const [hits, setHits] = useState(0);
  const [headshots, setHeadshots] = useState(0);
  const [lastReactionTime, setLastReactionTime] = useState<number | null>(null);
  const [bestReactionTime, setBestReactionTime] = useState<number | null>(null);
  const [currentTarget, setCurrentTarget] = useState<TargetEntity | null>(null);
  const [floatingFeedback, setFloatingFeedback] = useState<{ x: number; y: number; text: string; color: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const spawnNewTarget = () => {
    const x = Math.floor(Math.random() * 70) + 15;
    const y = Math.floor(Math.random() * 65) + 18;
    const isHead = Math.random() < 0.35;
    setCurrentTarget({
      id: Date.now(),
      x,
      y,
      size: isHead ? 36 : 52,
      spawnTime: performance.now(),
      isHeadshot: isHead,
    });
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTotalShots(0);
    setHits(0);
    setHeadshots(0);
    setLastReactionTime(null);
    spawnNewTarget();
  };

  const stopGame = () => {
    setIsPlaying(false);
    setCurrentTarget(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying) return;
    setTotalShots((s) => s + 1);
    playShotSound();

    // Haptic vibration feedback if enabled
    if (toggles.vibrationFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
  };

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPlaying || !currentTarget) return;

    const reaction = Math.round(performance.now() - currentTarget.spawnTime);
    setLastReactionTime(reaction);
    if (!bestReactionTime || reaction < bestReactionTime) {
      setBestReactionTime(reaction);
    }

    setHits((h) => h + 1);
    setTotalShots((s) => s + 1);

    const isHead = currentTarget.isHeadshot;
    if (isHead) {
      setHeadshots((h) => h + 1);
      setScore((sc) => sc + 150);
    } else {
      setScore((sc) => sc + 100);
    }

    // Hitmarker audio
    if (toggles.damageHitmarkerFX) {
      playHitmarkerSound(isHead);
    }

    // Haptic vibration
    if (toggles.vibrationFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(isHead ? 60 : 35);
    }

    // Floating text indicator
    setFloatingFeedback({
      x: currentTarget.x,
      y: currentTarget.y,
      text: isHead ? `HEADSHOT! ${reaction}ms` : `HIT ${reaction}ms`,
      color: isHead ? '#ef4444' : '#10b981',
    });

    setTimeout(() => {
      setFloatingFeedback(null);
    }, 700);

    spawnNewTarget();
  };

  const accuracy = totalShots > 0 ? Math.round((hits / totalShots) * 100) : 0;

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
      {/* Title & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            Tactical Reflex &amp; Drag Precision Range
          </h3>
          <p className="text-xs text-zinc-400">
            Test and verify your active crosshair, hitmarker audio, and vibration feedback in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isPlaying ? (
            <button
              onClick={startGame}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start Reflex Test</span>
            </button>
          ) : (
            <button
              onClick={stopGame}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>End Test</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3">
          <span className="text-zinc-500 block mb-1">Score</span>
          <span className="text-base font-mono font-bold text-emerald-400">{score}</span>
        </div>
        <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3">
          <span className="text-zinc-500 block mb-1">Accuracy</span>
          <span className="text-base font-mono font-bold text-white">{accuracy}%</span>
        </div>
        <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3">
          <span className="text-zinc-500 block mb-1">Last Reaction</span>
          <span className="text-base font-mono font-bold text-cyan-400">
            {lastReactionTime !== null ? `${lastReactionTime} ms` : '--'}
          </span>
        </div>
        <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3">
          <span className="text-zinc-500 block mb-1">Headshot Count</span>
          <span className="text-base font-mono font-bold text-rose-400">{headshots}</span>
        </div>
      </div>

      {/* Interactive Arena */}
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className="relative w-full h-80 sm:h-96 rounded-2xl bg-zinc-950 border border-zinc-800 select-none overflow-hidden cursor-crosshair flex items-center justify-center"
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

        {!isPlaying && (
          <div className="text-center p-6 max-w-sm pointer-events-none z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Crosshair className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Range Standby</h4>
            <p className="text-xs text-zinc-400 mb-4">
              Click Start to spawn moving targets. Test your aiming flicks and hear your custom synthesized hitmarker cues.
            </p>
          </div>
        )}

        {/* Current Target Entity */}
        {isPlaying && currentTarget && (
          <div
            onClick={handleTargetClick}
            style={{
              left: `${currentTarget.x}%`,
              top: `${currentTarget.y}%`,
              width: `${currentTarget.size}px`,
              height: `${currentTarget.size}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center animate-pulse ${
              currentTarget.isHeadshot
                ? 'bg-rose-500/20 border-2 border-rose-500 shadow-lg shadow-rose-950/50'
                : 'bg-emerald-500/20 border-2 border-emerald-500 shadow-lg shadow-emerald-950/50'
            }`}
          >
            {/* Inner bullseye ring */}
            <div
              className={`rounded-full ${
                currentTarget.isHeadshot ? 'w-3 h-3 bg-rose-500' : 'w-4 h-4 bg-emerald-400'
              }`}
            />
            {currentTarget.isHeadshot && (
              <span className="absolute -top-4 font-mono text-[9px] font-bold text-rose-400">
                HEAD
              </span>
            )}
          </div>
        )}

        {/* Floating feedback animation text */}
        {floatingFeedback && (
          <div
            style={{
              left: `${floatingFeedback.x}%`,
              top: `${floatingFeedback.y - 8}%`,
              transform: 'translate(-50%, -50%)',
              color: floatingFeedback.color,
            }}
            className="absolute font-mono text-xs font-bold pointer-events-none transition-all duration-300 animate-bounce drop-shadow"
          >
            {floatingFeedback.text}
          </div>
        )}

        {/* Mini Crosshair floating hint */}
        <div className="absolute bottom-3 left-4 text-[11px] font-mono text-zinc-500 pointer-events-none flex items-center gap-3">
          <span>Hitmarkers: {toggles.damageHitmarkerFX ? 'Audio ON' : 'Muted'}</span>
          <span>·</span>
          <span>Haptics: {toggles.vibrationFeedback ? 'Active' : 'Disabled'}</span>
        </div>
      </div>
    </div>
  );
};
