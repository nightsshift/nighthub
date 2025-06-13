import React from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

const ParticleBackground = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        particles: {
          number: { value: 50, density: { enable: true, value_area: 800 } },
          color: { value: ['#00BFFF', '#A100F2', '#FF69B4'] },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            out_mode: 'out',
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true,
          },
        },
        retina_detect: true,
      }}
      className="absolute inset-0 z-0"
    />
  );
};

export default ParticleBackground;