import React from 'react';
import { Particles } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

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
            outModes: 'out',
          },
        },
        interactivity: {
          detectOn: 'canvas',
          events: {
            onHover: { enable: true, mode: 'repulse' },
            onClick: { enable: true, mode: 'push' },
            resize: true,
          },
        },
        retinaDetect: true,
      }}
      className="absolute inset-0 z-0"
    />
  );
};

export default ParticleBackground;