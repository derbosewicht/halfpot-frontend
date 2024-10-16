'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './components/Component.module.css';

const Sprite = ({ x, y, size, color }) => (
  <div
    className="absolute rounded-full"
    style={{
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      opacity: 0.5,
    }}
  />
);

export default function Component() {
  const [potAmount, setPotAmount] = useState(1000);
  const [username, setUsername] = useState('');
  const [sprites, setSprites] = useState([]);
  const animationRef = useRef();
  const containerRef = useRef();

  // Update pot amount every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPotAmount(prevAmount => prevAmount + Math.floor(Math.random() * 10));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sprite animation effect
  useEffect(() => {
    const colors = ['#00ff00', '#00aa00', '#008800'];
    const newSprites = Array(10).fill().map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 20 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setSprites(newSprites);

    const animate = () => {
      setSprites(prevSprites =>
        prevSprites.map(sprite => {
          let { x, y, vx, vy, size, color } = sprite;
          x += vx;
          y += vy;
          if (x < 0 || x > window.innerWidth - size) vx = -vx;
          if (y < 0 || y > window.innerHeight - size) vy = -vy;
          return { x, y, vx, vy, size, color };
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.halfpotContainer} ref={containerRef}>
      {sprites.map((sprite, index) => (
        <Sprite key={index} {...sprite} />
      ))}
      <div className="relative z-10">
        <header className={styles.header}>
          <h1>Halfpot</h1>
          <p className={styles.currentPot}>Current Pot: ${potAmount}</p>
        </header>

        {/* The rest of your code remains unchanged */}
      </div>
    </div>
  );
}
