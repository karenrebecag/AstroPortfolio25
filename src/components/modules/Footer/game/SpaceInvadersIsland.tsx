import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import styles from './SpaceInvaders.module.css';

interface SpaceInvadersIslandProps {
  onExit: () => void;
}

// --- Game constants ---
const GRID_SIZE = 40;
const ANIM_SPEED = 15;
const BULLET_SPEED = 8;
const ENEMY_BULLET_SPEED = 5;

// --- Audio CDN base ---
const CDN = 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev';

// --- Game state type ---
interface GameState {
  gameRunning: boolean;
  animationFrame: number;
  enemyAnimFrame: number;
  moveCounter: number;
  shootCooldown: number;
  player: {
    gridX: number;
    y: number;
    width: number;
    height: number;
    moveLeft: boolean;
    moveRight: boolean;
    lastMove: number;
  };
  bullets: Array<{ x: number; y: number }>;
  enemyBullets: Array<{ x: number; y: number }>;
  enemies: Array<{ gridX: number; gridY: number; alive: boolean; type: number }>;
  stars: Array<{ x: number; y: number; size: number; brightness: number; speed: number }>;
  enemyMoveDelay: number;
  enemyDirection: number;
}

// --- Preloaded audio singleton (created once per module) ---
let audioCache: Record<string, HTMLAudioElement> | null = null;

function getAudio() {
  if (audioCache) return audioCache;
  if (typeof window === 'undefined') return null;
  audioCache = {
    explosion: Object.assign(new Audio(`${CDN}/explotion.mp3`), { volume: 0.3 }),
    laser: Object.assign(new Audio(`${CDN}/laserSound.mp3`), { volume: 0.2 }),
    shipMove: Object.assign(new Audio(`${CDN}/ShipMove.mp3`), { volume: 0.2 }),
    gameStart: Object.assign(new Audio(`${CDN}/gameStart-1.mp3`), { volume: 0.4 }),
    victory: Object.assign(new Audio(`${CDN}/victory.mp3`), { volume: 0.3 }),
    background: Object.assign(new Audio(`${CDN}/spaceInvadersBackground.mp3`), { volume: 0.05, loop: true }),
    nextLevel: Object.assign(new Audio(`${CDN}/nextLevel.mp3`), { volume: 0.3 }),
    shipDestroyed: Object.assign(new Audio(`${CDN}/shipDestroyed.mp3`), { volume: 0.1 }),
  };
  return audioCache;
}

function playSound(key: string) {
  const audio = getAudio();
  if (!audio?.[key]) return;
  audio[key].currentTime = 0;
  audio[key].play().catch(() => {});
}

function stopBackground() {
  const audio = getAudio();
  if (!audio?.background) return;
  audio.background.pause();
  audio.background.currentTime = 0;
}

// --- Extracted drawing functions ---
function drawPixelEnemy(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, type: number, isDark: boolean) {
  const size = 8;
  if (isDark) {
    ctx.fillStyle = type === 0 ? '#8464ee' : type === 1 ? '#c1b9f9' : '#6431d0';
  } else {
    ctx.fillStyle = type === 0 ? '#4a3293' : type === 1 ? '#6b46c1' : '#2d1b69';
  }

  if (frame === 0) {
    ctx.fillRect(x + size, y, size * 3, size);
    ctx.fillRect(x, y + size, size * 5, size);
    ctx.fillRect(x, y + size * 2, size, size);
    ctx.fillRect(x + size * 4, y + size * 2, size, size);
    ctx.fillRect(x + size, y + size * 3, size * 3, size);
  } else {
    ctx.fillRect(x + size, y, size * 3, size);
    ctx.fillRect(x, y + size, size * 5, size);
    ctx.fillRect(x, y + size * 2, size * 2, size);
    ctx.fillRect(x + size * 3, y + size * 2, size * 2, size);
    ctx.fillRect(x + size * 2, y + size * 3, size, size);
  }
}

function drawPixelPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, isDark: boolean) {
  const size = 10;
  ctx.fillStyle = isDark ? '#c1b9f9' : '#2d1b69';
  ctx.fillRect(x + size, y, size, size);
  ctx.fillRect(x, y + size, size * 3, size);
  ctx.fillRect(x, y + size * 2, size * 3, size);
}

function drawStars(ctx: CanvasRenderingContext2D, gs: GameState, isDark: boolean) {
  const starColor = isDark ? '237, 234, 253' : '31, 41, 55';
  gs.stars.forEach(star => {
    star.brightness += star.speed;
    if (star.brightness > 1) star.brightness = 0;
    const alpha = Math.abs(Math.sin(star.brightness * Math.PI));
    ctx.fillStyle = `rgba(${starColor}, ${alpha})`;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

function drawEnemies(ctx: CanvasRenderingContext2D, gs: GameState, isDark: boolean) {
  const frame = Math.floor(gs.enemyAnimFrame / ANIM_SPEED) % 2;
  gs.enemies.forEach(enemy => {
    if (enemy.alive) {
      drawPixelEnemy(ctx, enemy.gridX * GRID_SIZE, enemy.gridY * GRID_SIZE, frame, enemy.type, isDark);
    }
  });
}

function drawBullets(ctx: CanvasRenderingContext2D, gs: GameState, isDark: boolean) {
  ctx.fillStyle = isDark ? '#edeafd' : '#1f2937';
  gs.bullets.forEach(bullet => {
    ctx.fillRect(bullet.x - 2, bullet.y, 4, 12);
  });
  ctx.fillStyle = isDark ? '#8464ee' : '#4a3293';
  gs.enemyBullets.forEach(bullet => {
    ctx.fillRect(bullet.x - 2, bullet.y, 4, 12);
  });
}

function updatePlayer(gs: GameState, canvasWidth: number) {
  const currentTime = Date.now();
  if (currentTime - gs.player.lastMove > 100) {
    if (gs.player.moveLeft && gs.player.gridX > 0) {
      gs.player.gridX--;
      gs.player.lastMove = currentTime;
    }
    if (gs.player.moveRight && gs.player.gridX < Math.floor(canvasWidth / GRID_SIZE) - 1) {
      gs.player.gridX++;
      gs.player.lastMove = currentTime;
    }
  }
}

function updateBullets(gs: GameState, canvasHeight: number) {
  // Filter instead of splice-during-forEach (fixes index shifting bug)
  gs.bullets = gs.bullets.filter(bullet => {
    bullet.y -= BULLET_SPEED;
    return bullet.y >= 0;
  });
  gs.enemyBullets = gs.enemyBullets.filter(bullet => {
    bullet.y += ENEMY_BULLET_SPEED;
    return bullet.y <= canvasHeight;
  });
}

function updateEnemies(gs: GameState, canvasWidth: number) {
  gs.moveCounter++;

  if (gs.moveCounter >= gs.enemyMoveDelay) {
    gs.moveCounter = 0;
    let shouldMoveDown = false;

    gs.enemies.forEach(enemy => {
      if (enemy.alive) {
        const nextX = enemy.gridX + gs.enemyDirection;
        if (nextX < 0 || nextX >= Math.floor(canvasWidth / GRID_SIZE)) {
          shouldMoveDown = true;
        }
      }
    });

    if (shouldMoveDown) {
      gs.enemyDirection *= -1;
      gs.enemies.forEach(enemy => {
        if (enemy.alive) enemy.gridY += 1;
      });
    } else {
      gs.enemies.forEach(enemy => {
        if (enemy.alive) enemy.gridX += gs.enemyDirection;
      });
    }
  }

  if (Math.random() < 0.015) {
    const aliveEnemies = gs.enemies.filter(e => e.alive);
    if (aliveEnemies.length > 0) {
      const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
      gs.enemyBullets.push({
        x: shooter.gridX * GRID_SIZE + 20,
        y: shooter.gridY * GRID_SIZE + 32
      });
    }
  }
}

function createEnemies(gs: GameState, level: number) {
  gs.enemies.length = 0;
  const rows = 4 + Math.floor(level / 3);
  const cols = 10;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      gs.enemies.push({
        gridX: col + 2,
        gridY: row + 1,
        alive: true,
        type: row % 3
      });
    }
  }
}

export function SpaceInvadersIsland({ onExit }: SpaceInvadersIslandProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isVictory, setIsVictory] = useState(false);

  const gameStateRef = useRef<GameState>({
    gameRunning: true,
    animationFrame: 0,
    enemyAnimFrame: 0,
    moveCounter: 0,
    shootCooldown: 0,
    player: { gridX: 0, y: 0, width: 40, height: 30, moveLeft: false, moveRight: false, lastMove: 0 },
    bullets: [],
    enemyBullets: [],
    enemies: [],
    stars: [],
    enemyMoveDelay: 40,
    enemyDirection: 1
  });

  // Refs for mutable score/level/lives accessed inside game loop
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const livesRef = useRef(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gs = gameStateRef.current;

    // Initialize game only once
    if (gs.stars.length === 0) {
      gs.player.gridX = Math.floor(canvas.width / 2 / GRID_SIZE);
      gs.player.y = canvas.height - 80;

      for (let i = 0; i < 100; i++) {
        gs.stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          brightness: Math.random(),
          speed: Math.random() * 0.5
        });
      }
    }

    function checkCollisions() {
      // Bullet-enemy collisions (reverse iterate for safe splice)
      for (let bIndex = gs.bullets.length - 1; bIndex >= 0; bIndex--) {
        const bullet = gs.bullets[bIndex];
        for (const enemy of gs.enemies) {
          if (enemy.alive) {
            const ex = enemy.gridX * GRID_SIZE;
            const ey = enemy.gridY * GRID_SIZE;
            if (bullet.x > ex && bullet.x < ex + 40 && bullet.y > ey && bullet.y < ey + 32) {
              enemy.alive = false;
              gs.bullets.splice(bIndex, 1);
              scoreRef.current += 10;
              setScore(scoreRef.current);
              playSound('shipDestroyed');
              break;
            }
          }
        }
      }

      // Enemy bullet-player collisions (reverse iterate)
      for (let i = gs.enemyBullets.length - 1; i >= 0; i--) {
        const bullet = gs.enemyBullets[i];
        const px = gs.player.gridX * GRID_SIZE;
        if (bullet.x > px && bullet.x < px + 30 && bullet.y > gs.player.y && bullet.y < gs.player.y + 30) {
          gs.enemyBullets.splice(i, 1);
          livesRef.current--;
          setLives(livesRef.current);
          playSound('shipMove');
          if (livesRef.current <= 0) {
            endGame();
            return;
          }
        }
      }

      // Enemy reached player
      for (const enemy of gs.enemies) {
        if (enemy.alive && enemy.gridY * GRID_SIZE >= gs.player.y - 40) {
          endGame();
          return;
        }
      }

      // All enemies defeated
      const aliveEnemies = gs.enemies.filter(e => e.alive);
      if (aliveEnemies.length === 0) {
        levelRef.current++;
        setLevel(levelRef.current);
        gs.enemyMoveDelay = Math.max(10, gs.enemyMoveDelay - 3);

        if (levelRef.current >= 10) {
          gs.gameRunning = false;
          if (gs.animationFrame) cancelAnimationFrame(gs.animationFrame);
          stopBackground();
          playSound('victory');
          setFinalScore(scoreRef.current);
          setIsVictory(true);
          setGameOver(true);
          return;
        }

        playSound('nextLevel');
        createEnemies(gs, levelRef.current);
      }
    }

    function endGame() {
      gs.gameRunning = false;
      if (gs.animationFrame) cancelAnimationFrame(gs.animationFrame);
      stopBackground();
      playSound('explosion');
      setFinalScore(scoreRef.current);
      setGameOver(true);
    }

    function gameLoop() {
      if (!gs.gameRunning || !ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gs.animationFrame++;
      gs.enemyAnimFrame++;

      updatePlayer(gs, canvas.width);
      updateBullets(gs, canvas.height);
      updateEnemies(gs, canvas.width);
      checkCollisions();

      // Cache isDarkMode once per frame instead of per draw function
      const isDark = document.documentElement.classList.contains('dark-mode');

      drawStars(ctx, gs, isDark);
      drawPixelPlayer(ctx, gs.player.gridX * GRID_SIZE, gs.player.y, isDark);
      drawEnemies(ctx, gs, isDark);
      drawBullets(ctx, gs, isDark);

      gs.animationFrame = requestAnimationFrame(gameLoop);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); gs.player.moveLeft = true; }
      if (e.key === 'ArrowRight') { e.preventDefault(); gs.player.moveRight = true; }
      if (e.key === ' ') {
        e.preventDefault();
        if (gs.shootCooldown === 0) {
          gs.bullets.push({ x: gs.player.gridX * GRID_SIZE + 15, y: gs.player.y });
          gs.shootCooldown = 10;
          playSound('laser');
        }
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') gs.player.moveLeft = false;
      if (e.key === 'ArrowRight') gs.player.moveRight = false;
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    const cooldownInterval = setInterval(() => {
      if (gs.shootCooldown > 0) gs.shootCooldown--;
    }, 50);

    createEnemies(gs, levelRef.current);

    // Start background music
    const audio = getAudio();
    if (audio?.background) {
      audio.background.play().catch(() => {});
    }

    gameLoop();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      clearInterval(cooldownInterval);
      gs.gameRunning = false;
      if (gs.animationFrame) cancelAnimationFrame(gs.animationFrame);
      stopBackground();
    };
  }, []);

  const restartGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    playSound('gameStart');

    // Reset React state
    scoreRef.current = 0;
    levelRef.current = 1;
    livesRef.current = 5;
    setScore(0);
    setLives(5);
    setLevel(1);
    setGameOver(false);
    setIsVictory(false);

    const gs = gameStateRef.current;
    if (gs.animationFrame) cancelAnimationFrame(gs.animationFrame);

    // Reset game state
    gs.enemyMoveDelay = 40;
    gs.gameRunning = true;
    gs.bullets.length = 0;
    gs.enemyBullets.length = 0;
    gs.player.gridX = Math.floor(canvas.width / 2 / GRID_SIZE);
    gs.player.y = canvas.height - 80;
    gs.enemyDirection = 1;
    gs.moveCounter = 0;
    gs.shootCooldown = 0;
    gs.animationFrame = 0;
    gs.enemyAnimFrame = 0;

    createEnemies(gs, 1);

    // Restart background music
    const audio = getAudio();
    if (audio?.background) {
      audio.background.currentTime = 0;
      audio.background.play().catch(() => {});
    }

    // Reuse extracted functions - no duplication needed
    function checkCollisions() {
      for (let bIndex = gs.bullets.length - 1; bIndex >= 0; bIndex--) {
        const bullet = gs.bullets[bIndex];
        for (const enemy of gs.enemies) {
          if (enemy.alive) {
            const ex = enemy.gridX * GRID_SIZE;
            const ey = enemy.gridY * GRID_SIZE;
            if (bullet.x > ex && bullet.x < ex + 40 && bullet.y > ey && bullet.y < ey + 32) {
              enemy.alive = false;
              gs.bullets.splice(bIndex, 1);
              scoreRef.current += 10;
              setScore(scoreRef.current);
              playSound('shipDestroyed');
              break;
            }
          }
        }
      }

      for (let i = gs.enemyBullets.length - 1; i >= 0; i--) {
        const bullet = gs.enemyBullets[i];
        const px = gs.player.gridX * GRID_SIZE;
        if (bullet.x > px && bullet.x < px + 30 && bullet.y > gs.player.y && bullet.y < gs.player.y + 30) {
          gs.enemyBullets.splice(i, 1);
          livesRef.current--;
          setLives(livesRef.current);
          playSound('shipMove');
          if (livesRef.current <= 0) {
            gs.gameRunning = false;
            stopBackground();
            playSound('explosion');
            setFinalScore(scoreRef.current);
            setGameOver(true);
            return;
          }
        }
      }

      for (const enemy of gs.enemies) {
        if (enemy.alive && enemy.gridY * GRID_SIZE >= gs.player.y - 40) {
          gs.gameRunning = false;
          stopBackground();
          playSound('explosion');
          setFinalScore(scoreRef.current);
          setGameOver(true);
          return;
        }
      }

      const aliveEnemies = gs.enemies.filter(e => e.alive);
      if (aliveEnemies.length === 0) {
        levelRef.current++;
        setLevel(levelRef.current);
        gs.enemyMoveDelay = Math.max(10, gs.enemyMoveDelay - 3);

        if (levelRef.current >= 10) {
          gs.gameRunning = false;
          stopBackground();
          playSound('victory');
          setFinalScore(scoreRef.current);
          setIsVictory(true);
          setGameOver(true);
          return;
        }

        playSound('nextLevel');
        createEnemies(gs, levelRef.current);
      }
    }

    function gameLoop() {
      if (!gs.gameRunning || !ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gs.animationFrame++;
      gs.enemyAnimFrame++;

      updatePlayer(gs, canvas.width);
      updateBullets(gs, canvas.height);
      updateEnemies(gs, canvas.width);
      checkCollisions();

      const isDark = document.documentElement.classList.contains('dark-mode');
      drawStars(ctx, gs, isDark);
      drawPixelPlayer(ctx, gs.player.gridX * GRID_SIZE, gs.player.y, isDark);
      drawEnemies(ctx, gs, isDark);
      drawBullets(ctx, gs, isDark);

      gs.animationFrame = requestAnimationFrame(gameLoop);
    }

    gameLoop();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={styles.container}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '600px',
        fontFamily: 'var(--font-game)',
        position: 'relative'
      }}
    >
      {/* Exit Button */}
      <motion.button
        onClick={onExit}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={styles.exitButton}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          border: 'none',
          padding: '10px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: 'var(--font-game)',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10
        }}
        data-cursor-text="Exit Game"
      >
        <ChevronLeft size={16} />
        EXIT GAME
      </motion.button>

      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ imageRendering: 'pixelated', maxWidth: '100%', height: 'auto' }}
      />

      {/* Game Info */}
      <div
        className={styles.stats}
        style={{ marginTop: '20px', fontSize: '20px', display: 'flex', gap: '40px', fontFamily: 'var(--font-game)' }}
      >
        <div>Score: <span className={styles.score}>{score}</span></div>
        <div>Lives: <span className={styles.lives}>{lives}</span></div>
        <div>Level: <span className={styles.level}>{level}</span></div>
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={styles.modal}
            style={{
              position: 'fixed',
              top: '49%',
              left: '37%',
              transform: 'translate(-50%, -50%)',
              padding: '40px',
              borderRadius: '8px',
              textAlign: 'center',
              fontFamily: 'var(--font-game)',
              zIndex: 1000,
              maxWidth: '400px',
              width: '90%'
            }}
          >
            <h2 className={styles.modalTitle} style={{ margin: '0 0 20px 0', fontSize: '24px' }}>
              {isVictory ? 'VICTORY!' : 'GAME OVER'}
            </h2>
            <p className={styles.modalText} style={{ fontSize: '18px', margin: '20px 0' }}>
              {isVictory ? 'Congratulations! You completed all levels!' : 'Try again!'}
            </p>
            <p className={styles.modalText} style={{ fontSize: '18px', margin: '20px 0' }}>
              Final Score: <span className={styles.finalScore}>{finalScore}</span>
            </p>
            <motion.button
              onClick={restartGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.restartButton}
              style={{
                border: 'none',
                padding: '10px 30px',
                borderRadius: '4px',
                fontSize: '18px',
                fontFamily: 'var(--font-game)',
                cursor: 'pointer',
                marginTop: '20px'
              }}
              data-cursor-text="Restart"
            >
              RESTART
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
