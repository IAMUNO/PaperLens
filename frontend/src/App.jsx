import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Youtube, FileText, Globe, Image as ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import DiagramRenderer from './components/DiagramRenderer';
import StageNavigator from './components/StageNavigator';
import './index.css';

function App() {
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
      // Direct call to backend (assuming proxy or CORS setup)
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
    <div className="container min-h-screen py-12 flex flex-col items-center">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          style={{ background: '-webkit-linear-gradient(45deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          PaperLens
        </h1>
        <p className="text-gray-400 text-lg">Unlock knowledge through structured visualization</p>
      </motion.header>

      {/* Input Section */}
      <motion.div
        layout
        className="glass-card w-full max-w-2xl mx-auto mb-12"
      >
        <div className="flex justify-center gap-4 mb-6">
          {['youtube', 'pdf', 'web', 'image'].map((type) => (
            <button
              key={type}
              onClick={() => setInputType(type)}
              className={`p-3 rounded-lg transition-all ${inputType === type ? 'bg-blue-600/30 ring-2 ring-blue-500 text-white' : 'bg-slate-800/50 hover:bg-slate-700 text-gray-400'}`}
              title={type.toUpperCase()}
            >
              {type === 'youtube' && <Youtube size={24} />}
              {type === 'pdf' && <FileText size={24} />}
              {type === 'web' && <Globe size={24} />}
              {type === 'image' && <ImageIcon size={24} />}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder={
              inputType === 'youtube' ? "Paste YouTube Link..." :
                inputType === 'pdf' ? "Paste PDF URL..." :
                  inputType === 'web' ? "Paste Website URL..." : "Image Input..."
            }
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
          />

          <button
            className="btn-primary flex items-center justify-center gap-2 w-full py-3 text-lg"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Analyzing Logic...
              </>
            ) : (
              <>
                <Layers size={24} />
                Visualize
              </>
            )}
          </button>

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-5xl"
          >
            <StageNavigator
              activeStage={activeStage}
              setStage={setActiveStage}
              stages={results}
            />

            <motion.div
              key={activeStage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card w-full text-left"
            >
              <div className="mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-2xl font-bold text-white mb-2">{currentStageData.title}</h2>
                <p className="text-gray-300">{currentStageData.description}</p>
              </div>

              <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-4 mb-6">
                <DiagramRenderer chart={currentStageData.mermaid_code} stage={activeStage} />
              </div>

              <div className="bg-slate-800/30 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-sm uppercase tracking-wider text-blue-400 font-bold mb-2">Explanation</h3>
                <p className="text-gray-300 leading-relaxed">{currentStageData.explanation}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
