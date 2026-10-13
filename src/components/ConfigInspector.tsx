import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, HardDrive, Trash2, Key } from 'lucide-react';
import { AppSettingsState } from '../types/settings';
import { STORAGE_KEY, clearLocalStorage, exportSettingsAsCfg, exportSettingsAsJson } from '../utils/storage';

interface ConfigInspectorProps {
  state: AppSettingsState;
  storageBytes: number;
  onClearStorage: () => void;
}

export const ConfigInspector: React.FC<ConfigInspectorProps> = ({
  state,
  storageBytes,
  onClearStorage,
}) => {
  const [activeFormat, setActiveFormat] = useState<'json' | 'cfg'>('json');
  const [copied, setCopied] = useState(false);

  const jsonContent = JSON.stringify(state, null, 2);

  const profile = state.profiles.find((p) => p.id === state.activeProfileId) || state.profiles[0];
  const cfgContent = [
    `# ==========================================`,
    `# TACTICAL PRO CONFIG PROFILE: ${profile.name.toUpperCase()}`,
    `# Generated: ${new Date().toISOString()}`,
    `# ==========================================`,
    ``,
    `[GRAPHICS_AND_ENGINE]`,
    `ultra_high_fps=${state.toggles.ultraFps ? '1' : '0'}`,
    `anti_aliasing_fxaa=${state.toggles.antiAliasing ? '1' : '0'}`,
    `vertical_sync=${state.toggles.vSync ? '1' : '0'}`,
    `low_spec_optimization=${state.toggles.lowSpecMode ? '1' : '0'}`,
    ``,
    `[CONTROLS_AND_TRIGGERS]`,
    `gyroscope_continuous=${state.toggles.gyroscopeAlwaysOn ? '1' : '0'}`,
    `quick_weapon_switch=${state.toggles.quickWeaponSwitch ? '1' : '0'}`,
    `dedicated_left_fire=${state.toggles.leftFireButton ? '1' : '0'}`,
    `auto_pickup_priority=${state.toggles.autoPickupLoot ? '1' : '0'}`,
    `auto_reload_empty_mag=${state.toggles.autoReloadOnEmpty ? '1' : '0'}`,
    `free_look_360_peek=${state.toggles.freeLook360 ? '1' : '0'}`,
    `camera_acceleration_curve=${state.toggles.cameraAcceleration ? '1' : '0'}`,
    ``,
    `[AUDIO_AND_HAPTICS]`,
    `binaural_spatial_audio=${state.toggles.spatialAudio3D ? '1' : '0'}`,
    `footstep_eq_boost=${state.toggles.footstepBoostEQ ? '1' : '0'}`,
    `tactile_vibration_fx=${state.toggles.vibrationFeedback ? '1' : '0'}`,
    `damage_hitmarker_indicator=${state.toggles.damageHitmarkerFX ? '1' : '0'}`,
    ``,
    `[SENSITIVITY_SCALING]`,
    `sens_general=${state.sensitivities.general}`,
    `sens_red_dot=${state.sensitivities.redDot}`,
    `sens_2x_scope=${state.sensitivities.scope2x}`,
    `sens_4x_scope=${state.sensitivities.scope4x}`,
    `sens_sniper_scope=${state.sensitivities.sniperScope}`,
    `sens_free_look=${state.sensitivities.freeLook}`,
    `dpi_hardware_reference=${state.sensitivities.deviceDpi}`,
    ``,
    `[RETICLE_CROSSHAIR]`,
    `crosshair_style=${state.crosshair.style}`,
    `crosshair_hex_color=${state.crosshair.color}`,
    `crosshair_size_px=${state.crosshair.size}`,
    `crosshair_gap_px=${state.crosshair.gap}`,
    `crosshair_thickness_px=${state.crosshair.thickness}`,
    `crosshair_center_dot=${state.crosshair.centerDot ? '1' : '0'}`,
    `crosshair_recoil_bloom=${state.crosshair.dynamicRecoilSpread ? '1' : '0'}`,
  ].join('\n');

  const contentToDisplay = activeFormat === 'json' ? jsonContent : cfgContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(contentToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <Key className="w-3.5 h-3.5 text-emerald-400" />
            <span>Storage Storage Key</span>
          </div>
          <span className="font-mono text-xs text-white break-all">{STORAGE_KEY}</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            <span>Storage Footprint</span>
          </div>
          <span className="font-mono text-xs text-white font-bold">
            {storageBytes} bytes ({(storageBytes / 1024).toFixed(2)} KB)
          </span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 block mb-0.5">Stored Profiles</span>
            <span className="font-mono text-sm text-emerald-400 font-bold">
              {state.profiles.length} Presets Available
            </span>
          </div>
          <button
            onClick={onClearStorage}
            title="Wipe local storage and revert to initial defaults"
            className="px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe Storage</span>
          </button>
        </div>
      </div>

      {/* Editor & Viewer */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveFormat('json')}
              className={`px-3 py-1 rounded font-medium transition ${
                activeFormat === 'json' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              JSON Structure
            </button>
            <button
              onClick={() => setActiveFormat('cfg')}
              className={`px-3 py-1 rounded font-medium transition ${
                activeFormat === 'cfg' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Game .CFG Format
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            {activeFormat === 'json' ? (
              <button
                onClick={() => exportSettingsAsJson(state)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json</span>
              </button>
            ) : (
              <button
                onClick={() => exportSettingsAsCfg(state)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 transition"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Download .cfg</span>
              </button>
            )}
          </div>
        </div>

        {/* Code View */}
        <div className="p-4 bg-zinc-950/90 font-mono text-xs overflow-x-auto max-h-96 text-zinc-300">
          <pre>{contentToDisplay}</pre>
        </div>
      </div>
    </div>
  );
};
