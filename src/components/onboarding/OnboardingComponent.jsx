import React, { useEffect, useState } from 'react';
import './onboardingcomponent.css';
import CustomFilebar from '../custom-filebar/CustomFilebar';

const OnboardingComponent = ({ onGetStarted }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Mark component as loaded for initial animations
        setLoaded(true);

        // Add the visible class to trigger animations after component mounts
        const timer = setTimeout(() => {
            document.querySelector('.onboarding-title').classList.add('visible');

            setTimeout(() => {
                document.querySelector('.onboarding-tagline').classList.add('visible');

                setTimeout(() => {
                    document.querySelector('.get-started-button').classList.add('visible');

                    // Add floating particles after everything is visible
                    createParticles();
                }, 400);
            }, 400);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    // Function to create floating particles
    const createParticles = () => {
        const container = document.querySelector('.onboarding-container');
        const particlesCount = 20;

        for (let i = 0; i < particlesCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';

            // Random size
            const size = Math.random() * 4 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            // Random opacity
            particle.style.opacity = Math.random() * 0.5 + 0.1;

            // Random animation duration
            const duration = Math.random() * 20 + 10;
            particle.style.animationDuration = `${duration}s`;

            // Random delay
            const delay = Math.random() * 5;
            particle.style.animationDelay = `${delay}s`;

            container.appendChild(particle);
        }
    };

    return (
        <>
            <CustomFilebar />
            <div className={`onboarding-container ${loaded ? 'loaded' : ''}`}>
                <div className="animated-background"></div>
                <div className="ambient-glow"></div>
                <div className="content-container">
                    <h1 className="onboarding-title">DevLoggr</h1>
                    <p className="onboarding-tagline">Track your coding journey, one commit at a time</p>
                    <button
                        onClick={onGetStarted}
                        className="get-started-button"
                    >
                        <span className="button-text">Get Started</span>
                        <span className="button-shine"></span>
                    </button>
                </div>
                <div className="animated-circles"></div>
            </div>
        </>
    );
};

export default OnboardingComponent;