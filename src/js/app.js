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
import { PRACTICE_DATA } from './data_jp.js';

class App {
  constructor() {
    this.keyboard = null;
    this.typingEngine = null;
    this.gameEngine = null;
    this.reportView = null;
    this.currentTab = 'position';
  }

  async init() {
    initScaler();
    await auth.init();
    this.updateUserUI();

    this.keyboard = new VirtualKeyboard('virtual-keyboard');
    this.typingEngine = new TypingEngine(this.keyboard);
    this.reportView = new ReportView();
    this.gameEngine = new TypingGame('game-canvas');

    this.bindNavigation();
    this.bindSubCategoryNavigation();
    this.bindModals();
    this.bindThemeAndSound();

    this.renderSubCategories('home');
    this.typingEngine.setMode('position', 'home');
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

  renderSubCategories(activeId = 'home') {
    const container = document.getElementById('sub-category-bar');
    if (!container) return;

    if (this.currentTab !== 'position') {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'flex';
    container.innerHTML = '';

    PRACTICE_DATA.positionCategories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `btn-sub-cat ${cat.id === activeId ? 'active' : ''}`;
      btn.dataset.cat = cat.id;
      btn.textContent = cat.name;
      btn.addEventListener('click', () => {
        container.querySelectorAll('.btn-sub-cat').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.typingEngine.setSubCategory(cat.id);
      });
      container.appendChild(btn);
    });
  }

  bindSubCategoryNavigation() {
    // Handled in renderSubCategories
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
      if (practiceView) practiceView.style.display = 'none';
      if (gameView) gameView.style.display = 'flex';
      this.gameEngine.start();
    } else {
      if (gameView) gameView.style.display = 'none';
      if (practiceView) practiceView.style.display = 'flex';
      this.gameEngine.stop();
      this.typingEngine.setMode(tab, 'home');
    }
  }

  bindModals() {
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
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('theme-pastel');
        const isPastel = document.body.classList.contains('theme-pastel');
        themeBtn.textContent = isPastel ? '🌸 パステル' : '🌙 ダーク';
      });
    }

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

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
