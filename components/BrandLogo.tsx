import React, { useState } from 'react';

interface BrandLogoProps {
    variant?: 'color' | 'white';
    className?: string;
    showText?: boolean;
    scale?: number;
    isIso?: boolean;
}

const BrandLogo: React.FC<BrandLogoProps> = ({
    variant = 'color',
    className = '',
    showText,
    scale = 1.618,
    isIso = false
}) => {
    const finalShowText = showText ?? !isIso;
    const logoSrc = isIso ? '/iso.svg' : '/logo-color.svg';

    const [imgError, setImgError] = useState(false);

    // Si no hay error de carga, mostramos la imagen
    if (!imgError) {
        return (
            <div
                className={`flex items-center gap-2 ${className}`}
                style={{
                    transform: `scale(${isIso ? scale * 0.7 : scale})`,
                    transformOrigin: 'left center'
                }}
            >
                <img
                    src={logoSrc}
                    alt="Shift Logo"
                    className={`h-8 w-auto object-contain transition-all ${variant === 'white' ? 'brightness-0 invert' : ''
                        }`}
                    onError={(e) => {
                        // Fallback strategy: try generic 'logo.svg' if specific name fails, otherwise switch to code fallback
                        const target = e.target as HTMLImageElement;
                        // Avoid infinite loop if fallback fails too
                        if (!target.src.includes('logo.svg') && target.src.includes('logo-color.svg')) {
                            target.src = '/logo.svg';
                        } else {
                            setImgError(true);
                        }
                    }}
                />
            </div>
        );
    }

    // Fallback: Si la imagen falla o no existe, mostramos el logo generado por código
    return (
        <div
            className={`flex items-center gap-2 ${className}`}
            style={{
                transform: `scale(${isIso ? scale * 0.7 : scale})`,
                transformOrigin: 'left center'
            }}
        >
            <div className={`flex items-center justify-center ${variant === 'white'
                ? 'text-white'
                : 'w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-sm'
                }`}>
                <span className="font-bold text-lg">S</span>
            </div>
            {finalShowText && (
                <span className={`font-bold text-xl tracking-tight ${variant === 'white' ? 'text-white' : 'text-tertiary'
                    }`}>
                    Shift
                </span>
            )}
        </div>
    );
};

export default BrandLogo;