/**
 * Core Typing Engine for the 6 Japanese Practice Modes
 */

import { PRACTICE_DATA } from './data_jp.js';
import { parseKanaToRomajiTokens } from './romaji.js';
import { sound } from './sound.js';
import { recordPracticeScore } from './firebase.js';
import { auth } from './auth.js';

export class TypingEngine {
  constructor(keyboardInstance) {
    this.keyboard = keyboardInstance;
    this.currentMode = 'position'; // 'position', 'word1', 'word2', 'bunsetsu', 'short', 'long'
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

  setMode(mode) {
    this.currentMode = mode;
    this.itemIndex = 0;
    this.passageIndex = 0;
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
    const list = PRACTICE_DATA[this.currentMode];
    if (!list || list.length === 0) return;

    let item = list[this.itemIndex % list.length];
    
    // Special handling for Mode 6 (長文練習 - Long passages)
    let kanaText = item.kana;
    let displayText = item.display || item.kanji;
    let titleText = item.title || '';

    if (this.currentMode === 'long') {
      const passageObj = item.passages[this.passageIndex % item.passages.length];
      kanaText = passageObj.kana;
      displayText = passageObj.kanji;
      titleText = `${item.title} (${this.passageIndex + 1}/${item.passages.length})`;
    }

    this.tokens = parseKanaToRomajiTokens(kanaText);
    this.tokenIndex = 0;
    this.typedRomajiInToken = '';

    this.renderTextDisplay(displayText, titleText);
    this.highlightKeyboardNextKey();
  }

  renderTextDisplay(displayText, titleText = '') {
    const displayContainer = document.getElementById('typing-display');
    const titleEl = document.getElementById('typing-title');
    const romajiGuideEl = document.getElementById('romaji-guide');

    if (titleEl) titleEl.textContent = titleText;

    if (displayContainer) {
      displayContainer.innerHTML = '';

      // Kanji / Japanese Primary Display
      const mainTextDiv = document.createElement('div');
      mainTextDiv.className = 'primary-text';
      mainTextDiv.textContent = displayText;
      displayContainer.appendChild(mainTextDiv);
    }

    this.updateRomajiGuideDisplay();
  }

  updateRomajiGuideDisplay() {
    const romajiGuideEl = document.getElementById('romaji-guide');
    if (!romajiGuideEl) return;

    let html = '';
    this.tokens.forEach((t, idx) => {
      const isCurrent = idx === this.tokenIndex;
      const isTyped = idx < this.tokenIndex;
      
      let tokenRomaji = t.defaultRomaji;
      
      if (isCurrent) {
        html += `<span class="token token-active"><u class="typed">${this.typedRomajiInToken}</u>${tokenRomaji.slice(this.typedRomajiInToken.length)}</span>`;
      } else if (isTyped) {
        html += `<span class="token token-done">${tokenRomaji}</span>`;
      } else {
        html += `<span class="token">${tokenRomaji}</span>`;
      }
    });

    romajiGuideEl.innerHTML = html;
  }

  highlightKeyboardNextKey() {
    if (!this.keyboard) return;
    if (this.tokenIndex >= this.tokens.length) {
      this.keyboard.setNextTargetKey(null);
      return;
    }

    const currentToken = this.tokens[this.tokenIndex];
    const candidateRomaji = currentToken.defaultRomaji;
    const nextChar = candidateRomaji[this.typedRomajiInToken.length];
    
    this.keyboard.setNextTargetKey(nextChar);
  }

  handleKeyDown(e) {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key.length !== 1 || !/[a-zA-Z\-\s,.]/i.test(e.key)) return;

    // Start timer on first keypress
    if (!this.startTime) {
      this.startTime = Date.now();
      this.timerInterval = setInterval(() => this.updateStatsUI(), 200);
    }

    const pressedKey = e.key.toLowerCase();
    this.totalKeystrokes++;

    if (this.tokenIndex >= this.tokens.length) return;

    const currentToken = this.tokens[this.tokenIndex];
    const validCandidates = currentToken.romajiCandidates;

    // Check if pressed key matches any valid Romaji candidate at the current offset
    const currentOffset = this.typedRomajiInToken.length;
    let isCorrect = false;
    let matchedRomajiCandidate = null;

    for (let cand of validCandidates) {
      if (cand[currentOffset] === pressedKey && cand.startsWith(this.typedRomajiInToken + pressedKey)) {
        isCorrect = true;
        matchedRomajiCandidate = cand;
        break;
      }
    }

    if (isCorrect) {
      sound.playKeySound();
      this.correctKeystrokes++;
      this.typedRomajiInToken += pressedKey;

      // Check if current token completed
      const fullMatch = validCandidates.find(c => c === this.typedRomajiInToken);
      if (fullMatch || this.typedRomajiInToken.length >= (matchedRomajiCandidate ? matchedRomajiCandidate.length : 1)) {
        this.tokenIndex++;
        this.typedRomajiInToken = '';
      }

      // Check if entire sentence/item completed
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

    // Record score
    const user = auth.getCurrentUser();
    const modeNames = {
      position: '各ポジション練習',
      word1: '単語練習1 (あいうえお順)',
      word2: '単語練習2',
      bunsetsu: '文節練習',
      short: '短文練習',
      long: '長文練習'
    };

    await recordPracticeScore({
      studentId: user.id,
      studentName: user.name,
      modeName: modeNames[this.currentMode] || 'タイピング練習',
      kpm: kpm,
      accuracy: accuracy,
      timeSec: Math.round(timeSec)
    });

    // Advance to next item
    setTimeout(() => {
      if (this.currentMode === 'long') {
        const item = PRACTICE_DATA.long[this.itemIndex % PRACTICE_DATA.long.length];
        this.passageIndex++;
        if (this.passageIndex >= item.passages.length) {
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
    const kpmEl = document.getElementById('stat-kpm');
    const accEl = document.getElementById('stat-acc');
    const timeEl = document.getElementById('stat-time');

    let timeSec = 0;
    if (this.startTime) {
      timeSec = (Date.now() - this.startTime) / 1000;
    }

    const kpm = timeSec > 0 ? Math.round((this.correctKeystrokes / timeSec) * 60) : 0;
    const accuracy = this.totalKeystrokes > 0 ? Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100) : 100;

    if (kpmEl) kpmEl.textContent = kpm;
    if (accEl) accEl.textContent = `${accuracy}%`;
    if (timeEl) timeEl.textContent = `${Math.round(timeSec)}s`;
  }
}
