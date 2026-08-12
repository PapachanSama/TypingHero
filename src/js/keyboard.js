/**
 * Interactive On-Screen Keyboard Component & Playgram-Style Line-Art Hands Visualizer
 */

const KEYBOARD_LAYOUT = [
  [
    { key: 'q', label: 'Q', finger: 'left-pinky' },
    { key: 'w', label: 'W', finger: 'left-ring' },
    { key: 'e', label: 'E', finger: 'left-middle' },
    { key: 'r', label: 'R', finger: 'left-index' },
    { key: 't', label: 'T', finger: 'left-index' },
    { key: 'y', label: 'Y', finger: 'right-index' },
    { key: 'u', label: 'U', finger: 'right-index' },
    { key: 'i', label: 'I', finger: 'right-middle' },
    { key: 'o', label: 'O', finger: 'right-ring' },
    { key: 'p', label: 'P', finger: 'right-pinky' },
    { key: '-', label: '-', finger: 'right-pinky' }
  ],
  [
    { key: 'a', label: 'A', finger: 'left-pinky' },
    { key: 's', label: 'S', finger: 'left-ring' },
    { key: 'd', label: 'D', finger: 'left-middle' },
    { key: 'f', label: 'F', finger: 'left-index' },
    { key: 'g', label: 'G', finger: 'left-index' },
    { key: 'h', label: 'H', finger: 'right-index' },
    { key: 'j', label: 'J', finger: 'right-index' },
    { key: 'k', label: 'K', finger: 'right-middle' },
    { key: 'l', label: 'L', finger: 'right-ring' },
    { key: ';', label: ';', finger: 'right-pinky' }
  ],
  [
    { key: 'z', label: 'Z', finger: 'left-pinky' },
    { key: 'x', label: 'X', finger: 'left-ring' },
    { key: 'c', label: 'C', finger: 'left-middle' },
    { key: 'v', label: 'V', finger: 'left-index' },
    { key: 'b', label: 'B', finger: 'left-index' },
    { key: 'n', label: 'N', finger: 'right-index' },
    { key: 'm', label: 'M', finger: 'right-index' },
    { key: ',', label: ',', finger: 'right-middle' },
    { key: '.', label: '.', finger: 'right-ring' }
  ],
  [
    { key: ' ', label: 'SPACE', finger: 'thumb', wide: true }
  ]
];

export class VirtualKeyboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeTargetKey = null;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'keyboard-hands-wrapper';

    // 1. Keyboard Grid
    const kbGrid = document.createElement('div');
    kbGrid.className = 'keyboard-grid';

    KEYBOARD_LAYOUT.forEach((row) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'keyboard-row';

      row.forEach((k) => {
        const keyBtn = document.createElement('div');
        keyBtn.className = `key-cap finger-${k.finger} ${k.wide ? 'key-wide' : ''}`;
        keyBtn.dataset.key = k.key.toLowerCase();
        keyBtn.dataset.finger = k.finger;
        keyBtn.innerHTML = `<span>${k.label}</span>`;
        rowDiv.appendChild(keyBtn);
      });

      kbGrid.appendChild(rowDiv);
    });

    // 2. Playgram-style SVG Hands Overlay
    const handsSvgOverlay = document.createElement('div');
    handsSvgOverlay.className = 'playgram-hands-overlay';
    handsSvgOverlay.innerHTML = this.renderPlaygramHandsSVG();

    wrapper.appendChild(kbGrid);
    wrapper.appendChild(handsSvgOverlay);
    this.container.appendChild(wrapper);

    this.bindEvents();
  }

  renderPlaygramHandsSVG() {
    return `
      <svg class="hands-svg" viewBox="0 0 1000 450" preserveAspectRatio="xMidYMid meet">
        <!-- Left Hand Outline -->
        <g class="hand-group hand-left-group">
          <!-- Left Pinky -->
          <path class="finger-path finger-left-pinky" data-finger="left-pinky"
            d="M 220 380 Q 230 200 280 130 Q 300 130 300 160 Q 270 230 250 380 Z" />
          <!-- Left Ring -->
          <path class="finger-path finger-left-ring" data-finger="left-ring"
            d="M 270 380 Q 310 160 340 100 Q 365 100 365 130 Q 330 200 305 380 Z" />
          <!-- Left Middle -->
          <path class="finger-path finger-left-middle" data-finger="left-middle"
            d="M 320 380 Q 380 140 405 80 Q 430 80 430 110 Q 400 190 355 380 Z" />
          <!-- Left Index -->
          <path class="finger-path finger-left-index" data-finger="left-index"
            d="M 370 380 Q 440 160 470 100 Q 495 100 495 130 Q 450 200 405 380 Z" />
          <!-- Left Thumb -->
          <path class="finger-path finger-left-thumb" data-finger="thumb"
            d="M 410 380 Q 470 280 520 250 Q 535 260 520 280 Q 470 320 440 380 Z" />
          <!-- Left Palm Outline -->
          <path class="palm-outline" d="M 200 450 Q 220 350 250 320 Q 380 340 440 450 Z" />
        </g>

        <!-- Right Hand Outline -->
        <g class="hand-group hand-right-group">
          <!-- Right Thumb -->
          <path class="finger-path finger-right-thumb" data-finger="thumb"
            d="M 590 380 Q 530 280 480 250 Q 465 260 480 280 Q 530 320 560 380 Z" />
          <!-- Right Index -->
          <path class="finger-path finger-right-index" data-finger="right-index"
            d="M 630 380 Q 560 160 530 100 Q 505 100 505 130 Q 550 200 595 380 Z" />
          <!-- Right Middle -->
          <path class="finger-path finger-right-middle" data-finger="right-middle"
            d="M 680 380 Q 620 140 595 80 Q 570 80 570 110 Q 600 190 645 380 Z" />
          <!-- Right Ring -->
          <path class="finger-path finger-right-ring" data-finger="right-ring"
            d="M 730 380 Q 690 160 660 100 Q 635 100 635 130 Q 670 200 695 380 Z" />
          <!-- Right Pinky -->
          <path class="finger-path finger-right-pinky" data-finger="right-pinky"
            d="M 780 380 Q 770 200 720 130 Q 700 130 700 160 Q 730 230 750 380 Z" />
          <!-- Right Palm Outline -->
          <path class="palm-outline" d="M 800 450 Q 780 350 750 320 Q 620 340 560 450 Z" />
        </g>
      </svg>
    `;
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      const keyStr = e.key.toLowerCase();
      const el = this.container.querySelector(`.key-cap[data-key="${keyStr}"]`);
      if (el) {
        el.classList.add('key-pressed');
      }
    });

    window.addEventListener('keyup', (e) => {
      const keyStr = e.key.toLowerCase();
      const el = this.container.querySelector(`.key-cap[data-key="${keyStr}"]`);
      if (el) {
        el.classList.remove('key-pressed');
      }
    });
  }

  setNextTargetKey(char) {
    if (this.activeTargetKey) {
      const prevEl = this.container.querySelector(`.key-cap[data-key="${this.activeTargetKey}"]`);
      if (prevEl) prevEl.classList.remove('key-target');
    }

    // Reset active finger path highlight
    this.container.querySelectorAll('.finger-path').forEach(path => {
      path.classList.remove('finger-active');
    });

    if (!char) return;
    const targetKeyStr = char.toLowerCase();
    this.activeTargetKey = targetKeyStr;

    const targetEl = this.container.querySelector(`.key-cap[data-key="${targetKeyStr}"]`);
    if (targetEl) {
      targetEl.classList.add('key-target');
      const fingerName = targetEl.dataset.finger;
      this.highlightFingerPath(fingerName);
    }
  }

  highlightFingerPath(fingerName) {
    if (!fingerName) return;
    const paths = this.container.querySelectorAll(`.finger-path[data-finger="${fingerName}"]`);
    paths.forEach(p => p.classList.add('finger-active'));
  }
}
