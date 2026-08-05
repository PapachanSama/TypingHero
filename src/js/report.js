/**
 * Student Report & Teacher Dashboard Module
 */

import { getStudentPracticeHistory, getStoredStudents } from './firebase.js';
import { auth } from './auth.js';

export class ReportView {
  constructor() {
    this.modalEl = document.getElementById('report-modal');
  }

  async renderStudentReport(studentId = null) {
    const user = studentId ? (await getStoredStudents()).find(s => s.id === studentId) : auth.getCurrentUser();
    const history = await getStudentPracticeHistory(user.id);

    const reportContent = document.getElementById('report-content');
    if (!reportContent) return;

    if (history.length === 0) {
      reportContent.innerHTML = `
        <div class="empty-report">
          <h3>📊 ${user.name} さんの練習レポート</h3>
          <p>まだタイピング練習の記録がありません。練習を開始しましょう！</p>
        </div>
      `;
      return;
    }

    const totalSessions = history.length;
    const avgKpm = Math.round(history.reduce((acc, h) => acc + (h.kpm || 0), 0) / totalSessions);
    const maxKpm = Math.max(...history.map(h => h.kpm || 0));
    const avgAccuracy = (history.reduce((acc, h) => acc + (h.accuracy || 0), 0) / totalSessions).toFixed(1);

    const badges = [];
    if (totalSessions >= 1) badges.push('🌱 ファーストステップ');
    if (totalSessions >= 10) badges.push('🔥 継続力マスター');
    if (maxKpm >= 200) badges.push('⚡ スピードスター (200KPM)');
    if (maxKpm >= 350) badges.push('👑 タイピングマスター (350KPM)');
    if (avgAccuracy >= 98) badges.push('🎯 正確率の達人 (98%+)');

    const historyRows = history.slice(-10).reverse().map(h => `
      <tr>
        <td>${new Date(h.timestamp).toLocaleDateString('ja-JP')} ${new Date(h.timestamp).toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'})}</td>
        <td><span class="mode-badge">${h.modeName || '練習'}</span></td>
        <td><strong>${h.kpm} KPM</strong></td>
        <td>${h.accuracy}%</td>
        <td>${h.timeSec}秒</td>
      </tr>
    `).join('');

    reportContent.innerHTML = `
      <div class="report-header-card">
        <h2>🎓 成績・成長レポート - ${user.name} 様</h2>
        <button class="btn btn-print" onclick="window.print()">🖨️ レポート印刷 / PDF保存</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⚡</div>
          <div class="stat-value">${maxKpm} <small>KPM</small></div>
          <div class="stat-label">最高打字速度</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-value">${avgKpm} <small>KPM</small></div>
          <div class="stat-label">平均打字速度</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-value">${avgAccuracy}%</div>
          <div class="stat-label">平均正確率</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-value">${totalSessions} <small>回</small></div>
          <div class="stat-label">総練習回数</div>
        </div>
      </div>

      <div class="badge-section">
        <h3>🏅 獲得したバッジ</h3>
        <div class="badge-list">
          ${badges.map(b => `<span class="badge-item">${b}</span>`).join('')}
        </div>
      </div>

      <div class="history-table-wrapper">
        <h3>📜 最近の練習履歴 (最新10件)</h3>
        <table class="history-table">
          <thead>
            <tr>
              <th>日時</th>
              <th>モード</th>
              <th>打字速度 (KPM)</th>
              <th>正確率</th>
              <th>練習時間</th>
            </tr>
          </thead>
          <tbody>
            ${historyRows}
          </tbody>
        </table>
      </div>
    `;
  }

  async renderAdminDashboard() {
    const reportContent = document.getElementById('report-content');
    if (!reportContent) return;

    const students = await getStoredStudents();
    const allScores = await getStudentPracticeHistory('all');

    const leaderboard = students.map(s => {
      const sScores = allScores.filter(sc => sc.studentId === s.id);
      const totalCount = sScores.length;
      const maxKpm = totalCount ? Math.max(...sScores.map(sc => sc.kpm || 0)) : 0;
      const avgKpm = totalCount ? Math.round(sScores.reduce((a, sc) => a + (sc.kpm || 0), 0) / totalCount) : 0;
      const avgAcc = totalCount ? (sScores.reduce((a, sc) => a + (sc.accuracy || 0), 0) / totalCount).toFixed(1) : 0;
      return { ...s, totalCount, maxKpm, avgKpm, avgAcc };
    }).sort((a, b) => b.maxKpm - a.maxKpm);

    const leaderRows = leaderboard.map((st, idx) => `
      <tr>
        <td><strong>#${idx + 1}</strong></td>
        <td>${st.name}</td>
        <td>${st.totalCount} 回</td>
        <td><strong style="color:var(--accent-color)">${st.maxKpm} KPM</strong></td>
        <td>${st.avgKpm} KPM</td>
        <td>${st.avgAcc}%</td>
      </tr>
    `).join('');

    reportContent.innerHTML = `
      <div class="report-header-card">
        <h2>👑 クラス管理者ダッシュボード (生徒100名対応)</h2>
        <button class="btn btn-print" onclick="window.print()">🖨️ クラス成績一覧を印刷</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-value">${students.length} <small>名</small></div>
          <div class="stat-label">登録生徒数</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-value">${allScores.length} <small>回</small></div>
          <div class="stat-label">総タイピング練習回数</div>
        </div>
      </div>

      <div class="history-table-wrapper">
        <h3>🏆 生徒別タイピング成績ランキング (Top 100)</h3>
        <table class="history-table">
          <thead>
            <tr>
              <th>順位</th>
              <th>生徒名</th>
              <th>練習回数</th>
              <th>最高KPM</th>
              <th>平均KPM</th>
              <th>平均正確率</th>
            </tr>
          </thead>
          <tbody>
            ${leaderRows}
          </tbody>
        </table>
      </div>
    `;
  }
}
