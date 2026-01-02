import React from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, BookOpen, Compass, ScanEye } from 'lucide-react';

const InputSelection = ({ inputType, setInputType }) => {
    // Retrying grid layout application
    const options = [
        { id: 'youtube', label: 'YouTube', icon: MonitorPlay, color: 'text-rose-600', bg: 'bg-rose-50', hover: 'group-hover:text-rose-600' },
        { id: 'pdf', label: 'PDF', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50', hover: 'group-hover:text-amber-600' },
        { id: 'web', label: 'Website', icon: Compass, color: 'text-cyan-600', bg: 'bg-cyan-50', hover: 'group-hover:text-cyan-600' },
        { id: 'image', label: 'Image', icon: ScanEye, color: 'text-purple-600', bg: 'bg-purple-50', hover: 'group-hover:text-purple-600' },
    ];

    return (
        <div className="grid grid-cols-2 gap-6 mb-10" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {options.map((option) => {
                const isActive = inputType === option.id;
                const Icon = option.icon;

                return (
                    <motion.button
                        key={option.id}
                        onClick={() => setInputType(option.id)}
                        whileHover={{ scale: 1.03, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
              relative group overflow-hidden rounded-3xl p-6 transition-all duration-300
              flex flex-col items-center justify-center gap-4 border-2
              ${isActive
                                ? `bg-white border-white shadow-2xl shadow-purple-900/10`
                                : 'bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/40'
                            }
            `}
                    >
                        {/* Icon Container */}
                        <div className={`
              p-4 rounded-2xl transition-all duration-300 shadow-sm
              ${isActive
                                ? `${option.bg} ${option.color} scale-110`
                                : `bg-white/10 text-white/80 ${option.hover} group-hover:bg-white/90`
                            }
            `}>
                            <Icon size={32} strokeWidth={isActive ? 2.5 : 1.5} />
                        </div>

                        {/* Label */}
                        <span className={`
              text-sm font-bold uppercase tracking-widest transition-colors
              ${isActive ? 'text-slate-800' : 'text-white/60 group-hover:text-white'}
            `}>
                            {option.label}
                        </span>

                        {/* Active Dot */}
                        {isActive && (
                            <motion.div
                                layoutId="active-dot"
                                className="absolute top-3 right-3 w-2 h-2 rounded-full bg-violet-500"
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
};

export default InputSelection;
