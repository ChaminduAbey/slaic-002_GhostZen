'use client';
import { useState, useEffect } from 'react';

function LaodingSkeleton({loadingTitles}: {loadingTitles: string[]}) {
    const [currentText, setCurrentText] = useState(loadingTitles[0]);
    const texts = loadingTitles;
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % texts.length);
            setCurrentText(texts[(activeIndex + 1) % texts.length]!);
        }, 8000);

        return () => clearInterval(intervalId);
    }, [activeIndex]);

    return (
        <div className="thinking-container">
        <div className="thinking-text">{currentText}</div>
    </div>
    );
}

export default LaodingSkeleton;
