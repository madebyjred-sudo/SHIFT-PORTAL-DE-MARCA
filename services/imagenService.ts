import { GoogleGenAI } from "@google/genai";
import { LAYOUT_PRESETS } from "../components/ShiftStudio/GenAIModule/LayoutEngine";

// ── Brand Art Director System Prompt ──────────────────────────────────
const ART_DIRECTOR_SYSTEM = `You are the invisible Art Director for Shift Porter Novelli.
Your role: receive a creative brief from a marketing executive and transform it into a precise, technical image-generation prompt optimized for the Imagen model.

BRAND GUIDELINES (STRICT):
- Context: LATAM_CR_CONTEXT. Always generate people with diverse Latin American demographics (Costa Rica context). Avoid generic 'American stock photo' look.
- Color Palette: Electric Blue #1534dc (core energy), Neon Magenta #f540ff (accent catalyst), Navy #0e1745 (depth).
- System 80/20: 80% natural/realistic, 20% brand accent.
- Visual Philosophy: "Brand-Consistent Stock" — high-quality raw assets (photos/3D) that look like they were shot specifically for Shift Porter Novelli in a LatAm context.
- Colors in Props: For people, do NOT make skin blue. Use colors in props (laptops, scarves, background lights, furniture).
- Nature: Enhance natural greens but use lighting (rim light, volumetric fog) in brand colors to tie it together.

NEGATIVE PROMPTING (always append):
"Do not include: watermarks, text overlays, stock photo aesthetics, clip art style, low quality, blurry, distorted, generic corporate imagery, blue skin, unnatural skin tones"

CATEGORY PROMPT TEMPLATES:
- "category_people": "Professional photography, medium shot, diverse Latino team collaborating in a modern glass-walled office. Subtle cinematic lighting. Key props (notebook, mug, chair) feature Electric Blue (#1534dc) or Neon Magenta accents. Optimistic expressions. 8k resolution."
- "category_nature": "Costa Rica inspired landscape, lush tropical vegetation meeting modern sustainable architecture. Morning light with a subtle futuristic cool-blue tint. High dynamic range, photorealistic, editorial style."
- "category_objects": "Minimalist desk setup, top-down or isometric view. High-tech gadgets. Composition based on Golden Ratio. Lighting emphasizes glass textures and neon magenta reflections. Clean, white or dark grey sleek background."
- "category_abstract": "Ethereal digital smoke and liquid glass waves flowing in a Fibonacci spiral. Deep Electric Blue (#1534dc) transitioning to Neon Magenta (#f540ff). Abstract, 3D render, 8k, wallpaper quality."

OUTPUT FORMAT:
Return ONLY the optimized prompt text. No explanations, no markdown, no commentary. Just the raw prompt ready for Imagen.`;

// ── Category Prompt Templates Map ─────────────────────────────────────
const CATEGORY_PROMPTS: Record<string, string> = {
    "category_people": "Professional photography, medium shot, diverse Latino team collaborating in a modern glass-walled office. Subtle cinematic lighting. Key props (notebook, mug, chair) feature Electric Blue (#1534dc) or Neon Magenta accents. Optimistic expressions. 8k resolution.",
    "category_nature": "Costa Rica inspired landscape, lush tropical vegetation meeting modern sustainable architecture. Morning light with a subtle futuristic cool-blue tint. High dynamic range, photorealistic, editorial style.",
    "category_objects": "Minimalist desk setup, top-down or isometric view. High-tech gadgets. Composition based on Golden Ratio. Lighting emphasizes glass textures and neon magenta reflections. Clean, white or dark grey sleek background.",
    "category_abstract": "Ethereal digital smoke and liquid glass waves flowing in a Fibonacci spiral. Deep Electric Blue (#1534dc) transitioning to Neon Magenta (#f540ff). Abstract, 3D render, 8k, wallpaper quality."
};

// ── Format → Aspect Ratio Map ─────────────────────────────────────────
export const FORMAT_OPTIONS = [
    { id: "instagram-story", label: "Instagram Story", ratio: "9:16", icon: "📱" },
    { id: "linkedin-banner", label: "LinkedIn Banner", ratio: "16:9", icon: "💼" },
    { id: "presentation", label: "Presentación (16:9)", ratio: "16:9", icon: "🖥️" },
    { id: "icon-square", label: "Icono (1:1)", ratio: "1:1", icon: "⬜" },
] as const;

export const CATEGORY_OPTIONS = [
    { id: "category_people", label: "Shift Team (People)", icon: "Users", description: "LatAm team, office context" },
    { id: "category_nature", label: "Bio-Tech (Environment)", icon: "Leaf", description: "CR landscapes, futuristic light" },
    { id: "category_objects", label: "Tech & Objects", icon: "Box", description: "Product shots, devices" },
    { id: "category_abstract", label: "Brand Texture", icon: "Layers", description: "Abstract waves, gradients" },
] as const;

export type FormatId = (typeof FORMAT_OPTIONS)[number]["id"];
export type CategoryId = (typeof CATEGORY_OPTIONS)[number]["id"];
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export interface GenerationResult {
    imageBase64: string;
    technicalPrompt: string;
    timestamp: number;
    format: FormatId;
    category: CategoryId;
    concept: string;
    analysis?: BrandAnalysis;
}

// ── Lazy SDK init ─────────────────────────────────────────────────────
let _ai: GoogleGenAI | null = null;
const getAI = () => {
    if (!_ai) _ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
    return _ai;
};

// ── Step 1: Art Director — enrich the user prompt ─────────────────────
export async function artDirectorEnrich(
    concept: string,
    formatLabel: string,
    categoryId: CategoryId
): Promise<string> {
    const ai = getAI();
    const categoryContext = CATEGORY_PROMPTS[categoryId] || "";

    const brief = `
CREATIVE BRIEF:
- User Concept: ${concept}
- Output Format: ${formatLabel}
- Selected Category: ${categoryId}
- Category Template Base: "${categoryContext}"

INSTRUCTION:
Create a specific "Stock Photo" prompt based on the User Concept, but strictly applying the style and constraints of the Selected Category.
Pattern: "A stock photo of [User Concept] in the style of [Selected Category]..."
Ensure Shift Brand Colors (#1534dc, #f540ff) are present but natural (lighting, props).
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        config: { systemInstruction: ART_DIRECTOR_SYSTEM, temperature: 0.7 },
        contents: brief,
    });

    return response.text?.trim() || concept;
}

// ── Step 2: The Artist — generate the image ───────────────────────────
export async function generateImage(
    technicalPrompt: string,
    aspectRatio: AspectRatio
): Promise<string> {
    const ai = getAI();

    const response = await ai.models.generateImages({
        model: "imagen-4.0-generate-001",
        prompt: technicalPrompt,
        config: {
            numberOfImages: 1,
            aspectRatio,
        },
    });

    const img = response.generatedImages?.[0];
    if (!img?.image?.imageBytes) {
        throw new Error("No image was generated. The content may have been filtered.");
    }

    return img.image.imageBytes; // base64 string
}

// ── Full Pipeline ─────────────────────────────────────────────────────
export async function generateBrandAsset(
    concept: string,
    formatId: FormatId,
    categoryId: CategoryId,
    onPhaseChange?: (phase: "art-directing" | "generating") => void
): Promise<GenerationResult> {
    const format = FORMAT_OPTIONS.find((f) => f.id === formatId)!;

    // Step 1 — Art Director
    onPhaseChange?.("art-directing");
    const technicalPrompt = await artDirectorEnrich(concept, format.label, categoryId);

    // Step 2 — Imagen
    onPhaseChange?.("generating");
    const imageBase64 = await generateImage(technicalPrompt, format.ratio as AspectRatio);

    return {
        imageBase64,
        technicalPrompt,
        timestamp: Date.now(),
        format: formatId,
        category: categoryId,
        concept,
    };
}

// ── GenAI Module: Hybrid Compositing Analyst ──────────────────────────

export interface BrandAnalysis {
    layoutId: string;
    visualPrompt: string;
    headline: string;
    subheadline: string;
    logoVariant: "white" | "blue";
    reasoning: string;
}

const ANALYST_SYSTEM_PROMPT = `You are the Lead Design Engineer for Shift Porter Novelli's GenAI Studio.
Your goal: Analyze the user's request and architect a sophisticated visual composition.

AVAILABLE LAYOUTS (referenced by ID):
${Object.values(LAYOUT_PRESETS).map(l => `- ${l.id}: ${l.description}. Negative Space Rule: "${l.aiNegativeSpacePrompt}"`).join('\n')}

BRAND IDENTITY:
- Colors: #1534dc (Electric Blue), #f540ff (Neon Magenta), #0a0a0a (Deep Navy/Black).
- Vibe: Premium Tech, Glassmorphism, Digital Waves, Connection, Future-Forward.

INSTRUCTIONS:
1. Select the BEST layout based on the user's intent.
2. Write a "visualPrompt" for Imagen 4 that strictly adheres to the layout's negative space rule. The background MUST allow space for text overlay.
3. Extract or creatively generate a short, punchy "headline" (max 6-8 words).
4. Extract a "subheadline" (optional, max 12 words).
5. Choose "logoVariant" ('white' or 'blue') based on the background brightness (use white for dark backgrounds).

OUTPUT JSON ONLY.`;

export async function analyzeBrandRequest(userMessage: string): Promise<BrandAnalysis> {
    const ai = getAI();

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        config: {
            systemInstruction: ANALYST_SYSTEM_PROMPT,
            responseMimeType: "application/json",
            temperature: 0.4
        },
        contents: [
            { role: "user", parts: [{ text: `User Request: "${userMessage}"` }] }
        ]
    });

    const text = response.text;
    if (!text) throw new Error("No analysis generated");

    try {
        return JSON.parse(text) as BrandAnalysis;
    } catch (e) {
        console.error("Failed to parse GenAI analysis", text);
        throw new Error("Failed to parse GenAI analysis");
    }
}
