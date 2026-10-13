import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToggleItemProps {
  id: string;
  title: string;
  description: string;
  category: string;
  impactTag?: string;
  impactType?: 'perf' | 'tactical' | 'audio' | 'battery';
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: LucideIcon;
}

export const ToggleItem: React.FC<ToggleItemProps> = ({
  id,
  title,
  description,
  category,
  impactTag,
  impactType = 'tactical',
  checked,
  onChange,
  icon: Icon,
}) => {
  const getBadgeColor = () => {
    switch (impactType) {
      case 'perf':
        return 'text-emerald-400';
      case 'battery':
        return 'text-amber-400';
      case 'audio':
        return 'text-cyan-400';
      default:
        return 'text-zinc-400';
    }
  };

  return (
    <div
      onClick={() => onChange(!checked)}
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
        checked
          ? 'bg-zinc-900/90 border-emerald-500/40 hover:border-emerald-500/60 shadow-sm shadow-emerald-950/20'
          : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/80 opacity-80 hover:opacity-100'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg transition-colors ${
                checked
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/40'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-xs mt-0.5">
                <span className="text-zinc-400">{category}</span>
                {impactTag && (
                  <>
                    <span className="text-zinc-600" aria-hidden="true">·</span>
                    <span className={`font-mono ${getBadgeColor()}`}>{impactTag}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Switch toggle control */}
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={`Toggle ${title}`}
            onClick={(e) => {
              e.stopPropagation();
              onChange(!checked);
            }}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              checked ? 'bg-emerald-500' : 'bg-zinc-700'
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                checked ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed mt-1">
          {description}
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-zinc-800/50 flex items-center justify-between text-[11px] text-zinc-400">
        <span className="font-mono">
          State: <strong className={checked ? 'text-emerald-400' : 'text-zinc-400'}>{checked ? 'ENABLED' : 'DISABLED'}</strong>
        </span>
        <span className="text-zinc-400 group-hover:text-zinc-300 transition">
          Click card to toggle
        </span>
      </div>
    </div>
  );
};
