/**
 * Japanese Acid Rain (酸性雨) Falling Words Typing Game Engine
 */

import { parseKanaToRomajiTokens } from './romaji.js';
import { sound } from './sound.js';
import { recordPracticeScore } from './firebase.js';
import { auth } from './auth.js';

const GAME_WORDS = [
  { kanji: '桜', kana: 'さくら' },
  { kanji: '海', kana: 'うみ' },
  { kanji: '空', kana: 'そら' },
  { kanji: '星', kana: 'ほし' },
  { kanji: '夢', kana: 'ゆめ' },
  { kanji: '未来', kana: 'みらい' },
  { kanji: '光', kana: 'ひかり' },
  { kanji: '風', kana: 'かぜ' },
  { kanji: '虹', kana: 'にじ' },
  { kanji: '太陽', kana: 'たいよう' },
  { kanji: '学校', kana: 'がっこう' },
  { kanji: '友達', kana: 'ともだち' },
  { kanji: '挑戦', kana: 'ちょうせん' },
  { kanji: '希望', kana: 'きぼう' },
  { kanji: '平和', kana: 'へいわ' }
];

export class TypingGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.words = [];
    this.score = 0;
    this.lives = 5;
    this.combo = 0;
    this.isRunning = false;
    this.animFrame = null;
    this.spawnTimer = null;
    this.currentInput = '';
    this.speed = 1.2;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.isRunning) return;

      if (e.key === 'Backspace') {
        this.currentInput = this.currentInput.slice(0, -1);
        this.updateInputDisplay();
        return;
      }

      if (e.key.length === 1 && /[a-zA-Z\-]/i.test(e.key)) {
        this.currentInput += e.key.toLowerCase();
        this.checkWordMatch();
        this.updateInputDisplay();
      }
    });
  }

  updateInputDisplay() {
    const el = document.getElementById('game-input-text');
    if (el) el.textContent = this.currentInput;
  }

  start() {
    if (!this.canvas) return;
    this.words = [];
    this.score = 0;
    this.lives = 5;
    this.combo = 0;
    this.speed = 1.2;
    this.currentInput = '';
    this.isRunning = true;

    this.updateHUD();
    this.spawnWord();

    clearInterval(this.spawnTimer);
    this.spawnTimer = setInterval(() => {
      if (this.isRunning) this.spawnWord();
    }, 2200);

    this.loop();
  }

  spawnWord() {
    const item = GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];
    const tokens = parseKanaToRomajiTokens(item.kana);
    const targetRomaji = tokens.map(t => t.defaultRomaji).join('');

    const padding = 100;
    const x = padding + Math.random() * (this.canvas.width - padding * 2);

    this.words.push({
      kanji: item.kanji,
      kana: item.kana,
      romaji: targetRomaji,
      x: x,
      y: 30,
      speed: this.speed + Math.random() * 0.5
    });
  }

  checkWordMatch() {
    for (let i = 0; i < this.words.length; i++) {
      const w = this.words[i];
      if (w.romaji === this.currentInput) {
        // Matched!
        this.score += 100 + this.combo * 10;
        this.combo++;
        this.speed += 0.05;
        sound.playSuccessSound();
        this.words.splice(i, 1);
        this.currentInput = '';
        this.updateHUD();
        return;
      }
    }
  }

  loop() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update & Draw falling words
    for (let i = this.words.length - 1; i >= 0; i--) {
      const w = this.words[i];
      w.y += w.speed;

      // Draw word card
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.roundRect(w.x - 70, w.y - 30, 140, 50, 10);
      this.ctx.fill();
      this.ctx.stroke();

      // Text
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 18px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`${w.kanji} (${w.kana})`, w.x, w.y - 8);

      this.ctx.fillStyle = '#38bdf8';
      this.ctx.font = '14px monospace';
      this.ctx.fillText(w.romaji, w.x, w.y + 14);

      // Check bottom hit
      if (w.y > this.canvas.height - 40) {
        this.lives--;
        this.combo = 0;
        sound.playErrorSound();
        this.words.splice(i, 1);
        this.updateHUD();

        if (this.lives <= 0) {
          this.gameOver();
          return;
        }
      }
    }

    this.animFrame = requestAnimationFrame(() => this.loop());
  }

  updateHUD() {
    const scoreEl = document.getElementById('game-score');
    const comboEl = document.getElementById('game-combo');
    const livesEl = document.getElementById('game-lives');

    if (scoreEl) scoreEl.textContent = this.score;
    if (comboEl) comboEl.textContent = this.combo;
    if (livesEl) livesEl.textContent = '❤️'.repeat(this.lives);
  }

  async gameOver() {
    this.isRunning = false;
    clearInterval(this.spawnTimer);
    cancelAnimationFrame(this.animFrame);

    const user = auth.getCurrentUser();
    await recordPracticeScore({
      studentId: user.id,
      studentName: user.name,
      modeName: '酸性雨ゲーム',
      kpm: this.score,
      accuracy: 100,
      timeSec: 60
    });

    alert(`🎮 GAME OVER!\n最終スコア: ${this.score} 点\nコンボ数: ${this.combo}`);
  }

  stop() {
    this.isRunning = false;
    clearInterval(this.spawnTimer);
    cancelAnimationFrame(this.animFrame);
  }
}
