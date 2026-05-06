import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CursorFollower = () => {
    const [isVisible, setIsVisible] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Softer spring for "following behind" feel
    const springConfig = { damping: 20, stiffness: 150 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            // Centering offset for w-3 (12px) is 6px
            cursorX.set(e.clientX - 6);
            cursorY.set(e.clientY - 6);
            if (!isVisible) setIsVisible(true);
        };

        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed w-3 h-3 rounded-full border-2 border-primary pointer-events-none z-[9999] mix-blend-difference top-0 left-0 hidden md:block"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
            }}
        />
    );
};

export default CursorFollower;
