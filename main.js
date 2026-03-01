import { getWorldData } from './src/api/travellerMap.js';
import { analyzeTradeRoute } from './src/logic/tradeEngine.js';

/**
 * UI Constants
 */
const elements = {
    sector: document.getElementById('sector'),
    origin: document.getElementById('origin-hex'),
    dest: document.getElementById('dest-hex'),
    broker: document.getElementById('broker'),
    searchBtn: document.getElementById('search-btn'),
    resultsArea: document.getElementById('results-area'),
    ttaData: document.getElementById('tta-data')
};

/**
 * ルート分析の実行
 */
async function performAnalysis() {
    const sector = elements.sector.value.trim();
    const originHex = elements.origin.value.trim();
    const destHex = elements.dest.value.trim();
    const broker = parseInt(elements.broker.value) || 0;

    if (!sector || !originHex || !destHex) {
        alert('Please fill in Sector, Origin, and Destination.');
        return;
    }

    // UIをローディング表示に
    elements.resultsArea.innerHTML = '<div class="loading-spinner">Analyzing trade route...</div>';
    elements.searchBtn.disabled = true;

    try {
        // 1. データ取得
        const [originData, destData] = await Promise.all([
            getWorldData(sector, originHex),
            getWorldData(sector, destHex)
        ]);

        // 2. 分析実行
        const analysis = analyzeTradeRoute(originData, destData, broker);

        // 3. UIの更新
        renderResults(analysis);

        // 4. AI Bridge (JSON) の更新
        elements.ttaData.textContent = JSON.stringify({
            api_version: "1.0.0",
            status: "ready",
            route_analysis: analysis
        }, null, 2);

        // 5. URLハッシュの更新（共有用）
        window.location.hash = `/trade/${sector}/${originHex}/${destHex}?broker=${broker}`;

    } catch (error) {
        elements.resultsArea.innerHTML = `
      <div class="card" style="border-color: #e74c3c;">
        <h3 style="color: #e74c3c;">Analysis Failed</h3>
        <p>${error.message}</p>
      </div>
    `;
    } finally {
        elements.searchBtn.disabled = false;
    }
}

/**
 * 分析結果のレンダリング
 */
function renderResults(data) {
    const { origin, destination, recommendations } = data;

    let html = `
    <div class="card">
      <div class="world-header">
        <div>
          <h3>${origin.name} (${origin.hex})</h3>
          <div class="trade-codes-list">
            ${origin.tradeCodes.map(c => `<span class="code-badge">${c}</span>`).join('')}
          </div>
        </div>
        <div style="font-size: 1.5rem; color: var(--accent-color);">⮕</div>
        <div style="text-align: right;">
          <h3>${destination.name} (${destination.hex})</h3>
          <div class="trade-codes-list" style="justify-content: flex-end;">
            ${destination.tradeCodes.map(c => `<span class="code-badge">${c}</span>`).join('')}
          </div>
        </div>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Trade Good</th>
              <th>Purchase DM</th>
              <th>Sale DM</th>
              <th>Est. Profit</th>
              <th>Margin</th>
            </tr>
          </thead>
          <tbody>
            ${recommendations.map(r => `
              <tr>
                <td>${r.item}</td>
                <td>+${r.purchase_dm}</td>
                <td>+${r.sale_dm}</td>
                <td class="${r.profit_per_ton > 50000 ? 'profit-very-high' : 'profit-high'}">
                  Cr ${r.profit_per_ton.toLocaleString()}
                </td>
                <td>${r.profit_margin}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ${recommendations.length === 0 ? '<p style="text-align: center; margin-top: 1rem;">No profitable goods found for this route.</p>' : ''}
    </div>
  `;

    elements.resultsArea.innerHTML = html;
}

/**
 * URLハッシュによるルーティング（AI/直接アクセス用）
 */
function handleRouting() {
    const hash = window.location.hash;
    if (hash.startsWith('#/trade/')) {
        const parts = hash.replace('#/trade/', '').split('?');
        const path = parts[0].split('/');
        const params = new URLSearchParams(parts[1] || '');

        if (path.length >= 3) {
            elements.sector.value = path[0];
            elements.origin.value = path[1];
            elements.dest.value = path[2];
            if (params.has('broker')) {
                elements.broker.value = params.get('broker');
            }
            performAnalysis();
        }
    }
}

// Event Listeners
elements.searchBtn.addEventListener('click', performAnalysis);
window.addEventListener('hashchange', handleRouting);

// 初期読み込み時のルーティング実行
handleRouting();
