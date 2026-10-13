import React, { useState } from 'react';
import { 
  Crosshair, 
  Tv, 
  Smartphone, 
  Volume2, 
  Layers, 
  Zap, 
  Flame, 
  Eye, 
  Compass, 
  Vibrate, 
  VolumeX, 
  Gauge, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  RotateCw,
  Search,
  Filter
} from 'lucide-react';
import { ToggleSettings } from '../types/settings';
import { ToggleItem } from './ToggleItem';

interface TogglesSectionProps {
  toggles: ToggleSettings;
  onChangeToggle: (key: keyof ToggleSettings, value: boolean) => void;
  onApplyBatch: (updated: Partial<ToggleSettings>) => void;
}

export const TogglesSection: React.FC<TogglesSectionProps> = ({
  toggles,
  onChangeToggle,
  onApplyBatch,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'combat' | 'graphics' | 'motion' | 'audio'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDefinitions = [
    // Combat & Controls
    {
      key: 'quickWeaponSwitch' as keyof ToggleSettings,
      category: 'combat',
      categoryLabel: 'Combat & HUD',
      title: 'Quick Weapon Switch Overlay',
      description: 'Activates a secondary floating trigger button for instant 1-tap weapon slot swapping and cancel animations.',
      impactTag: 'Zero Delay',
      impactType: 'tactical' as const,
      icon: Flame,
    },
    {
      key: 'leftFireButton' as keyof ToggleSettings,
      category: 'combat',
      categoryLabel: 'Combat & HUD',
      title: 'Dedicated Left Fire Button',
      description: 'Permanently positions a fire button on the left zone to support 3-finger and 4-finger claw grip layouts.',
      impactTag: 'Claw Ergonomics',
      impactType: 'tactical' as const,
      icon: Crosshair,
    },
    {
      key: 'autoReloadOnEmpty' as keyof ToggleSettings,
      category: 'combat',
      categoryLabel: 'Combat & HUD',
      title: 'Auto Reload on Depleted Magazine',
      description: 'Automatically queues reload cycle immediately when magazine reaches zero ammo without extra manual tap.',
      impactTag: 'Combat Automation',
      impactType: 'tactical' as const,
      icon: RotateCw,
    },
    {
      key: 'damageHitmarkerFX' as keyof ToggleSettings,
      category: 'combat',
      categoryLabel: 'Combat & HUD',
      title: 'Damage Hitmarker & Audio Chirp',
      description: 'Renders directional visual crosshair flash and plays high-pitch acoustic confirmation on confirmed target impacts.',
      impactTag: 'Hit Feedback',
      impactType: 'audio' as const,
      icon: Zap,
    },
    {
      key: 'freeLook360' as keyof ToggleSettings,
      category: 'combat',
      categoryLabel: 'Combat & HUD',
      title: '360° Free Look Eye Camera',
      description: 'Enables independent camera swivel icon allowing 360-degree situational awareness while running in a sprint lock.',
      impactTag: 'Awareness',
      impactType: 'tactical' as const,
      icon: Eye,
    },

    // Graphics & Performance
    {
      key: 'ultraFps' as keyof ToggleSettings,
      category: 'graphics',
      categoryLabel: 'Graphics & Engine',
      title: 'Ultra High FPS Render Mode (120Hz)',
      description: 'Unlocks maximum display refresh rate pipeline (90-120 FPS target) to minimize display input lag and motion blur.',
      impactTag: 'Ultra Low Latency',
      impactType: 'perf' as const,
      icon: Gauge,
    },
    {
      key: 'antiAliasing' as keyof ToggleSettings,
      category: 'graphics',
      categoryLabel: 'Graphics & Engine',
      title: 'FXAA Sub-Pixel Anti-Aliasing',
      description: 'Applies fast approximate anti-aliasing to smooth jagged edges and distant character silhouettes.',
      impactTag: 'Visual Crispness',
      impactType: 'perf' as const,
      icon: Tv,
    },
    {
      key: 'vSync' as keyof ToggleSettings,
      category: 'graphics',
      categoryLabel: 'Graphics & Engine',
      title: 'Vertical Sync (V-Sync)',
      description: 'Synchronizes frame drawing with display refresh intervals to prevent screen tearing during aggressive panning.',
      impactTag: 'Tear Prevention',
      impactType: 'perf' as const,
      icon: Layers,
    },
    {
      key: 'lowSpecMode' as keyof ToggleSettings,
      category: 'graphics',
      categoryLabel: 'Graphics & Engine',
      title: 'Low-Spec Battery & Thermal Guard',
      description: 'Disables dynamic background ambient smoke, post-processing blooms, and shadow cascades to preserve battery.',
      impactTag: 'Saves Battery',
      impactType: 'battery' as const,
      icon: Sparkles,
    },

    // Motion & Gyro
    {
      key: 'gyroscopeAlwaysOn' as keyof ToggleSettings,
      category: 'motion',
      categoryLabel: 'Motion & Gyro',
      title: 'Gyroscope Always Active',
      description: 'Keeps device tilt tracking active during both hip-fire and scoped view rather than only scoped mode.',
      impactTag: 'Micro-Recoil Control',
      impactType: 'tactical' as const,
      icon: Compass,
    },
    {
      key: 'cameraAcceleration' as keyof ToggleSettings,
      category: 'motion',
      categoryLabel: 'Motion & Gyro',
      title: 'Velocity Camera Acceleration',
      description: 'Adjusts turning speed based on flick speed rather than standard 1:1 linear distance swipe.',
      impactTag: 'Flick Scaling',
      impactType: 'tactical' as const,
      icon: Smartphone,
    },

    // Audio & Haptics
    {
      key: 'spatialAudio3D' as keyof ToggleSettings,
      category: 'audio',
      categoryLabel: 'Audio & Haptics',
      title: '3D Spatial Surround Audio',
      description: 'Uses HRTF binaural sound modeling to accurately separate enemy footsteps above, below, and behind you.',
      impactTag: 'Directional 360°',
      impactType: 'audio' as const,
      icon: Volume2,
    },
    {
      key: 'footstepBoostEQ' as keyof ToggleSettings,
      category: 'audio',
      categoryLabel: 'Audio & Haptics',
      title: 'Tactical Footstep EQ Equalizer',
      description: 'Amplifies 2kHz-4kHz frequency range while lowering ambient explosion bass to prioritize footsteps and reloads.',
      impactTag: 'Acoustic Clarity',
      impactType: 'audio' as const,
      icon: Volume2,
    },
    {
      key: 'vibrationFeedback' as keyof ToggleSettings,
      category: 'audio',
      categoryLabel: 'Audio & Haptics',
      title: 'Tactile Haptic Vibration FX',
      description: 'Fires subtle vibration motors on device when taking fire or confirming sniper impacts.',
      impactTag: 'Haptic Confirm',
      impactType: 'tactical' as const,
      icon: Vibrate,
    },
    {
      key: 'autoPickupLoot' as keyof ToggleSettings,
      category: 'combat',
      categoryLabel: 'Combat & HUD',
      title: 'Smart Auto-Pickup Priority',
      description: 'Prioritizes high-tier armor, attachments, and medical kits upon touching loot crates without opening inventory.',
      impactTag: 'Loot Speed',
      impactType: 'tactical' as const,
      icon: Check,
    },
    {
      key: 'streamerPrivacyMode' as keyof ToggleSettings,
      category: 'combat',
      categoryLabel: 'Utility & Privacy',
      title: 'Streamer Privacy & Anonymity HUD',
      description: 'Masks player UUID, UID, and match invite codes on screen during capture to prevent stream-sniping.',
      impactTag: 'Anti-Sniping',
      impactType: 'tactical' as const,
      icon: ShieldAlert,
    },
  ];

  const activeCount = Object.values(toggles).filter(Boolean).length;
  const totalCount = toggleDefinitions.length;

  const filteredItems = toggleDefinitions.filter((item) => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Banner & Quick Batch Presets */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-white">Tactical Gameplay Toggles</h2>
              <span className="text-xs text-zinc-400">
                ({activeCount} of {totalCount} active)
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl">
              All toggles are instantly persisted to your browser's <strong className="text-emerald-400 font-semibold">localStorage</strong>. Preferences remain saved between sessions, device restarts, and browser reloads.
            </p>
          </div>

          {/* Quick preset switches */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium mr-1">Quick Apply:</span>
            <button
              onClick={() =>
                onApplyBatch({
                  ultraFps: true,
                  antiAliasing: true,
                  quickWeaponSwitch: true,
                  leftFireButton: true,
                  damageHitmarkerFX: true,
                  spatialAudio3D: true,
                  footstepBoostEQ: true,
                  gyroscopeAlwaysOn: true,
                  lowSpecMode: false,
                })
              }
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Competitive Rush</span>
            </button>

            <button
              onClick={() =>
                onApplyBatch({
                  ultraFps: false,
                  antiAliasing: false,
                  vSync: true,
                  lowSpecMode: true,
                  damageHitmarkerFX: false,
                  spatialAudio3D: false,
                  vibrationFeedback: false,
                })
              }
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Battery Saver</span>
            </button>

            <button
              onClick={() => {
                const allTrue: Partial<ToggleSettings> = {};
                toggleDefinitions.forEach((d) => (allTrue[d.key] = true));
                onApplyBatch(allTrue);
              }}
              className="px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 rounded-lg transition"
            >
              All On
            </button>

            <button
              onClick={() => {
                const allFalse: Partial<ToggleSettings> = {};
                toggleDefinitions.forEach((d) => (allFalse[d.key] = false));
                onApplyBatch(allFalse);
              }}
              className="px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 rounded-lg transition"
            >
              All Off
            </button>
          </div>
        </div>

        {/* Filter bar & Search */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Segmented control filter tabs */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs overflow-x-auto">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterCategory === 'all'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Features ({totalCount})
            </button>
            <button
              onClick={() => setFilterCategory('combat')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterCategory === 'combat'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Combat &amp; HUD
            </button>
            <button
              onClick={() => setFilterCategory('graphics')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterCategory === 'graphics'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Graphics
            </button>
            <button
              onClick={() => setFilterCategory('motion')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterCategory === 'motion'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Gyro &amp; Motion
            </button>
            <button
              onClick={() => setFilterCategory('audio')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterCategory === 'audio'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Audio &amp; Haptics
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search toggles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Toggles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <ToggleItem
            key={item.key}
            id={item.key}
            title={item.title}
            description={item.description}
            category={item.categoryLabel}
            impactTag={item.impactTag}
            impactType={item.impactType}
            checked={!!toggles[item.key]}
            onChange={(val) => onChangeToggle(item.key, val)}
            icon={item.icon}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl">
          <p className="text-zinc-400 text-sm">No toggles match your search or filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('all');
            }}
            className="mt-3 text-xs text-emerald-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
