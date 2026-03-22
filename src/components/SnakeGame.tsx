import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 80;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreUpdate(0);
    gameContainerRef.current?.focus();
  };

  const checkCollision = (head: Point, currentSnake: Point[]) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    if (currentSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        if (checkCollision(newHead, prevSnake)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood(newSnake));
          const newScore = score + 10;
          setScore(newScore);
          onScoreUpdate(newScore);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, generateFood, score, onScoreUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused((p) => !p);
        return;
      }

      if (gameOver || isPaused) return;

      setDirection((prevDir) => {
        switch (e.key.toLowerCase()) {
          case 'arrowup':
          case 'w':
            return prevDir.y === 1 ? prevDir : { x: 0, y: -1 };
          case 'arrowdown':
          case 's':
            return prevDir.y === -1 ? prevDir : { x: 0, y: 1 };
          case 'arrowleft':
          case 'a':
            return prevDir.x === 1 ? prevDir : { x: -1, y: 0 };
          case 'arrowright':
          case 'd':
            return prevDir.x === -1 ? prevDir : { x: 1, y: 0 };
          default:
            return prevDir;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  // Focus the container on mount so keyboard events work if we were using a local listener,
  // but we are using window listener anyway.
  useEffect(() => {
    gameContainerRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      <div
        ref={gameContainerRef}
        className="relative bg-black border-4 border-cyan-400 w-full aspect-square max-w-[500px] outline-none animate-tear overflow-hidden"
        tabIndex={0}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#ff00ff 1px, transparent 1px), linear-gradient(90deg, #ff00ff 1px, transparent 1px)',
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Food */}
        <div
          className="absolute bg-fuchsia-500 animate-glitch"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x * 100) / GRID_SIZE}%`,
            top: `${(food.y * 100) / GRID_SIZE}%`,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${
                isHead ? 'bg-cyan-400 z-10 animate-pulse' : 'bg-cyan-600'
              }`}
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(segment.x * 100) / GRID_SIZE}%`,
                top: `${(segment.y * 100) / GRID_SIZE}%`,
                border: '1px solid black'
              }}
            />
          );
        })}

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20">
            <h2 className="text-5xl md:text-6xl font-bold text-fuchsia-500 mb-4 animate-glitch text-center bg-black px-4">FATAL_ERR</h2>
            <p className="text-cyan-400 mb-8 text-3xl font-bold animate-glitch bg-black px-2">MEM_DUMP: {score}</p>
            <button
              onClick={resetGame}
              className="p-4 bg-cyan-400 text-black font-bold hover:bg-fuchsia-500 transition-colors flex items-center gap-2 uppercase tracking-widest"
              title="INITIATE_REBOOT"
            >
              <RotateCcw className="w-6 h-6" />
              <span>REBOOT_SYS</span>
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <h2 className="text-5xl font-bold text-cyan-400 animate-glitch bg-black px-4">SYS_PAUSED</h2>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-fuchsia-500 text-lg flex gap-6 animate-pulse">
        <span>[W,A,S,D / ARROWS] OVERRIDE_DIR</span>
        <span>[SPACE] HALT_PROCESS</span>
      </div>
    </div>
  );
}
