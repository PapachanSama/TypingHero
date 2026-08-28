/**
 * Core Typing Engine - setMode only loads text.
 * Support for Word 1 special Notepad Dual-Column layout,
 * level-based Long text loaders from external files,
 * and space countdown redirect for consecutive lessons.
 */

import { PRACTICE_DATA } from './data_jp.js';
import { parseKanaToRomajiTokens } from './romaji.js';
import { sound } from './sound.js';
import { recordPracticeScore } from './firebase.js';
import { auth } from './auth.js';

export class TypingEngine {
  constructor(keyboardInstance, appInstance = null) {
    this.keyboard = keyboardInstance;
    this.appInstance = appInstance;
    this.currentMode = 'position';
    this.selectedSubCategoryId = 'home';
    this.selectedLessonId = null; // Used for Level-based long texts
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

    // Word 1 Notepad Special variables
    this.notepadWords = [];
    this.notepadCurrentWordIndex = 0;
    this.errorInNotepad = false;
    this.lastErrorChar = '';

    // Long Passage parsed variables
    this.loadedPassages = [];
    this.loadedTitle = '';

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  setMode(mode, subCategoryId = null, lessonId = null) {
    this.currentMode = mode;
    if (subCategoryId) this.selectedSubCategoryId = subCategoryId;
    this.selectedLessonId = lessonId;
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
    this.errorInNotepad = false;
    this.lastErrorChar = '';
    this.updateStatsUI();
  }

  loadCurrentItem() {
    let item = null;

    // Specialize loading for Word 1 mode
    if (this.currentMode === 'word1') {
      const catObj = PRACTICE_DATA.word1Categories.find(c => c.id === this.selectedSubCategoryId) || PRACTICE_DATA.word1Categories[0];
      item = catObj.lessons[this.itemIndex % catObj.lessons.length];
      
      if (!item) return;
      
      const titleEl = document.getElementById('typing-title');
      if (titleEl) titleEl.textContent = `${catObj.name} - ${item.title}`;

      this.notepadWords = item.words;
      this.notepadCurrentWordIndex = 0;

      // Initialize tokens for the first word
      const currentWord = this.notepadWords[0];
      this.tokens = parseKanaToRomajiTokens(currentWord);
      this.tokenIndex = 0;
      this.typedRomajiInToken = '';

      // Toggle Notepad layouts
      const stdCard = document.getElementById('standard-display-card');
      const noteCard = document.getElementById('word1-notepad-card');
      if (stdCard) stdCard.style.display = 'none';
      if (noteCard) noteCard.style.display = 'flex';

      this.renderNotepadDisplay();
      this.highlightKeyboardNextKey();
      return;
    }

    // Normal modes layout loading
    const stdCard = document.getElementById('standard-display-card');
    const noteCard = document.getElementById('word1-notepad-card');
    if (stdCard) stdCard.style.display = 'flex';
    if (noteCard) noteCard.style.display = 'none';

    if (this.currentMode === 'position') {
      const catObj = PRACTICE_DATA.positionCategories.find(c => c.id === this.selectedSubCategoryId) || PRACTICE_DATA.positionCategories[0];
      item = catObj.lessons[this.itemIndex % catObj.lessons.length];
    } else if (this.currentMode === 'long') {
      // Level-Based Long Text Loader
      const catObj = PRACTICE_DATA.longCategories.find(c => c.id === this.selectedSubCategoryId) || PRACTICE_DATA.longCategories[0];
      let lesson = catObj.lessons.find(l => l.id === this.selectedLessonId);
      if (!lesson && catObj.lessons.length > 0) {
        lesson = catObj.lessons[0];
        this.selectedLessonId = lesson.id;
      }

      if (lesson) {
        this.loadLongTextFromFile(lesson.file, lesson.title);
      }
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

  /* Async file loader & parser for external long text database (.txt files) */
  async loadLongTextFromFile(filePath, lessonTitle) {
    try {
      const titleEl = document.getElementById('typing-title');
      if (titleEl) titleEl.textContent = `${lessonTitle} (読み込み中...)`;

      const response = await fetch(filePath);
      if (!response.ok) throw new Error("장문 텍스트 로딩 실패: " + response.statusText);
      const text = await response.text();
      this.parseLongText(text, lessonTitle);
    } catch (error) {
      console.error(error);
      this.renderTextDisplay(
        "しょしんしゃ れんしゅう",
        "장문 텍스트 파일을 로드할 수 없습니다. 경로를 확인해주세요.",
        lessonTitle
      );
    }
  }

  parseLongText(rawText, lessonTitle) {
    // Split lines and normalize
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l !== '');
    
    let parsedTitle = lessonTitle;
    const passages = [];
    
    let readingTitle = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('[TITLE]')) {
        readingTitle = true;
        continue;
      }
      if (readingTitle) {
        parsedTitle = line;
        readingTitle = false;
        continue;
      }
      if (line.startsWith('[PASSAGE]')) {
        if (i + 2 < lines.length) {
          const kanjiText = lines[i + 1];
          const kanaText = lines[i + 2];
          passages.push({ kanji: kanjiText, kana: kanaText });
          i += 2;
        }
      }
    }

    this.loadedPassages = passages;
    this.loadedTitle = parsedTitle;
    
    // Load the active paragraph
    this.loadLongPassage();
  }

  loadLongPassage() {
    if (!this.loadedPassages || this.loadedPassages.length === 0) {
      this.renderTextDisplay("데이터 없음", "파싱된 장문 데이터가 없습니다.", this.loadedTitle);
      return;
    }

    const passage = this.loadedPassages[this.passageIndex % this.loadedPassages.length];
    this.tokens = parseKanaToRomajiTokens(passage.kana);
    this.tokenIndex = 0;
    this.typedRomajiInToken = '';

    this.renderTextDisplay(
      passage.kana,
      passage.kanji,
      `${this.loadedTitle} (${this.passageIndex + 1}/${this.loadedPassages.length})`
    );
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

  renderNotepadDisplay() {
    const sampleList = document.getElementById('notepad-sample-list');
    const userContent = document.getElementById('notepad-user-content');
    if (!sampleList || !userContent) return;

    // Render Left panel: sample hiragana list
    sampleList.innerHTML = '';
    this.notepadWords.forEach((word, idx) => {
      const item = document.createElement('div');
      item.className = 'notepad-item';
      if (idx < this.notepadCurrentWordIndex) {
        item.classList.add('completed');
      } else if (idx === this.notepadCurrentWordIndex) {
        item.classList.add('active');
      }
      item.textContent = word;
      sampleList.appendChild(item);
    });

    // Render Right panel: user inputs
    userContent.innerHTML = '';
    for (let i = 0; i < this.notepadCurrentWordIndex; i++) {
      const div = document.createElement('div');
      div.className = 'notepad-item completed';
      div.textContent = this.notepadWords[i];
      userContent.appendChild(div);
    }

    // Active typed word rendering with red typo support
    if (this.notepadCurrentWordIndex < this.notepadWords.length) {
      const activeDiv = document.createElement('div');
      activeDiv.className = 'notepad-item active';

      let correctHiragana = '';
      this.tokens.forEach((t, idx) => {
        if (idx < this.tokenIndex) {
          correctHiragana += t.kana;
        }
      });

      const correctSpan = document.createElement('span');
      correctSpan.className = 'correct-char';
      correctSpan.textContent = correctHiragana;
      activeDiv.appendChild(correctSpan);

      if (this.errorInNotepad) {
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-char';
        errorSpan.textContent = (this.lastErrorChar || '').toUpperCase();
        activeDiv.appendChild(errorSpan);
      }

      userContent.appendChild(activeDiv);
    }
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
    if (this.appInstance && this.appInstance.isWaitingForSpaceInCountdown) return;
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
      
      // Clear typo on notepad
      this.errorInNotepad = false;

      if (currentToken.romajiCandidates.includes(this.typedRomajiInToken)
          || this.typedRomajiInToken.length >= (matchedCand?.length || 1)) {
        this.tokenIndex++;
        this.typedRomajiInToken = '';
      }

      // Check if current item/word completed
      if (this.tokenIndex >= this.tokens.length) {
        if (this.currentMode === 'word1') {
          sound.playSuccessSound();
          this.notepadCurrentWordIndex++;
          if (this.notepadCurrentWordIndex < this.notepadWords.length) {
            // Load next word in list
            const nextWord = this.notepadWords[this.notepadCurrentWordIndex];
            this.tokens = parseKanaToRomajiTokens(nextWord);
            this.tokenIndex = 0;
            this.typedRomajiInToken = '';
          } else {
            this.onItemCompleted();
          }
        } else {
          this.onItemCompleted();
        }
      }
    } else {
      sound.playErrorSound();
      this.errorCount++;
      
      if (this.currentMode === 'word1') {
        this.errorInNotepad = true;
        this.lastErrorChar = pressedKey;
      }
    }

    if (this.currentMode === 'word1') {
      this.renderNotepadDisplay();
    } else {
      this.updateRomajiGuideDisplay();
    }
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
      let nextLessonId = this.selectedLessonId;

      if (this.currentMode === 'long') {
        this.passageIndex++;
        if (this.passageIndex >= (this.loadedPassages?.length || 1)) {
          this.passageIndex = 0;
          
          // Switch to next lesson in the same category automatically
          const catObj = PRACTICE_DATA.longCategories.find(c => c.id === this.selectedSubCategoryId);
          if (catObj && catObj.lessons.length > 0) {
            const currentIndex = catObj.lessons.findIndex(l => l.id === this.selectedLessonId);
            const nextIndex = (currentIndex + 1) % catObj.lessons.length;
            this.selectedLessonId = catObj.lessons[nextIndex].id;
            nextLessonId = this.selectedLessonId;
          }
        }
      } else {
        this.itemIndex++;
      }
      
      this.resetSession();
      // Redirect back to Space-Key prompt countdown on the next consecutive item
      if (this.appInstance) {
        this.appInstance.startCountdown(this.currentMode, this.selectedSubCategoryId, nextLessonId);
      } else {
        this.loadCurrentItem();
      }
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
