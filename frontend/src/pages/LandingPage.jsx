import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-10" />
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] -z-10" />

            {/* Hero Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl px-6"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex items-center justify-center gap-2 mb-6"
                >
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Layers className="text-blue-400" size={32} />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        PaperLens
                    </span>
                </motion.div>

                <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white mb-8">
                    Structure Knowledge <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
                        Instantly
                    </span>
                </h1>

                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Transform unstructured content from YouTube, PDFs, and Websites into clear, interactive diagrams.
                    Understand complex topics in seconds.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/app">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 py-4 bg-white text-slate-950 text-lg font-bold rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow"
                        >
                            Get Started
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>

                    <button className="px-8 py-4 rounded-full text-gray-400 font-medium hover:text-white transition-colors flex items-center gap-2">
                        <Sparkles size={18} />
                        View Examples
                    </button>
                </div>
            </motion.div>

            {/* Floating Elements Animation (Background) */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"
            />
            <motion.div
                animate={{
                    y: [0, 30, 0],
                    rotate: [0, -5, 5, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10"
            />
        </div>
    );
};

export default LandingPage;
