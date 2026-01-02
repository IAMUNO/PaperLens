import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, FileText, Globe, Image as ImageIcon } from 'lucide-react';

const InputSelection = ({ inputType, setInputType }) => {
    const options = [
        { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'from-red-500 to-rose-600' },
        { id: 'pdf', label: 'PDF', icon: FileText, color: 'from-orange-400 to-amber-500' },
        { id: 'web', label: 'Website', icon: Globe, color: 'from-blue-400 to-cyan-500' },
        { id: 'image', label: 'Image', icon: ImageIcon, color: 'from-purple-500 to-violet-600' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {options.map((option) => {
                const isActive = inputType === option.id;
                const Icon = option.icon;

                return (
                    <motion.button
                        key={option.id}
                        onClick={() => setInputType(option.id)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
              relative group overflow-hidden rounded-xl p-4 transition-all duration-300
              flex flex-col items-center justify-center gap-2
              ${isActive
                                ? 'bg-gradient-to-br shadow-lg shadow-blue-500/20 ring-1 ring-white/20'
                                : 'bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 hover:border-white/10'
                            }
              ${isActive ? option.color : ''}
            `}
                    >
                        {/* Active Glow Background */}
                        {isActive && (
                            <div className="absolute inset-0 bg-white/10 blur-xl" />
                        )}

                        {/* Icon */}
                        <div className={`
              p-3 rounded-full transition-colors duration-300
              ${isActive ? 'bg-white/20 text-white' : 'bg-slate-900/50 text-gray-400 group-hover:text-white group-hover:bg-slate-700'}
            `}>
                            <Icon size={24} />
                        </div>

                        {/* Label */}
                        <span className={`
              text-sm font-medium tracking-wide transition-colors
              ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}
            `}>
                            {option.label}
                        </span>

                        {/* Selection Indicator (Dot) */}
                        {isActive && (
                            <motion.div
                                layoutId="active-indicator"
                                className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
};

export default InputSelection;
