'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";
import styles from "./Component.module.css"; // Import the CSS module

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [spots, setSpots] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [sprites, setSprites] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const animationRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setPotAmount(prevAmount => prevAmount + Math.floor(Math.random() * 10));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const colors = ['#00ff00', '#00aa00', '#008800'];
    const newSprites = Array(10).fill().map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 20 + 10,
      color: colors[Math.floor(Math.random() * colors.length)]
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

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('https://polar-ravine-08798.herokuapp.com/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleBuyDigitalSticker = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not logged in. Please log in to continue.');
      }

      const response = await fetch('https://polar-ravine-08798.herokuapp.com/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username,
          potAmount: potAmount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to purchase sticker.');
      }

      console.log('Sticker purchased successfully');
      setPotAmount(prevAmount => prevAmount + 1);
      setSpots(prevSpots => prevSpots + 1);
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('https://polar-ravine-08798.herokuapp.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log("Logged in successfully:", data);

      setIsLoggedIn(true);
      setUsername(email);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log("Logged out");
    setIsLoggedIn(false);
    setUsername('');
  };

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
