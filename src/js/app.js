/**
 * App.js — Scene orchestrator:
 *   Scene 1 (Title) → Scene 2 (Category) → Scene 3 (Countdown 3-2-1) → Scene 4 (Main App)
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
  position: 'A. ポジション練習',
  word1:    'B. 単語練習１',
  word2:    'C. 単語練習２',
  bunsetsu: 'D. 文節練習',
  short:    'E. 短文練習',
  long:     'F. 長文練習',
  game:     'G. タイピングゲーム'
};

class App {
  constructor() {
    this.keyboard       = null;
    this.typingEngine   = null;
    this.gameEngine     = null;
    this.reportView     = null;
    this.currentTab     = 'position';
    this.appInitialized = false;
  }

  async init() {
    await auth.init();
    this.initScenes();
  }

  /* =====================================================================
     SCENE MANAGEMENT
     ===================================================================== */
  initScenes() {
    /* Scene 1 → 2 : Start button */
    document.getElementById('btn-start-title')?.addEventListener('click', () => {
      this.showScene('scene-category');
    });

    /* Scene 2 → 3 : Category card click */
    document.querySelectorAll('.cat-card[data-mode]').forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.dataset.mode;
        this.currentTab = mode;
        this.startCountdown(mode);
      });
    });

    /* Scene 2 → 1 : Back button */
    document.getElementById('btn-back-to-title')?.addEventListener('click', () => {
      this.showScene('scene-title');
    });

    /* In-app nav to category screen */
    document.getElementById('btn-to-category')?.addEventListener('click', () => {
      this.showScene('scene-category');
    });

    /* Global Space Listener for Countdown trigger */
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        if (this.isWaitingForSpaceInCountdown) {
          e.preventDefault();
          this.runActiveCountdown();
        }
      }
    });
  }

  showScene(sceneId) {
    ['scene-title', 'scene-category', 'scene-countdown', 'app-viewport'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('scene-active'); el.style.display = 'none'; }
    });
    const target = document.getElementById(sceneId);
    if (target) { target.style.display = 'flex'; target.classList.add('scene-active'); }
  }

  startCountdown(mode, subCategoryId = null) {
    this.showScene('scene-countdown');
    const readyBox = document.getElementById('countdown-ready-box');
    const activeBox = document.getElementById('countdown-active-box');
    if (readyBox) readyBox.style.display = 'flex';
    if (activeBox) activeBox.style.display = 'none';

    this.isWaitingForSpaceInCountdown = true;
    this.countdownMode = mode;
    this.countdownSubCat = subCategoryId;
  }

  runActiveCountdown() {
    this.isWaitingForSpaceInCountdown = false;
    const readyBox = document.getElementById('countdown-ready-box');
    const activeBox = document.getElementById('countdown-active-box');
    if (readyBox) readyBox.style.display = 'none';
    if (activeBox) activeBox.style.display = 'flex';

    let count = 3;
    const numEl = document.getElementById('countdown-number');
    if (numEl) numEl.textContent = count;
    sound.playKeySound?.();

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        if (numEl) numEl.textContent = count;
        sound.playKeySound?.();
      } else if (count === 0) {
        if (numEl) numEl.textContent = 'スタート！';
        sound.playSuccessSound?.();
      } else {
        clearInterval(timer);
        this.launchApp(this.countdownMode, this.countdownSubCat);
      }
    }, 800);
  }

  launchApp(mode, subCategoryId = null) {
    this.showScene('app-viewport');

    if (!this.appInitialized) {
      this.appInitialized = true;
      initScaler();
      this.keyboard     = new VirtualKeyboard('virtual-keyboard');
      this.typingEngine = new TypingEngine(this.keyboard, this); // pass app instance to typingEngine for trigger control
      this.reportView   = new ReportView();
      this.gameEngine   = new TypingGame('game-canvas');
      this.bindInAppNav();
      this.bindModals();
      this.bindThemeAndSound();
    }

    this.switchTab(mode, subCategoryId);
    this.updateUserUI();
  }

  /* =====================================================================
     IN-APP NAV
     ===================================================================== */
  bindInAppNav() {
    document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
      item.addEventListener('click', () => this.switchTab(item.dataset.tab));
    });
  }

  switchTab(tab, subCategoryId = null) {
    this.currentTab = tab;
    document.querySelectorAll('.nav-item[data-tab]').forEach(el => {
      el.classList.toggle('active', el.dataset.tab === tab);
    });

    const practiceView = document.getElementById('practice-view');
    const gameView     = document.getElementById('game-view');

    const defaultSub = subCategoryId || (tab === 'position' ? 'home' : (tab === 'word1' ? 'a-gyo' : null));
    this.renderSubCategories(defaultSub);

    if (tab === 'game') {
      practiceView.style.display = 'none';
      gameView.style.display     = 'flex';
      this.gameEngine?.start();
    } else {
      gameView.style.display     = 'none';
      practiceView.style.display = 'flex';
      this.gameEngine?.stop();
      this.typingEngine?.setMode(tab, defaultSub);
    }
  }

  renderSubCategories(activeId) {
    const bar = document.getElementById('sub-category-bar');
    if (!bar) return;

    if (this.currentTab !== 'position' && this.currentTab !== 'word1') {
      bar.style.display = 'none';
      return;
    }
    bar.style.display = 'flex';
    bar.innerHTML = '';

    if (this.currentTab === 'position') {
      PRACTICE_DATA.positionCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `btn-sub-cat ${cat.id === activeId ? 'active' : ''}`;
        btn.dataset.cat = cat.id;
        btn.textContent = cat.name;
        btn.addEventListener('click', () => {
          bar.querySelectorAll('.btn-sub-cat').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.startCountdown('position', cat.id);
        });
        bar.appendChild(btn);
      });
    } else if (this.currentTab === 'word1') {
      PRACTICE_DATA.word1Categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `btn-sub-cat ${cat.id === activeId ? 'active' : ''}`;
        btn.dataset.cat = cat.id;
        btn.textContent = cat.name;
        btn.addEventListener('click', () => {
          bar.querySelectorAll('.btn-sub-cat').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.startCountdown('word1', cat.id);
        });
        bar.appendChild(btn);
      });
    }
  }

  updateUserUI() {
    const user = auth.getCurrentUser();
    const el = document.getElementById('user-display-name');
    if (el) el.textContent = user.name + (user.role === 'admin' ? ' (管理者)' : '');
  }

  /* =====================================================================
     MODALS / THEME
     ===================================================================== */
  bindModals() {
    document.getElementById('btn-report')?.addEventListener('click', async () => {
      const user = auth.getCurrentUser();
      if (user.role === 'admin') await this.reportView.renderAdminDashboard();
      else await this.reportView.renderStudentReport();
      document.getElementById('report-modal')?.classList.add('show');
    });
    document.getElementById('close-report-modal')?.addEventListener('click', () =>
      document.getElementById('report-modal')?.classList.remove('show'));

    document.getElementById('btn-login')?.addEventListener('click', () =>
      document.getElementById('login-modal')?.classList.add('show'));
    document.getElementById('close-login-modal')?.addEventListener('click', () =>
      document.getElementById('login-modal')?.classList.remove('show'));

    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('input-student-name')?.value;
      const pin  = document.getElementById('input-student-pin')?.value || '0000';
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
      sound.toggleSound?.(en);
      document.getElementById('btn-sound-toggle').textContent = en ? '🔊 ON' : '🔇 OFF';
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  /* Show only title scene on load */
  ['scene-category', 'scene-countdown', 'app-viewport'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const app = new App();
  app.init();
});
