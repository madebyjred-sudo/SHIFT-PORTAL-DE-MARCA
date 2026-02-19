import { useState, useCallback } from "react";
import {
    generateBrandAsset,
    analyzeBrandRequest,
    generateImage,
    BrandAnalysis,
    GenerationResult,
    FormatId,
    CategoryId,
} from "../services/imagenService";

export type GenerationPhase =
    | "idle"
    | "art-directing"
    | "analyzing"
    | "generating"
    | "complete"
    | "error";

// Phase-specific UX messages for the thinking overlay
const PHASE_MESSAGES: Record<string, string[]> = {
    "art-directing": [
        "Analizando directrices de marca…",
        "Optimizando composición visual…",
        "Seleccionando armonía cromática…",
        "Aplicando proporción áurea…",
        "Alineando con identidad Shift…",
    ],
    analyzing: [
        "Analizando intención…",
        "Seleccionando layout óptimo…",
        "Estructurando composición…",
        "Extrayendo copy…",
        "Definiendo espacio negativo…",
    ],
    generating: [
        "Creando tu visual…",
        "Renderizando en alta resolución…",
        "Aplicando estilo premium…",
        "Finalizando detalles…",
        "Capturando esencia LatAm…",
    ],
};

export interface HistoryEntry extends GenerationResult {
    id: string;
}

export function useBrandGeneration() {
    const [phase, setPhase] = useState<GenerationPhase>("idle");
    const [analysis, setAnalysis] = useState<BrandAnalysis | null>(null);
    const [phaseMessage, setPhaseMessage] = useState("");
    const [currentImage, setCurrentImage] = useState<GenerationResult | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Last generation params for regenerate
    const [lastParams, setLastParams] = useState<{
        concept: string;
        format: FormatId;
        category: CategoryId;
    } | null>(null);

    // Cycle through phase messages
    const startMessageCycler = useCallback((phaseKey: string) => {
        const messages = PHASE_MESSAGES[phaseKey] || [];
        if (messages.length === 0) return null;

        let idx = 0;
        setPhaseMessage(messages[0]);
        const interval = setInterval(() => {
            idx = (idx + 1) % messages.length;
            setPhaseMessage(messages[idx]);
        }, 2200);

        return interval;
    }, []);

    const generate = useCallback(
        async (concept: string, format: FormatId, category: CategoryId) => {
            setError(null);
            setPhase("art-directing");
            setLastParams({ concept, format, category });

            let cyclerInterval: ReturnType<typeof setInterval> | null = null;

            try {
                const result = await generateBrandAsset(concept, format, category, (newPhase) => {
                    setPhase(newPhase);
                    if (cyclerInterval) clearInterval(cyclerInterval);
                    cyclerInterval = startMessageCycler(newPhase);
                });

                // Start the art-directing cycler immediately
                cyclerInterval = startMessageCycler("art-directing");

                setCurrentImage(result);
                const entry: HistoryEntry = { ...result, id: `gen-${Date.now()}` };
                setHistory((prev) => [entry, ...prev]);
                setPhase("complete");
            } catch (err: any) {
                console.error("Generation failed:", err);
                setError(err?.message || "Generation failed. Please try again.");
                setPhase("error");
            } finally {
                if (cyclerInterval) clearInterval(cyclerInterval);
                setPhaseMessage("");
            }
        },
        [startMessageCycler]
    );

    const generateComposite = useCallback(
        async (userMessage: string) => {
            setError(null);
            setPhase("analyzing");

            // Start the cycler for analyzing phase
            let cyclerInterval: ReturnType<typeof setInterval> | null = startMessageCycler("analyzing");

            try {
                // Step 1: Analyze Intent & Layout
                const analysisResult = await analyzeBrandRequest(userMessage);
                setAnalysis(analysisResult);

                // Step 2: Generate Image with negative space prompt
                if (cyclerInterval) clearInterval(cyclerInterval);
                setPhase("generating");
                cyclerInterval = startMessageCycler("generating");

                const imageBase64 = await generateImage(analysisResult.visualPrompt, "16:9");

                const newAsset: GenerationResult = {
                    imageBase64,
                    technicalPrompt: analysisResult.visualPrompt,
                    timestamp: Date.now(),
                    format: "linkedin-banner", // mapped 16:9
                    category: "category_objects", // default fallback
                    concept: userMessage,
                    analysis: analysisResult
                };

                setCurrentImage(newAsset);
                const entry: HistoryEntry = { ...newAsset, id: `gen-${Date.now()}` };
                setHistory((prev) => [entry, ...prev]);
                setPhase("complete");
            } catch (err: any) {
                console.error("Composite Generation failed:", err);
                setError(err?.message || "Generation failed. Please try again.");
                setPhase("error");
            } finally {
                if (cyclerInterval) clearInterval(cyclerInterval);
                setPhaseMessage("");
            }
        },
        [startMessageCycler]
    );

    const regenerate = useCallback(() => {
        if (lastParams) {
            generate(lastParams.concept, lastParams.format, lastParams.category);
        }
    }, [lastParams, generate]);

    const selectFromHistory = useCallback((entry: HistoryEntry) => {
        setCurrentImage(entry);
        setPhase("complete");
    }, []);

    const downloadCurrent = useCallback(() => {
        if (!currentImage) return;

        const link = document.createElement("a");
        link.href = `data:image/png;base64,${currentImage.imageBase64}`;
        link.download = `shift-studio-${currentImage.format}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [currentImage]);

    const reset = useCallback(() => {
        setPhase("idle");
        setCurrentImage(null);
        setError(null);
        setPhaseMessage("");
    }, []);

    return {
        // State
        phase,
        phaseMessage,
        currentImage,
        history,
        error,
        // Actions
        generate,
        regenerate,
        selectFromHistory,
        downloadCurrent,
        generateComposite,
        analysis,
        reset,
    };
}
