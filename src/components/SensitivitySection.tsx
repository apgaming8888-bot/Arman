import React from 'react';
import { Sliders, Crosshair, Target, Eye, Cpu, Zap, RotateCcw } from 'lucide-react';
import { SensitivitySettings } from '../types/settings';
import { DEFAULT_SENSITIVITIES } from '../utils/storage';

interface SensitivitySectionProps {
  sensitivities: SensitivitySettings;
  onChangeSensitivity: (key: keyof SensitivitySettings, value: number) => void;
  onApplySensPreset: (preset: SensitivitySettings) => void;
}

export const SensitivitySection: React.FC<SensitivitySectionProps> = ({
  sensitivities,
  onChangeSensitivity,
  onApplySensPreset,
}) => {
  const sensControls: {
    key: keyof SensitivitySettings;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    min: number;
    max: number;
    step: number;
  }[] = [
    {
      key: 'general',
      label: 'General Camera Look',
      description: 'Controls non-ADS hipfire view speed, quick turns, and fast 180° flick responses.',
      icon: <Target className="w-4 h-4 text-emerald-400" />,
      color: 'accent-emerald-500',
      min: 0,
      max: 100,
      step: 1,
    },
    {
      key: 'redDot',
      label: 'Red Dot / Holographic Sight',
      description: 'Sensitivity for 1x iron sights and unmagnified reflex scopes during drag shots.',
      icon: <Crosshair className="w-4 h-4 text-cyan-400" />,
      color: 'accent-cyan-500',
      min: 0,
      max: 100,
      step: 1,
    },
    {
      key: 'scope2x',
      label: '2x Scope',
      description: 'Mid-range rifle magnification tracking for spray transfers and burst tapping.',
      icon: <Sliders className="w-4 h-4 text-blue-400" />,
      color: 'accent-blue-500',
      min: 0,
      max: 100,
      step: 1,
    },
    {
      key: 'scope4x',
      label: '4x Scope',
      description: 'Marksman DMR and assault rifle long-range recoil compensation tracking.',
      icon: <Sliders className="w-4 h-4 text-indigo-400" />,
      color: 'accent-indigo-500',
      min: 0,
      max: 100,
      step: 1,
    },
    {
      key: 'sniperScope',
      label: 'Sniper Scope (8x / High Zoom)',
      description: 'Heavy bolt-action sniper rifle tracking (AWM, Kar98k, M82B) precision.',
      icon: <Target className="w-4 h-4 text-purple-400" />,
      color: 'accent-purple-500',
      min: 0,
      max: 100,
      step: 1,
    },
    {
      key: 'freeLook',
      label: 'Free Look Eye Sensor',
      description: 'Eye icon swivel sensitivity when scouting flanks while in auto-sprint.',
      icon: <Eye className="w-4 h-4 text-amber-400" />,
      color: 'accent-amber-500',
      min: 0,
      max: 100,
      step: 1,
    },
  ];

  // Calculate effective DPI
  const effectiveDpi = Math.round((sensitivities.general * sensitivities.deviceDpi) / 100);

  const presets = [
    {
      name: 'High Flick (Drag Headshot)',
      desc: 'Optimized for high-drag vertical swipes on mobile displays.',
      data: {
        general: 98,
        redDot: 92,
        scope2x: 88,
        scope4x: 80,
        sniperScope: 62,
        freeLook: 75,
        deviceDpi: 460,
      },
    },
    {
      name: 'Tournament Balanced',
      desc: 'Standard pro competitive ratio across all scope zoom ranges.',
      data: {
        general: 90,
        redDot: 84,
        scope2x: 78,
        scope4x: 70,
        sniperScope: 52,
        freeLook: 65,
        deviceDpi: 440,
      },
    },
    {
      name: 'Controlled Low-Sens',
      desc: 'Maximum spray stabilization and steady horizontal tracking.',
      data: {
        general: 75,
        redDot: 68,
        scope2x: 60,
        scope4x: 50,
        sniperScope: 40,
        freeLook: 55,
        deviceDpi: 400,
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & DPI Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hardware DPI & eDPI Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Device Hardware DPI</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Calibrate to your phone screen touch sampling rate or mouse sensor DPI.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Current Sensor DPI</span>
                <span className="font-mono text-emerald-400 font-bold">{sensitivities.deviceDpi} DPI</span>
              </div>
              <input
                type="range"
                min={320}
                max={1000}
                step={10}
                value={sensitivities.deviceDpi}
                onChange={(e) => onChangeSensitivity('deviceDpi', Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>320 DPI (Default)</span>
                <span>440 DPI (Pro)</span>
                <span>800+ DPI</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-xs text-zinc-400">Effective eDPI:</span>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {effectiveDpi} eDPI
            </span>
          </div>
        </div>

        {/* Presets & Curve Overview */}
        <div className="lg:col-span-2 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Pro Sensitivity Presets</h3>
              <p className="text-xs text-zinc-400">
                Instantly apply tested sensitivity curves. Auto-saves directly to localStorage.
              </p>
            </div>
            <button
              onClick={() => onApplySensPreset(DEFAULT_SENSITIVITIES)}
              title="Reset sensitivity sliders"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onApplySensPreset(preset.data)}
                className="text-left p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/50 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-200 group-hover:text-emerald-400 transition">
                    {preset.name}
                  </span>
                  <Zap className="w-3 h-3 text-zinc-500 group-hover:text-emerald-400 transition" />
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2">
                  {preset.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Visual Zoom Scale Bar chart */}
          <div className="bg-zinc-950/90 rounded-xl p-3 border border-zinc-800/80">
            <span className="text-[11px] font-mono text-zinc-400 block mb-2">Sensitivity Curve Ratio by Magnification:</span>
            <div className="grid grid-cols-6 gap-2 text-center">
              {[
                { name: 'General', val: sensitivities.general, color: 'bg-emerald-500' },
                { name: 'Red Dot', val: sensitivities.redDot, color: 'bg-cyan-500' },
                { name: '2x', val: sensitivities.scope2x, color: 'bg-blue-500' },
                { name: '4x', val: sensitivities.scope4x, color: 'bg-indigo-500' },
                { name: 'Sniper', val: sensitivities.sniperScope, color: 'bg-purple-500' },
                { name: 'Eye', val: sensitivities.freeLook, color: 'bg-amber-500' },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="h-16 bg-zinc-900 rounded flex items-end p-0.5">
                    <div
                      className={`w-full ${item.color} rounded-sm transition-all duration-300`}
                      style={{ height: `${item.val}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono block">{item.name}</span>
                  <span className="text-xs font-bold text-white font-mono block">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sensControls.map((control) => {
          const value = sensitivities[control.key];
          return (
            <div
              key={control.key}
              className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700/80 rounded-xl p-4 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/40">
                    {control.icon}
                  </div>
                  <span className="text-sm font-semibold text-zinc-100">{control.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={control.min}
                    max={control.max}
                    value={value}
                    onChange={(e) => {
                      const num = Math.min(control.max, Math.max(control.min, Number(e.target.value) || 0));
                      onChangeSensitivity(control.key, num);
                    }}
                    className="w-14 text-center font-mono font-bold text-xs bg-zinc-950 border border-zinc-800 rounded px-1.5 py-1 text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs font-mono text-zinc-400">%</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                {control.description}
              </p>

              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={value}
                onChange={(e) => onChangeSensitivity(control.key, Number(e.target.value))}
                className={`w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer ${control.color}`}
              />

              <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1.5">
                <span>0 (Slow)</span>
                <span>50 (Standard)</span>
                <span>100 (Max Flick)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
