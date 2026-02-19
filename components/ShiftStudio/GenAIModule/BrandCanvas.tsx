import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { LAYOUT_PRESETS } from "./LayoutEngine";
import { Download } from "lucide-react";

interface BrandCanvasProps {
    layoutId: string;
    imageSrc: string; // base64
    headline: string;
    subheadline?: string;
    logoVariant: "white" | "blue";
    onDownloadStart?: () => void;
    onDownloadComplete?: () => void;
    scale?: number;
}

export function BrandCanvas({
    layoutId,
    imageSrc,
    headline,
    subheadline,
    logoVariant,
    onDownloadStart,
    onDownloadComplete,
    scale = 1,
}: BrandCanvasProps) {
    const ref = useRef<HTMLDivElement>(null);
    const preset = LAYOUT_PRESETS[layoutId];

    const handleDownload = useCallback(async () => {
        if (!ref.current) return;
        onDownloadStart?.();
        try {
            // Temporarily remove scale transform for capture
            const originalTransform = ref.current.style.transform;
            ref.current.style.transform = "none";

            const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });

            // Restore transform
            ref.current.style.transform = originalTransform;

            const link = document.createElement("a");
            link.download = `shift_brand_asset_${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
            onDownloadComplete?.();
        } catch (err) {
            console.error("Download failed", err);
            onDownloadComplete?.();
        }
    }, [onDownloadStart, onDownloadComplete]);

    if (!preset) return <div className="text-red-500">Invalid Layout ID</div>;

    return (
        <div className="relative group">
            <div
                ref={ref}
                className="relative overflow-hidden bg-black shadow-2xl origin-top-left"
                style={{
                    width: "1920px",
                    height: "1080px", // Default 16:9 base. We should probably adjust based on format but keeping simple for now.
                    transform: `scale(${scale})`,
                }}
            >
                {/* Layer 1: AI Generated Background */}
                <img
                    src={`data:image/png;base64,${imageSrc}`}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Layer 2: CSS Overlay (Gradient/Scrim) */}
                <div className={preset.cssOverlayClass} />

                {/* Layer 3: Content Safe Zone */}
                <div className={preset.safeZoneClass}>
                    {/* Logo */}
                    <img
                        src={logoVariant === "white" ? "/brand/logos/shift-logo-white.svg" : "/brand/logos/shift-logo-blue.svg"}
                        alt="Shift Logo"
                        className="w-48 h-auto mb-8 opacity-90"
                    />

                    {/* Typography */}
                    <div className={`flex flex-col gap-4 ${preset.textAlign}`}>
                        <h1 className="font-shift text-7xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-lg max-w-[80%]">
                            {headline}
                        </h1>
                        {subheadline && (
                            <p className="font-sans text-3xl font-light text-white/90 tracking-wide max-w-[60%]">
                                {subheadline}
                            </p>
                        )}
                    </div>
                </div>

                {/* Watermark/Brand Element optional */}
                <div className="absolute bottom-8 right-8 opacity-30">
                    <div className="w-12 h-12 border border-white/40 rounded-full flex items-center justify-center">
                        <span className="text-white/60 text-xs">SPN</span>
                    </div>
                </div>
            </div>

            {/* Floating Download Action (Visible on Hover in Studio) */}
            <button
                onClick={handleDownload}
                className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 z-50"
                title="Download High-Res Composite"
            >
                <Download className="w-6 h-6" />
            </button>
        </div>
    );
}
