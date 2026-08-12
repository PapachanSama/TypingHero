/**
 * Interactive On-Screen Keyboard + Simple Flat Hand Illustrations (below keyboard)
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

// Finger color mapping
const FINGER_COLORS = {
  'left-pinky':   '#f43f5e',
  'left-ring':    '#fb923c',
  'left-middle':  '#facc15',
  'left-index':   '#4ade80',
  'right-index':  '#38bdf8',
  'right-middle': '#818cf8',
  'right-ring':   '#c084fc',
  'right-pinky':  '#f472b6',
  'thumb':        '#94a3b8'
};

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

    // Keyboard Grid
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
        // Apply finger color border
        keyBtn.style.borderTopColor = FINGER_COLORS[k.finger] || '#ffffff';
        rowDiv.appendChild(keyBtn);
      });
      kbGrid.appendChild(rowDiv);
    });

    // Flat Hand Illustrations Below Keyboard
    const handsEl = document.createElement('div');
    handsEl.className = 'flat-hands-row';
    handsEl.innerHTML = this.buildHandsHTML();

    wrapper.appendChild(kbGrid);
    wrapper.appendChild(handsEl);
    this.container.appendChild(wrapper);

    this.bindEvents();
  }

  buildHandsHTML() {
    // Skin color matching user's uploaded hand image
    const skin = '#f9c5a0';
    const skinDark = '#e8a878';

    const leftHand = `
      <div class="hand-illust hand-left" id="hand-left">
        <svg class="flat-hand-svg" viewBox="0 0 280 260" xmlns="http://www.w3.org/2000/svg">
          <!-- Palm -->
          <ellipse cx="140" cy="185" rx="100" ry="68" fill="${skin}" />
          <!-- Thumb (right side of left hand) -->
          <ellipse class="finger-part" data-finger="thumb"
            cx="228" cy="170" rx="26" ry="42"
            transform="rotate(30 228 170)"
            fill="${skin}" stroke="${skinDark}" stroke-width="2"/>
          <!-- Index -->
          <rect class="finger-part" data-finger="left-index"
            x="163" y="45" width="38" height="125" rx="19"
            fill="${skin}" stroke="${skinDark}" stroke-width="2"/>
          <!-- Middle -->
          <rect class="finger-part" data-finger="left-middle"
            x="118" y="28" width="40" height="140" rx="20"
            fill="${skin}" stroke="${skinDark}" stroke-width="2"/>
          <!-- Ring -->
          <rect class="finger-part" data-finger="left-ring"
            x="73" y="42" width="38" height="128" rx="19"
            fill="${skin}" stroke="${skinDark}" stroke-width="2"/>
          <!-- Pinky -->
          <rect class="finger-part" data-finger="left-pinky"
            x="32" y="72" width="33" height="100" rx="16"
            fill="${skin}" stroke="${skinDark}" stroke-width="2"/>
        </svg>
        <span class="hand-label">左手</span>
      </div>`;

    const rightHand = `
      <div class="hand-illust hand-right" id="hand-right">
        <svg class="flat-hand-svg" viewBox="0 0 280 260" xmlns="http://www.w3.org/2000/svg">
          <!-- Palm -->
          <ellipse cx="140" cy="185" rx="100" ry="68" fill="${skin}" />
          <!-- Thumb (left side of right hand) -->
          <ellipse class="finger-part" data-finger="thumb"
            cx="52" cy="170" rx="26" ry="42"
            transform="rotate(-30 52 170)"
            fill="${skin}" stroke="${skinDark}" stroke-width="2"/>
          <!-- Index -->
          <rect class="finger-part" data-finger="right-index"
            x="79" y="45" width="38" height="125" rx="19"
            fill="${skin}" stroke="${skinDark}" stroke-width="2"/>
          <!-- Middle -->
          <rect class="finger-part" data-finger="right-middle"
            x="122" y="28" width="40" height="140" rx="20"
            fill="${skin}" stroke="${skinDark}" stroke-width="2"/>
          <!-- Ring -->
          <rect class="finger-part" data-finger="right-ring"
            x="169" y="42" width="38" height="128" rx="19"
            fill="${skin}" stroke="${skinDark}" stroke-width="2"/>
          <!-- Pinky -->
          <rect class="finger-part" data-finger="right-pinky"
            x="215" y="72" width="33" height="100" rx="16"
            fill="${skin}" stroke="${skinDark}" stroke-width="2"/>
        </svg>
        <span class="hand-label">右手</span>
      </div>`;

    return leftHand + rightHand;
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      const el = this.container.querySelector(`.key-cap[data-key="${e.key.toLowerCase()}"]`);
      if (el) el.classList.add('key-pressed');
    });
    window.addEventListener('keyup', (e) => {
      const el = this.container.querySelector(`.key-cap[data-key="${e.key.toLowerCase()}"]`);
      if (el) el.classList.remove('key-pressed');
    });
  }

  setNextTargetKey(char) {
    // Clear previous key highlight
    if (this.activeTargetKey) {
      const prev = this.container.querySelector(`.key-cap[data-key="${this.activeTargetKey}"]`);
      if (prev) prev.classList.remove('key-target');
    }
    // Clear all finger highlights
    this.container.querySelectorAll('.finger-part').forEach(f => {
      f.classList.remove('finger-active');
      f.style.fill = '#f9c5a0';
      f.style.filter = '';
    });

    if (!char) return;
    this.activeTargetKey = char.toLowerCase();
    const targetEl = this.container.querySelector(`.key-cap[data-key="${this.activeTargetKey}"]`);
    if (targetEl) {
      targetEl.classList.add('key-target');
      const fingerName = targetEl.dataset.finger;
      if (fingerName) this.highlightFinger(fingerName);
    }
  }

  highlightFinger(fingerName) {
    const color = FINGER_COLORS[fingerName] || '#facc15';
    const parts = this.container.querySelectorAll(`.finger-part[data-finger="${fingerName}"]`);
    parts.forEach(f => {
      f.style.fill = color;
      f.style.filter = `drop-shadow(0 0 10px ${color})`;
      f.classList.add('finger-active');
    });
  }
}
