import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const MouseGradient: React.FC = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth out the mouse movement with springs
    const springConfig = { damping: 25, stiffness: 150 };
    const smoothedX = useSpring(mouseX, springConfig);
    const smoothedY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed inset-0 pointer-events-none z-[5]"
            style={{
                background: `radial-gradient(circle at var(--x) var(--y), rgba(255, 0, 255, 0.15), transparent 40%),
                            radial-gradient(circle at var(--x) var(--y), rgba(0, 71, 171, 0.1), transparent 60%)`,
                // We use motion values directly in CSS variables for performance
                // @ts-ignore
                '--x': smoothedX.get() + 'px',
                // @ts-ignore
                '--y': smoothedY.get() + 'px'
            }}
            animate={{
                // Force re-render for CSS variables if needed, 
                // but useSpring/useMotionValue usually handle this via style props mapping
            }}
        />
    );
};

// However, to make it react to motion values correctly via style, 
// we should use useTransform or a different approach for the background string.
// Let's refine for best performance.

const MouseGradientRefined: React.FC = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 200 };
    const smoothedX = useSpring(mouseX, springConfig);
    const smoothedY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed inset-0 pointer-events-none z-[5]"
            style={{
                backgroundImage: `
                    radial-gradient(600px circle at var(--x) var(--y), rgba(255, 0, 255, 0.15), transparent 80%),
                    radial-gradient(800px circle at var(--x) var(--y), rgba(0, 71, 171, 0.1), transparent 80%)
                `,
                // @ts-ignore
                '--x': useSpring(mouseX, springConfig).get() + 'px',
                // @ts-ignore
                '--y': useSpring(mouseY, springConfig).get() + 'px'
            } as any}
        >
            {/* Realtime update of CSS variables using motion's style engine */}
            <motion.div
                className="absolute inset-0"
                style={{
                    // @ts-ignore
                    '--x': smoothedX.get() + 'px',
                    // @ts-ignore
                    '--y': smoothedY.get() + 'px'
                } as any}
            />
        </motion.div>
    );
};

// Actually, the simplest high-perf way with Framer Motion is to use a div that just moves.

const MouseGradientFinal: React.FC = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 40, stiffness: 250 };
    const smoothedX = useSpring(mouseX, springConfig);
    const smoothedY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
            <motion.div
                className="absolute w-[1000px] h-[1000px] rounded-full blur-[120px] opacity-40 bg-[radial-gradient(circle,rgba(255,0,255,0.3)_0%,rgba(0,71,171,0.2)_30%,transparent_70%)]"
                style={{
                    x: smoothedX,
                    y: smoothedY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />
        </div>
    );
};

export default MouseGradientFinal;
