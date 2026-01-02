import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
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

    // Safety check to prevent crash if backend returns incomplete data
    if (results && !currentStageData) {
        console.error(`Stage '${activeStage}' not found in results:`, results);
        return (
            <div className="p-8 text-center text-red-400">
                Error: Could not load data for stage "{activeStage}".
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-white/10 flex items-center px-6 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="p-1.5 rounded bg-blue-500/20">
                        <Layers className="text-blue-400" size={20} />
                    </div>
                    <span className="font-bold text-lg tracking-tight">PaperLens</span>
                </Link>
            </header>

            {/* Main Content - Split Layout */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                {/* Left Panel: Input Area */}
                <div className={`
          flex-shrink-0 w-full lg:w-[480px] p-6 flex flex-col gap-8 border-r border-white/5 bg-[#0f172a]
          ${results ? 'lg:h-[calc(100vh-64px)] overflow-y-auto' : 'lg:h-auto lg:justify-center'}
          transition-all duration-500 ease-in-out
        `}>

                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-2xl font-bold mb-2">New Analysis</h2>
                        <p className="text-gray-400 mb-8 text-sm">Select a source to visualize knowledge.</p>

                        <InputSelection inputType={inputType} setInputType={setInputType} />

                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder={
                                        inputType === 'youtube' ? "Paste YouTube Link..." :
                                            inputType === 'pdf' ? "Paste PDF URL..." :
                                                inputType === 'web' ? "Paste Website URL..." : "Image Input..."
                                    }
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                            </div>

                            <button
                                className={`
                  w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                  ${!url || isAnalyzing
                                        ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 active:scale-[0.98]'
                                    }
                `}
                                onClick={handleAnalyze}
                                disabled={!url || isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Layers size={20} />
                                        <span>Visualize</span>
                                    </>
                                )}
                            </button>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Results Area */}
                <div className="flex-1 bg-slate-900/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

                    <AnimatePresence mode="wait">
                        {!results ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center"
                            >
                                <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 border border-white/5">
                                    <Layers size={40} className="text-slate-700" />
                                </div>
                                <h3 className="text-xl font-medium mb-2 text-gray-400">Ready to visualize</h3>
                                <p className="max-w-sm text-sm opacity-60">Result diagrams will appear here after analysis.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="h-full flex flex-col h-[calc(100vh-64px)] overflow-hidden"
                            >
                                {/* Stage Navigator (Top of Right Panel) */}
                                <div className="p-6 border-b border-white/5 bg-[#0f172a]/50 backdrop-blur-sm z-10">
                                    <StageNavigator
                                        activeStage={activeStage}
                                        setStage={setActiveStage}
                                        stages={results}
                                    />
                                </div>

                                {/* Diagram Content (Scrollable) */}
                                <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                                    <motion.div
                                        key={activeStage}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="max-w-5xl mx-auto"
                                    >
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-bold text-white mb-3">{currentStageData.title}</h2>
                                            <p className="text-lg text-gray-400">{currentStageData.description}</p>
                                        </div>

                                        <div className="glass-card bg-[#1e293b]/50 border-white/10 p-1 mb-8 shadow-2xl overflow-hidden">
                                            <DiagramRenderer chart={currentStageData.mermaid_code} stage={activeStage} />
                                        </div>

                                        <div className="bg-gradient-to-br from-blue-900/10 to-indigo-900/10 border border-blue-500/20 rounded-2xl p-6 lg:p-8">
                                            <h3 className="flex items-center gap-2 text-sm uppercase tracking-wider text-blue-400 font-bold mb-4">
                                                <Sparkles size={16} />
                                                AI Explanation
                                            </h3>
                                            <p className="text-gray-300 leading-relaxed text-lg font-light">{currentStageData.explanation}</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
