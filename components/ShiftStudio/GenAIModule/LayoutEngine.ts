export interface LayoutPreset {
    id: string;
    label: string;
    description: string;
    cssOverlayClass: string;
    aiNegativeSpacePrompt: string;
    textPosition: "left" | "right" | "center" | "bottom" | "top-left" | "top-right";
    textAlign: "text-left" | "text-right" | "text-center";
    safeZoneClass: string;
}

export const LAYOUT_PRESETS: Record<string, LayoutPreset> = {
    editorial_split_left: {
        id: "editorial_split_left",
        label: "Editorial Split Left",
        description: "Text on Left, Image on Right",
        cssOverlayClass: "absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent",
        aiNegativeSpacePrompt: "Composition requirement: The LEFT 35% of the image must be completely empty, dark, or abstract negative space. Place the main subject clearly on the RIGHT side.",
        textPosition: "left",
        textAlign: "text-left",
        safeZoneClass: "absolute top-0 left-0 w-1/3 h-full flex flex-col justify-center p-8 z-10"
    },
    cinematic_bottom: {
        id: "cinematic_bottom",
        label: "Cinematic Bottom",
        description: "Text on Bottom, Panoramic Image",
        cssOverlayClass: "absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent",
        aiNegativeSpacePrompt: "Composition requirement: The BOTTOM 30% of the image must be dark and free of complex details. Keep the horizon line high or the subject centered.",
        textPosition: "bottom",
        textAlign: "text-left",
        safeZoneClass: "absolute bottom-0 left-0 w-full flex flex-col justify-end p-8 pb-12 z-10"
    },
    minimalist_center: {
        id: "minimalist_center",
        label: "Minimalist Center",
        description: "Centered Text, Abstract Background",
        cssOverlayClass: "absolute inset-0 bg-black/30 backdrop-blur-[2px]",
        aiNegativeSpacePrompt: "Composition requirement: Abstract symmetric background with a central void or soft glow. No hard edges in the center. Avoid complex details in the middle.",
        textPosition: "center",
        textAlign: "text-center",
        safeZoneClass: "absolute inset-0 flex flex-col items-center justify-center p-12 z-10"
    },
    neon_frame: {
        id: "neon_frame",
        label: "Neon Frame",
        description: "Content centered with edge glow",
        cssOverlayClass: "absolute inset-0 border-[20px] border-[#1534dc]/20 shadow-[inset_0_0_100px_rgba(21,52,220,0.5)]",
        aiNegativeSpacePrompt: "Composition requirement: Central composition with clear focus. Keep important elements away from the very edges.",
        textPosition: "center",
        textAlign: "text-center",
        safeZoneClass: "absolute inset-0 flex flex-col items-center justify-center p-16 z-10"
    }
};
