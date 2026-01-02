import { motion } from 'framer-motion';

const StageNavigator = ({ activeStage, setStage, stages }) => {
    const steps = [
        { id: 'concept', label: '1. Concept' },
        { id: 'example', label: '2. Example' },
        { id: 'learning', label: '3. Learning' },
        { id: 'extension', label: '4. Extension' },
    ];

    return (
        <div className="flex justify-center gap-4 mb-8">
            {steps.map((step) => (
                <button
                    key={step.id}
                    onClick={() => setStage(step.id)}
                    className={`relative px-6 py-3 rounded-xl font-semibold transition-colors ${activeStage === step.id
                            ? 'text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    {activeStage === step.id && (
                        <motion.div
                            layoutId="bubble"
                            className="absolute inset-0 bg-blue-600/20 border border-blue-500/50 rounded-xl"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{step.label}</span>
                </button>
            ))}
        </div>
    );
};

export default StageNavigator;
