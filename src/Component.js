'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";

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

  // Use the useEffect hooks and other logic here

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
          username,
          potAmount,
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
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 flex flex-col relative overflow-hidden" ref={containerRef}>
      {sprites.map((sprite, index) => (
        <Sprite key={index} {...sprite} />
      ))}
      <div className="relative z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 animate-pulse">Halfpot</h1>
          <p className="text-2xl">Current Pot: ${potAmount}</p>
        </header>
        <div className="flex flex-1">
          <aside className="w-1/4 mr-4">
            <h2 className="text-xl mb-2">Leaderboard</h2>
            <ScrollArea className="h-64 border border-green-500 p-2">
              {leaderboard.map((winner, index) => (
                <p key={index} className="mb-2">
                  {winner.username} - {winner.month} - ${winner.amount}
                </p>
              ))}
            </ScrollArea>
          </aside>
          <main className="flex-1 flex flex-col items-center justify-center -mt-16">
            <Button 
              className="text-4xl px-12 py-6 mb-8 bg-green-500 text-black hover:bg-green-600 transform hover:scale-105 transition-transform"
              onClick={handleBuyDigitalSticker}
            >
              Buy Digital Sticker
            </Button>
          </main>
          <aside className="w-1/4 ml-4">
            {isLoggedIn ? (
              <div>
                <p className="mb-2">Welcome, {username}!</p>
                <p className="mb-2">Your spots: {spots}</p>
                <Button 
                  className="w-full mb-2 bg-green-500 text-black hover:bg-green-600"
                  onClick={handleBuyDigitalSticker}
                >
                  Buy Digital Sticker
                </Button>
                <Button 
                  className="w-full bg-green-500 text-black hover:bg-green-600"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div>
                <Input 
                  className="w-full mb-2 bg-black text-green-500 border-green-500"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                  className="w-full mb-2 bg-black text-green-500 border-green-500"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button 
                  className="w-full bg-green-500 text-black hover:bg-green-600"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </div>
            )}
          </aside>
        </div>
        <footer className="mt-8 text-center">
          <p className="mb-2">Half of the pot goes to a winner selected at random at the end of each month.</p>
          <button onClick={() => {}} className="underline">FAQ</button>
        </footer>
      </div>
    </div>
  );
}
