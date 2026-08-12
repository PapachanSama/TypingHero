/**
 * Main Application Orchestrator - Handles 3 Scenes:
 * Scene 1: Start Prompt → Scene 2: Countdown → Scene 3: Main App
 */

import { initScaler } from './scale.js';
import { VirtualKeyboard } from './keyboard.js';
import { TypingEngine } from './typing.js';
import { TypingGame } from './game.js';
import { auth } from './auth.js';
import { ReportView } from './report.js';
import { sound } from './sound.js';
import { PRACTICE_DATA } from './data_jp.js';

const MODE_NAMES = {
  position: '各ポジション練習',
  word1: '単語練習1 (あいうえお順)',
  word2: '単語練習2',
  bunsetsu: '文節練習',
  short: '短文練習',
  long: '長文練習',
  game: '酸性雨ゲーム'
};

class App {
  constructor() {
    this.keyboard = null;
    this.typingEngine = null;
    this.gameEngine = null;
    this.reportView = null;
    this.currentTab = 'position';
    this.currentSubCat = 'home';
    this.sceneState = 'start'; // 'start' | 'countdown' | 'app'
  }

  async init() {
    await auth.init();
    this.updateUserUI();

    // Scene 1 space key listener
    this.bindStartScene();
  }

  bindStartScene() {
    const sceneStart = document.getElementById('scene-start');
    const modeLabel = document.getElementById('scene-mode-label');
    if (modeLabel) modeLabel.textContent = MODE_NAMES[this.currentTab] || '1. 各ポジション練習';

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (this.sceneState === 'start') {
          this.startCountdown();
        }
      }
    });
  }

  startCountdown() {
    this.sceneState = 'countdown';
    this.showScene('scene-countdown');
    sound.playKeySound();

    let count = 3;
    const numEl = document.getElementById('countdown-number');
    if (numEl) numEl.textContent = count;

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        if (numEl) numEl.textContent = count;
        sound.playKeySound();
      } else if (count === 0) {
        if (numEl) numEl.textContent = 'スタート！';
        sound.playSuccessSound();
      } else {
        clearInterval(timer);
        this.launchApp();
      }
    }, 800);
  }

  launchApp() {
    this.sceneState = 'app';
    this.showScene('app-viewport');

    // Initialize scaler only after app is visible
    initScaler();

    this.keyboard = new VirtualKeyboard('virtual-keyboard');
    this.typingEngine = new TypingEngine(this.keyboard);
    this.reportView = new ReportView();
    this.gameEngine = new TypingGame('game-canvas');

    this.bindNavigation();
    this.bindModals();
    this.bindThemeAndSound();

    this.renderSubCategories('home');
    this.typingEngine.setMode('position', 'home');
    this.updateUserUI();
  }

  showScene(activeId) {
    ['scene-start', 'scene-countdown', 'app-viewport'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('scene-active');
        el.style.display = 'none';
      }
    });
    const target = document.getElementById(activeId);
    if (target) {
      target.style.display = activeId === 'app-viewport' ? 'flex' : 'flex';
      target.classList.add('scene-active');
    }
  }

  updateUserUI() {
    const user = auth.getCurrentUser();
    const el = document.getElementById('user-display-name');
    if (el) el.textContent = user.name + (user.role === 'admin' ? ' (管理者)' : '');
  }

  renderSubCategories(activeId) {
    const bar = document.getElementById('sub-category-bar');
    if (!bar) return;

    if (this.currentTab !== 'position') {
      bar.style.display = 'none';
      return;
    }
    bar.style.display = 'flex';
    bar.innerHTML = '';

    PRACTICE_DATA.positionCategories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `btn-sub-cat ${cat.id === activeId ? 'active' : ''}`;
      btn.dataset.cat = cat.id;
      btn.textContent = cat.name;
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.btn-sub-cat').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentSubCat = cat.id;
        this.typingEngine.setSubCategory(cat.id);
      });
      bar.appendChild(btn);
    });
  }

  bindNavigation() {
    document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
      item.addEventListener('click', () => this.switchTab(item.dataset.tab));
    });
  }

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.nav-item[data-tab]').forEach(el => {
      el.classList.toggle('active', el.dataset.tab === tab);
    });

    const practiceView = document.getElementById('practice-view');
    const gameView = document.getElementById('game-view');

    this.renderSubCategories('home');

    if (tab === 'game') {
      practiceView.style.display = 'none';
      gameView.style.display = 'flex';
      this.gameEngine.start();
    } else {
      gameView.style.display = 'none';
      practiceView.style.display = 'flex';
      this.gameEngine.stop();
      this.typingEngine.setMode(tab, 'home');
    }
  }

  bindModals() {
    // Report
    document.getElementById('btn-report')?.addEventListener('click', async () => {
      const user = auth.getCurrentUser();
      if (user.role === 'admin') await this.reportView.renderAdminDashboard();
      else await this.reportView.renderStudentReport();
      document.getElementById('report-modal')?.classList.add('show');
    });
    document.getElementById('close-report-modal')?.addEventListener('click', () => {
      document.getElementById('report-modal')?.classList.remove('show');
    });

    // Login
    document.getElementById('btn-login')?.addEventListener('click', () => {
      document.getElementById('login-modal')?.classList.add('show');
    });
    document.getElementById('close-login-modal')?.addEventListener('click', () => {
      document.getElementById('login-modal')?.classList.remove('show');
    });
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('input-student-name')?.value;
      const pin = document.getElementById('input-student-pin')?.value || '0000';
      if (!name?.trim()) return;
      const res = await auth.login(name, pin);
      if (res.success) {
        this.updateUserUI();
        document.getElementById('login-modal')?.classList.remove('show');
        alert(`ようこそ、${res.user.name} さん！`);
      } else {
        alert(res.message || 'ログインに失敗しました。');
      }
    });
  }

  bindThemeAndSound() {
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
      document.body.classList.toggle('theme-pastel');
      const isPastel = document.body.classList.contains('theme-pastel');
      document.getElementById('btn-theme-toggle').textContent = isPastel ? '🌸 パステル' : '🌙 ダーク';
    });
    document.getElementById('btn-sound-toggle')?.addEventListener('click', () => {
      const en = !sound.enabled;
      sound.toggleSound(en);
      document.getElementById('btn-sound-toggle').textContent = en ? '🔊 ON' : '🔇 OFF';
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Show scene 1 only
  ['scene-countdown', 'app-viewport'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const app = new App();
  app.init();
});
