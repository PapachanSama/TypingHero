/**
 * Main Application Orchestrator
 */

import { initScaler } from './scale.js';
import { VirtualKeyboard } from './keyboard.js';
import { TypingEngine } from './typing.js';
import { TypingGame } from './game.js';
import { auth } from './auth.js';
import { ReportView } from './report.js';
import { sound } from './sound.js';

class App {
  constructor() {
    this.keyboard = null;
    this.typingEngine = null;
    this.gameEngine = null;
    this.reportView = null;
    this.currentTab = 'position'; // 'position', 'word1', 'word2', 'bunsetsu', 'short', 'long', 'game'
  }

  async init() {
    // 1. InitializeScaler (1920x1080 auto-fit)
    initScaler();

    // 2. Initialize Auth
    await auth.init();
    this.updateUserUI();

    // 3. Initialize Keyboard & Typing Engine
    this.keyboard = new VirtualKeyboard('virtual-keyboard');
    this.typingEngine = new TypingEngine(this.keyboard);
    this.reportView = new ReportView();
    this.gameEngine = new TypingGame('game-canvas');

    // 4. Bind UI Event Listeners
    this.bindNavigation();
    this.bindModals();
    this.bindThemeAndSound();

    // 5. Start default mode
    this.typingEngine.setMode('position');
  }

  updateUserUI() {
    const user = auth.getCurrentUser();
    const userLabel = document.getElementById('user-display-name');
    if (userLabel) {
      userLabel.textContent = user.name + (user.role === 'admin' ? ' (先生/管理者)' : '');
    }
  }

  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.dataset.tab;
        this.switchTab(tab);
      });
    });
  }

  switchTab(tab) {
    this.currentTab = tab;
    
    // Update active nav button
    document.querySelectorAll('.nav-item[data-tab]').forEach(el => {
      el.classList.toggle('active', el.dataset.tab === tab);
    });

    const practiceView = document.getElementById('practice-view');
    const gameView = document.getElementById('game-view');

    if (tab === 'game') {
      if (practiceView) practiceView.style.display = 'none';
      if (gameView) gameView.style.display = 'flex';
      this.gameEngine.start();
    } else {
      if (gameView) gameView.style.display = 'none';
      if (practiceView) practiceView.style.display = 'flex';
      this.gameEngine.stop();
      this.typingEngine.setMode(tab);
    }
  }

  bindModals() {
    // Report Modal
    const reportBtn = document.getElementById('btn-report');
    const reportModal = document.getElementById('report-modal');
    const closeReportBtn = document.getElementById('close-report-modal');

    if (reportBtn && reportModal) {
      reportBtn.addEventListener('click', async () => {
        const user = auth.getCurrentUser();
        if (user.role === 'admin') {
          await this.reportView.renderAdminDashboard();
        } else {
          await this.reportView.renderStudentReport();
        }
        reportModal.classList.add('show');
      });
    }

    if (closeReportBtn && reportModal) {
      closeReportBtn.addEventListener('click', () => {
        reportModal.classList.remove('show');
      });
    }

    // Login / Student Switch Modal
    const loginBtn = document.getElementById('btn-login');
    const loginModal = document.getElementById('login-modal');
    const closeLoginBtn = document.getElementById('close-login-modal');
    const loginForm = document.getElementById('login-form');

    if (loginBtn && loginModal) {
      loginBtn.addEventListener('click', () => {
        loginModal.classList.add('show');
      });
    }

    if (closeLoginBtn && loginModal) {
      closeLoginBtn.addEventListener('click', () => {
        loginModal.classList.remove('show');
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('input-student-name');
        const pinInput = document.getElementById('input-student-pin');

        if (!nameInput || !nameInput.value.trim()) return;

        const res = await auth.login(nameInput.value, pinInput ? pinInput.value : '0000');
        if (res.success) {
          this.updateUserUI();
          loginModal.classList.remove('show');
          alert(`ようこそ、${res.user.name} さん！`);
        } else {
          alert(res.message || 'ログインに失敗しました。');
        }
      });
    }
  }

  bindThemeAndSound() {
    // Theme Toggle (Pastel <-> Dark Cyber)
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('theme-pastel');
        const isPastel = document.body.classList.contains('theme-pastel');
        themeBtn.textContent = isPastel ? '🌸 パステル' : '🌙 ダーク';
      });
    }

    // Sound Toggle
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const enabled = !sound.enabled;
        sound.toggleSound(enabled);
        soundBtn.textContent = enabled ? '🔊 サウンドON' : '🔇 サウンドOFF';
      });
    }
  }
}

// Start app on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
