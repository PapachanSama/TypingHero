/**
 * Core Typing Engine - setMode only loads text; Space key no longer handled here.
 */

import { PRACTICE_DATA } from './data_jp.js';
import { parseKanaToRomajiTokens } from './romaji.js';
import { sound } from './sound.js';
import { recordPracticeScore } from './firebase.js';
import { auth } from './auth.js';

export class TypingEngine {
  constructor(keyboardInstance) {
    this.keyboard = keyboardInstance;
    this.currentMode = 'position';
    this.selectedSubCategoryId = 'home';
    this.itemIndex = 0;
    this.passageIndex = 0;

    this.tokens = [];
    this.tokenIndex = 0;
    this.typedRomajiInToken = '';

    this.startTime = null;
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.errorCount = 0;
    this.timerInterval = null;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  setMode(mode, subCategoryId = null) {
    this.currentMode = mode;
    if (subCategoryId) this.selectedSubCategoryId = subCategoryId;
    this.itemIndex = 0;
    this.passageIndex = 0;
    this.resetSession();
    this.loadCurrentItem();
  }

  setSubCategory(subCategoryId) {
    this.selectedSubCategoryId = subCategoryId;
    this.itemIndex = 0;
    this.resetSession();
    this.loadCurrentItem();
  }

  resetSession() {
    clearInterval(this.timerInterval);
    this.startTime = null;
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.errorCount = 0;
    this.tokenIndex = 0;
    this.typedRomajiInToken = '';
    this.updateStatsUI();
  }

  loadCurrentItem() {
    let item = null;

    if (this.currentMode === 'position') {
      const catObj = PRACTICE_DATA.positionCategories.find(c => c.id === this.selectedSubCategoryId) || PRACTICE_DATA.positionCategories[0];
      item = catObj.lessons[this.itemIndex % catObj.lessons.length];
    } else if (this.currentMode === 'long') {
      const longItem = PRACTICE_DATA.long[this.itemIndex % PRACTICE_DATA.long.length];
      const passage = longItem.passages[this.passageIndex % longItem.passages.length];
      this.tokens = parseKanaToRomajiTokens(passage.kana);
      this.tokenIndex = 0;
      this.typedRomajiInToken = '';
      this.renderTextDisplay(passage.kana, passage.kanji, `${longItem.title} (${this.passageIndex + 1}/${longItem.passages.length})`);
      this.highlightKeyboardNextKey();
      return;
    } else {
      const list = PRACTICE_DATA[this.currentMode] || [];
      item = list[this.itemIndex % (list.length || 1)];
    }

    if (!item) return;
    this.tokens = parseKanaToRomajiTokens(item.kana);
    this.tokenIndex = 0;
    this.typedRomajiInToken = '';
    this.renderTextDisplay(item.kana, item.kanji || item.display || item.kana, item.title || '');
    this.highlightKeyboardNextKey();
  }

  renderTextDisplay(kanaText, kanjiText, titleText = '') {
    const titleEl = document.getElementById('typing-title');
    if (titleEl) titleEl.textContent = titleText;

    const kanaEl = document.getElementById('typing-row-kana');
    if (kanaEl) {
      kanaEl.textContent = kanaText;
    }

    const kanjiEl = document.getElementById('typing-row-kanji');
    if (kanjiEl) {
      kanjiEl.textContent = kanjiText;
    }

    this.updateRomajiGuideDisplay();
  }

  updateRomajiGuideDisplay() {
    const el = document.getElementById('typing-row-romaji');
    if (!el) return;
    let html = '';
    this.tokens.forEach((t, idx) => {
      const defaultRomajiUpper = t.defaultRomaji.toUpperCase();
      if (idx < this.tokenIndex) {
        html += `<span class="token token-done">${defaultRomajiUpper}</span>`;
      } else if (idx === this.tokenIndex) {
        const typedUpper = this.typedRomajiInToken.toUpperCase();
        const remainingUpper = t.defaultRomaji.slice(this.typedRomajiInToken.length).toUpperCase();
        html += `<span class="token token-active"><span class="typed">${typedUpper}</span>${remainingUpper}</span>`;
      } else {
        html += `<span class="token">${defaultRomajiUpper}</span>`;
      }
    });
    el.innerHTML = html;
  }

  highlightKeyboardNextKey() {
    if (!this.keyboard) return;
    if (this.tokenIndex >= this.tokens.length) {
      this.keyboard.setNextTargetKey(null);
      return;
    }
    const t = this.tokens[this.tokenIndex];
    const nextChar = t.defaultRomaji[this.typedRomajiInToken.length];
    this.keyboard.setNextTargetKey(nextChar);
  }

  handleKeyDown(e) {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key.length !== 1 || !/[a-zA-Z\-\s,.]/i.test(e.key)) return;

    if (!this.startTime) {
      this.startTime = Date.now();
      this.timerInterval = setInterval(() => this.updateStatsUI(), 200);
    }

    const pressedKey = e.key.toLowerCase();
    this.totalKeystrokes++;

    if (this.tokenIndex >= this.tokens.length) return;

    const currentToken = this.tokens[this.tokenIndex];
    const offset = this.typedRomajiInToken.length;
    let isCorrect = false;
    let matchedCand = null;

    for (const cand of currentToken.romajiCandidates) {
      if (cand[offset] === pressedKey && cand.startsWith(this.typedRomajiInToken + pressedKey)) {
        isCorrect = true;
        matchedCand = cand;
        break;
      }
    }

    if (isCorrect) {
      sound.playKeySound();
      this.correctKeystrokes++;
      this.typedRomajiInToken += pressedKey;

      if (currentToken.romajiCandidates.includes(this.typedRomajiInToken)
          || this.typedRomajiInToken.length >= (matchedCand?.length || 1)) {
        this.tokenIndex++;
        this.typedRomajiInToken = '';
      }

      if (this.tokenIndex >= this.tokens.length) {
        this.onItemCompleted();
      }
    } else {
      sound.playErrorSound();
      this.errorCount++;
    }

    this.updateRomajiGuideDisplay();
    this.highlightKeyboardNextKey();
    this.updateStatsUI();
  }

  async onItemCompleted() {
    sound.playSuccessSound();

    const timeSec = Math.max(1, (Date.now() - this.startTime) / 1000);
    const kpm = Math.round((this.correctKeystrokes / timeSec) * 60);
    const accuracy = Math.round((this.correctKeystrokes / (this.totalKeystrokes || 1)) * 100);
    const user = auth.getCurrentUser();

    const modeNames = {
      position: '各ポジション練習', word1: '単語練習1', word2: '単語練習2',
      bunsetsu: '文節練習', short: '短文練習', long: '長文練習'
    };

    await recordPracticeScore({
      studentId: user.id, studentName: user.name,
      modeName: modeNames[this.currentMode] || '練習',
      kpm, accuracy, timeSec: Math.round(timeSec)
    });

    setTimeout(() => {
      if (this.currentMode === 'long') {
        const longItem = PRACTICE_DATA.long[this.itemIndex % PRACTICE_DATA.long.length];
        this.passageIndex++;
        if (this.passageIndex >= longItem.passages.length) {
          this.passageIndex = 0;
          this.itemIndex++;
        }
      } else {
        this.itemIndex++;
      }
      this.resetSession();
      this.loadCurrentItem();
    }, 400);
  }

  updateStatsUI() {
    const timeSec = this.startTime ? (Date.now() - this.startTime) / 1000 : 0;
    const kpm = timeSec > 0 ? Math.round((this.correctKeystrokes / timeSec) * 60) : 0;
    const acc = this.totalKeystrokes > 0
      ? Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100) : 100;

    const k = document.getElementById('stat-kpm');
    const a = document.getElementById('stat-acc');
    const t = document.getElementById('stat-time');
    if (k) k.textContent = kpm;
    if (a) a.textContent = `${acc}%`;
    if (t) t.textContent = `${Math.round(timeSec)}s`;
  }
}
