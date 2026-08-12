/**
 * Interactive On-Screen Keyboard Component & Semi-Transparent Hands Visualizer
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
    { key: ' ', label: 'スペース (Space)', finger: 'thumb', wide: true }
  ]
];

export class VirtualKeyboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeTargetKey = null;
    this.activeFinger = null;
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

    // 2. Semi-Transparent Hands SVG Visualizer
    const handsContainer = document.createElement('div');
    handsContainer.className = 'hands-visualizer-container';
    handsContainer.innerHTML = this.renderHandsSVG();

    wrapper.appendChild(kbGrid);
    wrapper.appendChild(handsContainer);
    this.container.appendChild(wrapper);

    this.bindEvents();
  }

  renderHandsSVG() {
    return `
      <div class="hands-wrapper">
        <!-- Left Hand -->
        <div class="hand-box hand-left">
          <span class="hand-label">左手 (Left)</span>
          <div class="fingers-group">
            <div class="finger-node finger-left-pinky" data-finger="left-pinky">小指</div>
            <div class="finger-node finger-left-ring" data-finger="left-ring">薬指</div>
            <div class="finger-node finger-left-middle" data-finger="left-middle">中指</div>
            <div class="finger-node finger-left-index" data-finger="left-index">人差</div>
            <div class="finger-node finger-left-thumb" data-finger="thumb">親指</div>
          </div>
        </div>

        <!-- Right Hand -->
        <div class="hand-box hand-right">
          <span class="hand-label">右手 (Right)</span>
          <div class="fingers-group">
            <div class="finger-node finger-right-thumb" data-finger="thumb">親指</div>
            <div class="finger-node finger-right-index" data-finger="right-index">人差</div>
            <div class="finger-node finger-right-middle" data-finger="right-middle">中指</div>
            <div class="finger-node finger-right-ring" data-finger="right-ring">薬指</div>
            <div class="finger-node finger-right-pinky" data-finger="right-pinky">小指</div>
          </div>
        </div>
      </div>
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

    // Reset active finger node highlight
    this.container.querySelectorAll('.finger-node').forEach(node => {
      node.classList.remove('finger-active');
    });

    if (!char) return;
    const targetKeyStr = char.toLowerCase();
    this.activeTargetKey = targetKeyStr;

    const targetEl = this.container.querySelector(`.key-cap[data-key="${targetKeyStr}"]`);
    if (targetEl) {
      targetEl.classList.add('key-target');
      const fingerName = targetEl.dataset.finger;
      this.highlightFingerNode(fingerName);
    }
  }

  highlightFingerNode(fingerName) {
    if (!fingerName) return;
    const fingerNodes = this.container.querySelectorAll(`.finger-node[data-finger="${fingerName}"]`);
    fingerNodes.forEach(node => node.classList.add('finger-active'));
  }
}
