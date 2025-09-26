import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

interface SpaceInvadersIslandProps {
  onExit: () => void;
}

export function SpaceInvadersIsland({ onExit }: SpaceInvadersIslandProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isVictory, setIsVictory] = useState(false);

  // Sound effects
  const explosionSound = useRef<HTMLAudioElement | null>(null);
  const laserSound = useRef<HTMLAudioElement | null>(null);
  const shipMoveSound = useRef<HTMLAudioElement | null>(null);
  const gameStartSound = useRef<HTMLAudioElement | null>(null);
  const victorySound = useRef<HTMLAudioElement | null>(null);
  const backgroundMusic = useRef<HTMLAudioElement | null>(null);
  const nextLevelSound = useRef<HTMLAudioElement | null>(null);
  const shipDestroyedSound = useRef<HTMLAudioElement | null>(null);
  const gameStateRef = useRef({
    gameRunning: true,
    animationFrame: 0,
    enemyAnimFrame: 0,
    moveCounter: 0,
    shootCooldown: 0,
    player: {
      gridX: 0,
      y: 0,
      width: 40,
      height: 30,
      moveLeft: false,
      moveRight: false,
      lastMove: 0
    },
    bullets: [] as Array<{ x: number; y: number }>,
    enemyBullets: [] as Array<{ x: number; y: number }>,
    enemies: [] as Array<{ gridX: number; gridY: number; alive: boolean; type: number }>,
    stars: [] as Array<{ x: number; y: number; size: number; brightness: number; speed: number }>,
    enemyMoveDelay: 40,
    enemyDirection: 1
  });

  const GRID_SIZE = 40;
  const MOVE_DELAY = 8;
  const ANIM_SPEED = 15;
  const bulletSpeed = 8;
  const enemyBulletSpeed = 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize sound effects from Cloudflare R2 CDN
    explosionSound.current = new Audio('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/explotion.mp3');
    laserSound.current = new Audio('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/laserSound.mp3');
    shipMoveSound.current = new Audio('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/ShipMove.mp3');
    gameStartSound.current = new Audio('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/gameStart-1.mp3');
    victorySound.current = new Audio('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/victory.mp3');
    backgroundMusic.current = new Audio('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/spaceInvadersBackground.mp3');
    nextLevelSound.current = new Audio('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/nextLevel.mp3');
    shipDestroyedSound.current = new Audio('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/shipDestroyed.mp3');

    // Set volume levels
    if (explosionSound.current) explosionSound.current.volume = 0.3;
    if (laserSound.current) laserSound.current.volume = 0.2;
    if (shipMoveSound.current) shipMoveSound.current.volume = 0.2;
    if (gameStartSound.current) gameStartSound.current.volume = 0.4;
    if (victorySound.current) victorySound.current.volume = 0.3;
    if (backgroundMusic.current) {
      backgroundMusic.current.volume = 0.05;
      backgroundMusic.current.loop = true;
    }
    if (nextLevelSound.current) nextLevelSound.current.volume = 0.3;
    if (shipDestroyedSound.current) shipDestroyedSound.current.volume = 0.1;

    const gameState = gameStateRef.current;

    // Initialize game only once
    if (gameState.stars.length === 0) {
      gameState.player.gridX = Math.floor(canvas.width / 2 / GRID_SIZE);
      gameState.player.y = canvas.height - 80;

      // Create stars
      for (let i = 0; i < 100; i++) {
        gameState.stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          brightness: Math.random(),
          speed: Math.random() * 0.5
        });
      }
    }

    function createEnemies() {
      gameState.enemies.length = 0;
      const rows = 4 + Math.floor(level / 3);
      const cols = 10;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          gameState.enemies.push({
            gridX: col + 2,
            gridY: row + 1,
            alive: true,
            type: row % 3
          });
        }
      }
    }

    function drawPixelEnemy(x: number, y: number, frame: number, type: number) {
      const size = 8;
      const isDarkMode = document.documentElement.classList.contains('dark-mode');

      if (isDarkMode) {
        ctx!.fillStyle = type === 0 ? '#8464ee' : type === 1 ? '#c1b9f9' : '#6431d0';
      } else {
        ctx!.fillStyle = type === 0 ? '#4a3293' : type === 1 ? '#6b46c1' : '#2d1b69';
      }
      
      if (frame === 0) {
        ctx!.fillRect(x + size, y, size * 3, size);
        ctx!.fillRect(x, y + size, size * 5, size);
        ctx!.fillRect(x, y + size * 2, size, size);
        ctx!.fillRect(x + size * 4, y + size * 2, size, size);
        ctx!.fillRect(x + size, y + size * 3, size * 3, size);
      } else {
        ctx!.fillRect(x + size, y, size * 3, size);
        ctx!.fillRect(x, y + size, size * 5, size);
        ctx!.fillRect(x, y + size * 2, size * 2, size);
        ctx!.fillRect(x + size * 3, y + size * 2, size * 2, size);
        ctx!.fillRect(x + size * 2, y + size * 3, size, size);
      }
    }

    function drawPixelPlayer(x: number, y: number) {
      const size = 10;
      const isDarkMode = document.documentElement.classList.contains('dark-mode');
      ctx!.fillStyle = isDarkMode ? '#c1b9f9' : '#2d1b69';
      
      ctx!.fillRect(x + size, y, size, size);
      ctx!.fillRect(x, y + size, size * 3, size);
      ctx!.fillRect(x, y + size * 2, size * 3, size);
    }

    function drawPlayer() {
      const x = gameState.player.gridX * GRID_SIZE;
      drawPixelPlayer(x, gameState.player.y);
    }

    function drawStars() {
      gameState.stars.forEach(star => {
        star.brightness += star.speed;
        if (star.brightness > 1) star.brightness = 0;
        
        const alpha = Math.abs(Math.sin(star.brightness * Math.PI));
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        const starColor = isDarkMode ? '237, 234, 253' : '31, 41, 55';
        ctx!.fillStyle = `rgba(${starColor}, ${alpha})`;
        ctx!.fillRect(star.x, star.y, star.size, star.size);
      });
    }

    function drawEnemies() {
      const frame = Math.floor(gameState.enemyAnimFrame / ANIM_SPEED) % 2;
      gameState.enemies.forEach(enemy => {
        if (enemy.alive) {
          const x = enemy.gridX * GRID_SIZE;
          const y = enemy.gridY * GRID_SIZE;
          drawPixelEnemy(x, y, frame, enemy.type);
        }
      });
    }

    function drawBullets() {
      const isDarkMode = document.documentElement.classList.contains('dark-mode');

      ctx!.fillStyle = isDarkMode ? '#edeafd' : '#1f2937';
      gameState.bullets.forEach(bullet => {
        ctx!.fillRect(bullet.x - 2, bullet.y, 4, 12);
      });

      ctx!.fillStyle = isDarkMode ? '#8464ee' : '#4a3293';
      gameState.enemyBullets.forEach(bullet => {
        ctx!.fillRect(bullet.x - 2, bullet.y, 4, 12);
      });
    }

    function updatePlayer() {
      const currentTime = Date.now();
      if (currentTime - gameState.player.lastMove > 100) {
        if (gameState.player.moveLeft && gameState.player.gridX > 0) {
          gameState.player.gridX--;
          gameState.player.lastMove = currentTime;
        }
        if (gameState.player.moveRight && gameState.player.gridX < Math.floor(canvas!.width / GRID_SIZE) - 1) {
          gameState.player.gridX++;
          gameState.player.lastMove = currentTime;
        }
      }
    }

    function updateBullets() {
      gameState.bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y < 0) {
          gameState.bullets.splice(index, 1);
        }
      });
      
      gameState.enemyBullets.forEach((bullet, index) => {
        bullet.y += enemyBulletSpeed;
        if (bullet.y > canvas!.height) {
          gameState.enemyBullets.splice(index, 1);
        }
      });
    }

    function updateEnemies() {
      gameState.moveCounter++;
      
      if (gameState.moveCounter >= gameState.enemyMoveDelay) {
        gameState.moveCounter = 0;
        let shouldMoveDown = false;
        
        gameState.enemies.forEach(enemy => {
          if (enemy.alive) {
            const nextX = enemy.gridX + gameState.enemyDirection;
            if (nextX < 0 || nextX >= Math.floor(canvas!.width / GRID_SIZE)) {
              shouldMoveDown = true;
            }
          }
        });
        
        if (shouldMoveDown) {
          gameState.enemyDirection *= -1;
          gameState.enemies.forEach(enemy => {
            if (enemy.alive) {
              enemy.gridY += 1;
            }
          });
        } else {
          gameState.enemies.forEach(enemy => {
            if (enemy.alive) {
              enemy.gridX += gameState.enemyDirection;
            }
          });
        }

      }

      if (Math.random() < 0.015) {
        const aliveEnemies = gameState.enemies.filter(e => e.alive);
        if (aliveEnemies.length > 0) {
          const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
          gameState.enemyBullets.push({
            x: shooter.gridX * GRID_SIZE + 20,
            y: shooter.gridY * GRID_SIZE + 32
          });
        }
      }
    }

    function checkCollisions() {
      // Check bullet-enemy collisions
      for (let bIndex = gameState.bullets.length - 1; bIndex >= 0; bIndex--) {
        const bullet = gameState.bullets[bIndex];
        let bulletHit = false;
        
        for (let enemy of gameState.enemies) {
          if (enemy.alive) {
            const enemyX = enemy.gridX * GRID_SIZE;
            const enemyY = enemy.gridY * GRID_SIZE;
            
            if (bullet.x > enemyX && bullet.x < enemyX + 40 &&
                bullet.y > enemyY && bullet.y < enemyY + 32) {
              enemy.alive = false;
              gameState.bullets.splice(bIndex, 1);
              setScore(prev => prev + 10);

              // Play ship destroyed sound when enemy is destroyed
              if (shipDestroyedSound.current) {
                shipDestroyedSound.current.currentTime = 0;
                shipDestroyedSound.current.play().catch(e => console.log('Audio play failed:', e));
              }

              bulletHit = true;
              break;
            }
          }
        }
        
        if (bulletHit) continue;
      }
      
      gameState.enemyBullets.forEach((bullet, index) => {
        const playerX = gameState.player.gridX * GRID_SIZE;
        if (bullet.x > playerX && bullet.x < playerX + 30 &&
            bullet.y > gameState.player.y && bullet.y < gameState.player.y + 30) {
          gameState.enemyBullets.splice(index, 1);
          setLives(prev => {
            const newLives = prev - 1;

            // Play ship move sound when losing a life
            if (shipMoveSound.current) {
              shipMoveSound.current.currentTime = 0;
              shipMoveSound.current.play().catch(e => console.log('Audio play failed:', e));
            }

            if (newLives <= 0) {
              endGame();
            }
            return newLives;
          });
        }
      });
      
      gameState.enemies.forEach(enemy => {
        if (enemy.alive && enemy.gridY * GRID_SIZE >= gameState.player.y - 40) {
          endGame();
        }
      });
      
      const aliveEnemies = gameState.enemies.filter(e => e.alive);
      if (aliveEnemies.length === 0) {
        const newLevel = level + 1;
        setLevel(prev => prev + 1);
        gameState.enemyMoveDelay = Math.max(10, gameState.enemyMoveDelay - 3);

        // Check for victory condition (level 10)
        if (newLevel >= 10) {
          gameState.gameRunning = false;
          if (gameState.animationFrame) {
            cancelAnimationFrame(gameState.animationFrame);
          }

          // Stop background music
          if (backgroundMusic.current) {
            backgroundMusic.current.pause();
            backgroundMusic.current.currentTime = 0;
          }

          // Play victory sound
          if (victorySound.current) {
            victorySound.current.currentTime = 0;
            victorySound.current.play().catch(e => console.log('Audio play failed:', e));
          }

          setFinalScore(score);
          setIsVictory(true);
          setGameOver(true);
          return;
        }

        // Play next level sound
        if (nextLevelSound.current) {
          nextLevelSound.current.currentTime = 0;
          nextLevelSound.current.play().catch(e => console.log('Audio play failed:', e));
        }

        createEnemies();
      }
    }

    function endGame() {
      gameState.gameRunning = false;
      if (gameState.animationFrame) {
        cancelAnimationFrame(gameState.animationFrame);
      }

      // Stop background music
      if (backgroundMusic.current) {
        backgroundMusic.current.pause();
        backgroundMusic.current.currentTime = 0;
      }

      // Play explosion sound when game ends
      if (explosionSound.current) {
        explosionSound.current.currentTime = 0;
        explosionSound.current.play().catch(e => console.log('Audio play failed:', e));
      }

      setFinalScore(score);
      setGameOver(true);
    }

    function gameLoop() {
      if (!gameState.gameRunning) return;
      
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      
      gameState.animationFrame++;
      gameState.enemyAnimFrame++;
      
      updatePlayer();
      updateBullets();
      updateEnemies();
      checkCollisions();
      
      drawStars();
      drawPlayer();
      drawEnemies();
      drawBullets();
      
      gameState.animationFrame = requestAnimationFrame(gameLoop);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        gameState.player.moveLeft = true;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        gameState.player.moveRight = true;
      }
      if (e.key === ' ') {
        e.preventDefault();
        if (gameState.shootCooldown === 0) {
          gameState.bullets.push({
            x: gameState.player.gridX * GRID_SIZE + 15,
            y: gameState.player.y
          });
          gameState.shootCooldown = 10;

          // Play laser sound when shooting
          if (laserSound.current) {
            laserSound.current.currentTime = 0;
            laserSound.current.play().catch(e => console.log('Audio play failed:', e));
          }
        }
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') gameState.player.moveLeft = false;
      if (e.key === 'ArrowRight') gameState.player.moveRight = false;
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    const cooldownInterval = setInterval(() => {
      if (gameState.shootCooldown > 0) gameState.shootCooldown--;
    }, 50);

    createEnemies();

    // Start background music
    if (backgroundMusic.current) {
      backgroundMusic.current.play().catch(e => console.log('Background music play failed:', e));
    }

    gameLoop();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      clearInterval(cooldownInterval);
      gameState.gameRunning = false;
      if (gameState.animationFrame) {
        cancelAnimationFrame(gameState.animationFrame);
      }
      // Stop background music
      if (backgroundMusic.current) {
        backgroundMusic.current.pause();
        backgroundMusic.current.currentTime = 0;
      }
    };
  }, []); // Empty dependency array - run only once

  const restartGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Play game start sound when restarting
    if (gameStartSound.current) {
      gameStartSound.current.currentTime = 0;
      gameStartSound.current.play().catch(e => console.log('Audio play failed:', e));
    }

    // Reset React state
    setScore(0);
    setLives(5);
    setLevel(1);
    setGameOver(false);
    setIsVictory(false);
    
    const gameState = gameStateRef.current;
    
    // Cancel any existing animation frame
    if (gameState.animationFrame) {
      cancelAnimationFrame(gameState.animationFrame);
    }
    
    // Reset game state
    gameState.enemyMoveDelay = 40;
    gameState.gameRunning = true;
    gameState.bullets.length = 0;
    gameState.enemyBullets.length = 0;
    gameState.player.gridX = Math.floor(canvas.width / 2 / GRID_SIZE);
    gameState.player.y = canvas.height - 80;
    gameState.enemyDirection = 1;
    gameState.moveCounter = 0;
    gameState.shootCooldown = 0;
    gameState.animationFrame = 0;
    gameState.enemyAnimFrame = 0;
    
    // Recreate enemies
    gameState.enemies.length = 0;
    const rows = 4;
    const cols = 10;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        gameState.enemies.push({
          gridX: col + 2,
          gridY: row + 1,
          alive: true,
          type: row % 3
        });
      }
    }
    
    // Restart game loop
    function gameLoop() {
      if (!gameState.gameRunning) return;
      
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      
      gameState.animationFrame++;
      gameState.enemyAnimFrame++;
      
      // Update functions (same as in useEffect)
      updatePlayer();
      updateBullets();
      updateEnemies();
      checkCollisions();
      
      drawStars();
      drawPlayer();
      drawEnemies();
      drawBullets();
      
      gameState.animationFrame = requestAnimationFrame(gameLoop);
    }

    // Helper functions for restart (simplified versions)
    function updatePlayer() {
      if (!canvas) return;
      const currentTime = Date.now();
      if (currentTime - gameState.player.lastMove > 100) {
        if (gameState.player.moveLeft && gameState.player.gridX > 0) {
          gameState.player.gridX--;
          gameState.player.lastMove = currentTime;
        }
        if (gameState.player.moveRight && gameState.player.gridX < Math.floor(canvas!.width / GRID_SIZE) - 1) {
          gameState.player.gridX++;
          gameState.player.lastMove = currentTime;
        }
      }
    }

    function updateBullets() {
      gameState.bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y < 0) {
          gameState.bullets.splice(index, 1);
        }
      });
      
      gameState.enemyBullets.forEach((bullet, index) => {
        bullet.y += enemyBulletSpeed;
        if (bullet.y > canvas!.height) {
          gameState.enemyBullets.splice(index, 1);
        }
      });
    }

    function updateEnemies() {
      gameState.moveCounter++;
      
      if (gameState.moveCounter >= gameState.enemyMoveDelay) {
        gameState.moveCounter = 0;
        let shouldMoveDown = false;
        
        gameState.enemies.forEach(enemy => {
          if (enemy.alive) {
            const nextX = enemy.gridX + gameState.enemyDirection;
            if (nextX < 0 || nextX >= Math.floor(canvas!.width / GRID_SIZE)) {
              shouldMoveDown = true;
            }
          }
        });
        
        if (shouldMoveDown) {
          gameState.enemyDirection *= -1;
          gameState.enemies.forEach(enemy => {
            if (enemy.alive) {
              enemy.gridY += 1;
            }
          });
        } else {
          gameState.enemies.forEach(enemy => {
            if (enemy.alive) {
              enemy.gridX += gameState.enemyDirection;
            }
          });
        }

      }

      if (Math.random() < 0.015) {
        const aliveEnemies = gameState.enemies.filter(e => e.alive);
        if (aliveEnemies.length > 0) {
          const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
          gameState.enemyBullets.push({
            x: shooter.gridX * GRID_SIZE + 20,
            y: shooter.gridY * GRID_SIZE + 32
          });
        }
      }
    }

    function checkCollisions() {
      // Check bullet-enemy collisions
      for (let bIndex = gameState.bullets.length - 1; bIndex >= 0; bIndex--) {
        const bullet = gameState.bullets[bIndex];
        let bulletHit = false;
        
        for (let enemy of gameState.enemies) {
          if (enemy.alive) {
            const enemyX = enemy.gridX * GRID_SIZE;
            const enemyY = enemy.gridY * GRID_SIZE;
            
            if (bullet.x > enemyX && bullet.x < enemyX + 40 &&
                bullet.y > enemyY && bullet.y < enemyY + 32) {
              enemy.alive = false;
              gameState.bullets.splice(bIndex, 1);
              setScore(prev => prev + 10);

              // Play ship destroyed sound when enemy is destroyed
              if (shipDestroyedSound.current) {
                shipDestroyedSound.current.currentTime = 0;
                shipDestroyedSound.current.play().catch(e => console.log('Audio play failed:', e));
              }

              bulletHit = true;
              break;
            }
          }
        }
        
        if (bulletHit) continue;
      }
      
      gameState.enemyBullets.forEach((bullet, index) => {
        const playerX = gameState.player.gridX * GRID_SIZE;
        if (bullet.x > playerX && bullet.x < playerX + 30 &&
            bullet.y > gameState.player.y && bullet.y < gameState.player.y + 30) {
          gameState.enemyBullets.splice(index, 1);
          setLives(prev => {
            const newLives = prev - 1;

            // Play ship move sound when losing a life
            if (shipMoveSound.current) {
              shipMoveSound.current.currentTime = 0;
              shipMoveSound.current.play().catch(e => console.log('Audio play failed:', e));
            }

            if (newLives <= 0) {
              gameState.gameRunning = false;
              setGameOver(true);
            }
            return newLives;
          });
        }
      });
      
      gameState.enemies.forEach(enemy => {
        if (enemy.alive && enemy.gridY * GRID_SIZE >= gameState.player.y - 40) {
          gameState.gameRunning = false;
          setGameOver(true);
        }
      });
      
      const aliveEnemies = gameState.enemies.filter(e => e.alive);
      if (aliveEnemies.length === 0) {
        const newLevel = level + 1;
        setLevel(prev => prev + 1);
        gameState.enemyMoveDelay = Math.max(10, gameState.enemyMoveDelay - 3);

        // Check for victory condition (level 10)
        if (newLevel >= 10) {
          gameState.gameRunning = false;

          // Stop background music
          if (backgroundMusic.current) {
            backgroundMusic.current.pause();
            backgroundMusic.current.currentTime = 0;
          }

          // Play victory sound
          if (victorySound.current) {
            victorySound.current.currentTime = 0;
            victorySound.current.play().catch(e => console.log('Audio play failed:', e));
          }

          setIsVictory(true);
          setGameOver(true);
          return;
        }

        // Play next level sound
        if (nextLevelSound.current) {
          nextLevelSound.current.currentTime = 0;
          nextLevelSound.current.play().catch(e => console.log('Audio play failed:', e));
        }

        // Recreate enemies for next level
        gameState.enemies.length = 0;
        const rows = 4 + Math.floor(1 / 3); // Start with level 1
        const cols = 10;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            gameState.enemies.push({
              gridX: col + 2,
              gridY: row + 1,
              alive: true,
              type: row % 3
            });
          }
        }
      }
    }

    function drawStars() {
      gameState.stars.forEach(star => {
        star.brightness += star.speed;
        if (star.brightness > 1) star.brightness = 0;
        
        const alpha = Math.abs(Math.sin(star.brightness * Math.PI));
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        const starColor = isDarkMode ? '237, 234, 253' : '31, 41, 55';
        ctx!.fillStyle = `rgba(${starColor}, ${alpha})`;
        ctx!.fillRect(star.x, star.y, star.size, star.size);
      });
    }

    function drawPlayer() {
      const x = gameState.player.gridX * GRID_SIZE;
      drawPixelPlayer(x, gameState.player.y);
    }

    function drawPixelPlayer(x: number, y: number) {
      const size = 10;
      const isDarkMode = document.documentElement.classList.contains('dark-mode');
      ctx!.fillStyle = isDarkMode ? '#c1b9f9' : '#2d1b69';
      
      ctx!.fillRect(x + size, y, size, size);
      ctx!.fillRect(x, y + size, size * 3, size);
      ctx!.fillRect(x, y + size * 2, size * 3, size);
    }

    function drawEnemies() {
      const frame = Math.floor(gameState.enemyAnimFrame / ANIM_SPEED) % 2;
      gameState.enemies.forEach(enemy => {
        if (enemy.alive) {
          const x = enemy.gridX * GRID_SIZE;
          const y = enemy.gridY * GRID_SIZE;
          drawPixelEnemy(x, y, frame, enemy.type);
        }
      });
    }

    function drawPixelEnemy(x: number, y: number, frame: number, type: number) {
      const size = 8;
      const isDarkMode = document.documentElement.classList.contains('dark-mode');

      if (isDarkMode) {
        ctx!.fillStyle = type === 0 ? '#8464ee' : type === 1 ? '#c1b9f9' : '#6431d0';
      } else {
        ctx!.fillStyle = type === 0 ? '#4a3293' : type === 1 ? '#6b46c1' : '#2d1b69';
      }
      
      if (frame === 0) {
        ctx!.fillRect(x + size, y, size * 3, size);
        ctx!.fillRect(x, y + size, size * 5, size);
        ctx!.fillRect(x, y + size * 2, size, size);
        ctx!.fillRect(x + size * 4, y + size * 2, size, size);
        ctx!.fillRect(x + size, y + size * 3, size * 3, size);
      } else {
        ctx!.fillRect(x + size, y, size * 3, size);
        ctx!.fillRect(x, y + size, size * 5, size);
        ctx!.fillRect(x, y + size * 2, size * 2, size);
        ctx!.fillRect(x + size * 3, y + size * 2, size * 2, size);
        ctx!.fillRect(x + size * 2, y + size * 3, size, size);
      }
    }

    function drawBullets() {
      const isDarkMode = document.documentElement.classList.contains('dark-mode');

      ctx!.fillStyle = isDarkMode ? '#edeafd' : '#1f2937';
      gameState.bullets.forEach(bullet => {
        ctx!.fillRect(bullet.x - 2, bullet.y, 4, 12);
      });

      ctx!.fillStyle = isDarkMode ? '#8464ee' : '#4a3293';
      gameState.enemyBullets.forEach(bullet => {
        ctx!.fillRect(bullet.x - 2, bullet.y, 4, 12);
      });
    }

    // Restart background music
    if (backgroundMusic.current) {
      backgroundMusic.current.currentTime = 0;
      backgroundMusic.current.play().catch(e => console.log('Background music play failed:', e));
    }

    gameLoop();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-invaders-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '600px',
        fontFamily: 'var(--font-game)',
        color: '#0f0',
        position: 'relative'
      }}
    >
      {/* Exit Button */}
      <motion.button
        onClick={onExit}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="space-invaders-exit-button"
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
        className="space-invaders-canvas"
        style={{
          imageRendering: 'pixelated',
          maxWidth: '100%',
          height: 'auto'
        }}
      />

      {/* Game Info */}
      <div
        className="space-invaders-stats"
        style={{
          marginTop: '20px',
          fontSize: '20px',
          display: 'flex',
          gap: '40px',
          fontFamily: 'var(--font-game)'
        }}
      >
        <div>Score: <span className="space-invaders-score">{score}</span></div>
        <div>Lives: <span className="space-invaders-lives">{lives}</span></div>
        <div>Level: <span className="space-invaders-level">{level}</span></div>
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="space-invaders-modal"
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
            <h2 className="space-invaders-modal-title" style={{ margin: '0 0 20px 0', fontSize: '24px' }}>
              {isVictory ? 'VICTORY!' : 'GAME OVER'}
            </h2>
            <p className="space-invaders-modal-text" style={{ fontSize: '18px', margin: '20px 0' }}>
              {isVictory ? 'Congratulations! You completed all levels!' : 'Try again!'}
            </p>
            <p className="space-invaders-modal-text" style={{ fontSize: '18px', margin: '20px 0' }}>
              Final Score: <span className="space-invaders-final-score">{finalScore}</span>
            </p>
            <motion.button
              onClick={restartGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="space-invaders-restart-button"
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

// CSS styles for Space Invaders light/dark mode following the exact same pattern as p_AurinTaskManager.astro
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    /* Default light mode styles */
    .space-invaders-container {
      color: #1f2937;
      transition: color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .space-invaders-exit-button {
      background: #f9fafb !important;
      color: #1f2937 !important;
      transition:
        background-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .space-invaders-stats {
      color: #1f2937;
      transition: color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .space-invaders-score {
      color: #4a3293;
      transition: color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .space-invaders-lives {
      color: #6b46c1;
      transition: color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .space-invaders-level {
      color: #2d1b69;
      transition: color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .space-invaders-modal {
      background: #ffffff !important;
      border: 1px solid #e5e7eb !important;
      transition:
        background-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        border-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .space-invaders-modal-title {
      color: #1f2937 !important;
      transition: color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .space-invaders-modal-text {
      color: #6b46c1 !important;
      transition: color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .space-invaders-final-score {
      color: #4a3293;
      transition: color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .space-invaders-restart-button {
      background: #4a3293 !important;
      color: #ffffff !important;
      transition:
        background-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    /* Dark mode styles - following exact same pattern as p_AurinTaskManager.astro */
    :global(.dark-mode) .space-invaders-container {
      color: #edeafd;
    }

    :global(.dark-mode) .space-invaders-exit-button {
      background: #1f1f1f !important;
      color: #edeafd !important;
    }

    :global(.dark-mode) .space-invaders-stats {
      color: #edeafd;
    }

    :global(.dark-mode) .space-invaders-score {
      color: #8464ee;
    }

    :global(.dark-mode) .space-invaders-lives {
      color: #c1b9f9;
    }

    :global(.dark-mode) .space-invaders-level {
      color: #6431d0;
    }

    :global(.dark-mode) .space-invaders-modal {
      background: #1f1f1f !important;
      border: 1px solid #333333 !important;
    }

    :global(.dark-mode) .space-invaders-modal-title {
      color: #edeafd !important;
    }

    :global(.dark-mode) .space-invaders-modal-text {
      color: #c1b9f9 !important;
    }

    :global(.dark-mode) .space-invaders-final-score {
      color: #8464ee;
    }

    :global(.dark-mode) .space-invaders-restart-button {
      background: #6431d0 !important;
      color: #edeafd !important;
    }
  `;
  document.head.appendChild(style);
}
