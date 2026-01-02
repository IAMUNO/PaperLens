import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
});

const DiagramRenderer = ({ chart, stage }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const renderDiagram = async () => {
            if (containerRef.current && chart) {
                try {
                    // Clear previous content
                    containerRef.current.innerHTML = '';

                    // Unique ID for each render
                    const id = `mermaid-${stage}-${Date.now()}`;
                    const { svg } = await mermaid.render(id, chart);
                    containerRef.current.innerHTML = svg;
                } catch (error) {
                    console.error("Mermaid Render Error:", error);
                    containerRef.current.innerHTML = '<p class="text-red-400">Failed to render diagram.</p>';
                }
            }
        };

        renderDiagram();
    }, [chart, stage]);

    return (
        <div className="w-full overflow-x-auto p-4 flex justify-center">
            <div ref={containerRef} className="mermaid-container" />
        </div>
    );
};

export default DiagramRenderer;
