import React from 'react';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';
import { Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CHIP_CONFIG = {
  frontend: {
    label: 'Senior Frontend Engineer',
    dotColor: 'bg-cyan-500',
    activeClass: 'border-cyan-500 bg-cyan-50/70 text-cyan-900 shadow-md shadow-cyan-500/10 ring-2 ring-cyan-500/30',
    hoverClass: 'hover:border-cyan-400 hover:bg-cyan-50/30 hover:text-cyan-900',
  },
  backend: {
    label: 'Backend & Cloud Engineer',
    dotColor: 'bg-indigo-600',
    activeClass: 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-md shadow-indigo-600/10 ring-2 ring-indigo-600/30',
    hoverClass: 'hover:border-indigo-400 hover:bg-indigo-50/30 hover:text-indigo-900',
  },
  'data-analyst': {
    label: 'AI / Data Scientist',
    dotColor: 'bg-rose-500',
    activeClass: 'border-rose-500 bg-rose-50/70 text-rose-900 shadow-md shadow-rose-500/10 ring-2 ring-rose-500/30',
    hoverClass: 'hover:border-rose-400 hover:bg-rose-50/30 hover:text-rose-900',
  },
};

export default function SampleProfileSelector({ onSelectProfile, activeProfileId }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.15 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-3 py-1"
    >
      <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 tracking-wide uppercase">
        <Zap className="w-3.5 h-3.5 text-indigo-600" />
        <span>1-Click Test Profiles:</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {SAMPLE_PROFILES.map((profile) => {
          const isActive = activeProfileId === profile.id;
          const config = CHIP_CONFIG[profile.id] || CHIP_CONFIG.frontend;

          return (
            <motion.button
              key={profile.id}
              type="button"
              onClick={() => onSelectProfile(profile)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border flex items-center space-x-2.5 ${
                isActive
                  ? `${config.activeClass}`
                  : `bg-white text-slate-700 border-slate-200 shadow-sm ${config.hoverClass}`
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor} ${isActive ? 'animate-pulse' : ''}`} />
              <span>{config.label}</span>
              {isActive && (
                <CheckCircle2 className="w-3.5 h-3.5 text-current" />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
