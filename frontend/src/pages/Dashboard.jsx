import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Loader2, Sparkles, Zap, ArrowRight, BrainCircuit, Lightbulb, BookOpen, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InputSelection from '../components/InputSelection';
import DiagramRenderer from '../components/DiagramRenderer';
import StageNavigator from '../components/StageNavigator';

const Dashboard = () => {
    const [inputType, setInputType] = useState('youtube');
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [activeStage, setActiveStage] = useState('concept');
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!url) return;
        setIsAnalyzing(true);
        setError('');
        setResults(null);

        try {
            const response = await axios.post('http://localhost:8000/api/analyze', {
                input_type: inputType,
                content: url
            });

            setResults(response.data);
            setActiveStage('concept');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to analyze content. Please check the URL.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const currentStageData = results ? results[activeStage] : null;

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[20%] w-[1000px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] opacity-40 animate-pulse-slow" />
                <div className="absolute top-[20%] right-[10%] w-[800px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] opacity-30" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-6 min-h-screen flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between mb-16">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Layers className="text-white" size={24} />
                        <span className="font-serif text-2xl font-bold tracking-tight text-white">PaperLens</span>
                    </Link>
                </header>

                <AnimatePresence mode="wait">
                    {!results ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex-1 flex flex-col items-center max-w-2xl mx-auto w-full mt-12"
                        >
                            {/* Hero Text */}
                            <h1 className="font-serif text-5xl md:text-6xl font-medium text-center text-white mb-6 leading-tight">
                                Where knowledge <br /> takes <span className="text-indigo-400 italic">shape</span>.
                            </h1>
                            <p className="text-slate-400 text-center mb-10 text-lg max-w-lg">
                                Transform any content into a structured visual map.
                            </p>

                            {/* Input Section */}
                            <div className="w-full relative group perspective-1000">
                                <InputSelection inputType={inputType} setInputType={setInputType} />

                                <div className="relative relative z-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl shadow-indigo-500/10 transition-all duration-300 group-focus-within:border-indigo-500/50 group-focus-within:shadow-indigo-500/20 group-focus-within:ring-1 group-focus-within:ring-indigo-500/30">
                                    <div className="flex items-center gap-4 px-4">
                                        <Zap className={`text-slate-500 transition-colors ${url ? 'text-yellow-400' : ''}`} size={20} />
                                        <input
                                            type="text"
                                            placeholder="Paste a link to start..."
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                                            className="flex-1 bg-transparent border-none outline-none py-4 text-lg text-white placeholder-slate-500"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={!url || isAnalyzing}
                                            className={`
                                                px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2
                                                ${url && !isAnalyzing
                                                    ? 'bg-white text-black hover:scale-105 shadow-lg shadow-white/20'
                                                    : 'bg-white/10 text-slate-400 cursor-not-allowed'}
                                            `}
                                        >
                                            {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                            <span>Generate Insight</span>
                                        </button>
                                    </div>

                                    {/* Loading Progress Bar */}
                                    {isAnalyzing && (
                                        <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-white/10 overflow-hidden rounded-full">
                                            <motion.div
                                                className="h-full bg-indigo-500"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 2, ease: "easeInOut" }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 text-sm">
                                    {error}
                                </motion.div>
                            )}

                            {/* Ghost Cards (Framework Preview) */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-20 opacity-30 pointer-events-none select-none grayscale">
                                {[
                                    { title: 'Concept', icon: Lightbulb },
                                    { title: 'Example', icon: BrainCircuit },
                                    { title: 'Learning', icon: BookOpen },
                                    { title: 'Expansion', icon: Network }
                                ].map((item, idx) => (
                                    <div key={idx} className="aspect-[4/5] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-white/5 to-transparent">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                            <item.icon size={20} className="text-white" />
                                        </div>
                                        <span className="font-serif text-lg text-white/50">{item.title}</span>
                                        <div className="w-full space-y-2 mt-2">
                                            <div className="h-2 w-3/4 bg-white/10 rounded-full mx-auto" />
                                            <div className="h-2 w-1/2 bg-white/10 rounded-full mx-auto" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="flex-1 w-full max-w-6xl mx-auto"
                        >
                            {/* Result View */}
                            <div className="flex items-center gap-4 mb-8">
                                <button
                                    onClick={() => setResults(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <h2 className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-1">Generated Map</h2>
                                    <h1 className="text-2xl font-serif text-white">{currentStageData?.title}</h1>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
                                {/* Left: Navigation */}
                                <div className="sticky top-24">
                                    <StageNavigator
                                        activeStage={activeStage}
                                        setStage={setActiveStage}
                                        stages={results}
                                    />
                                </div>

                                {/* Right: Content */}
                                <div className="space-y-6">
                                    {/* Main Diagram Card */}
                                    <div className="bg-[#13141b] border border-white/10 rounded-3xl p-2 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        <div className="bg-[#0e0e11] rounded-2xl overflow-hidden min-h-[500px] flex items-center justify-center">
                                            <DiagramRenderer chart={currentStageData?.mermaid_code} stage={activeStage} />
                                        </div>
                                    </div>

                                    {/* Explanation Card */}
                                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 pt-6">
                                        <div className="flex items-center gap-2 mb-4 text-indigo-300">
                                            <Sparkles size={16} />
                                            <span className="text-xs font-bold uppercase tracking-widest">Key Insight</span>
                                        </div>
                                        <p className="text-slate-300 leading-relaxed text-lg font-light">
                                            {currentStageData?.explanation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Dashboard;
