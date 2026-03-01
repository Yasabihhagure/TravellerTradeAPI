import { getWorldData } from './src/api/travellerMap.js';
import { analyzeTradeRoute, TRADE_CODES_INFO, PASSENGER_TYPES_INFO } from './src/logic/tradeEngine.js';

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
  ttaData: document.getElementById('tta-data'),
  langSelect: document.getElementById('lang-select')
};

let currentLang = elements.langSelect.value || 'en';

elements.langSelect.addEventListener('change', (e) => {
  currentLang = e.target.value;
  // Only re-run if we have valid inputs
  if (elements.sector.value && elements.origin.value && elements.dest.value) {
    performAnalysis();
  } else {
    updateWelcomeMessage();
  }
});

function updateWelcomeMessage() {
  if (currentLang === 'ja') {
    elements.resultsArea.innerHTML = `
          <div class="card" id="welcome-message">
            <p>セクター名と座標を入力して、「Analyze Route」をクリックしてください。AIエージェントはこのページに直接アクセスして貿易ルートを提案できます。</p>
          </div>
        `;
  } else {
    elements.resultsArea.innerHTML = `
          <div class="card" id="welcome-message">
            <p>Please enter the sector name and coordinates, then click "Analyze Route". AI agents can directly access this page to propose trade routes.</p>
          </div>
        `;
  }
}

/**
 * ルート分析の実行
 */
async function performAnalysis() {
  const sector = elements.sector.value.trim();
  const originHex = elements.origin.value.trim();
  const destHex = elements.dest.value.trim();
  const broker = parseInt(elements.broker.value) || 0;

  if (!sector || !originHex || !destHex) {
    alert(currentLang === 'ja' ? 'セクター、出発地、目的地を入力してください。' : 'Please fill in Sector, Origin, and Destination.');
    return;
  }

  // UIをローディング表示に
  elements.resultsArea.innerHTML = `<div class="loading-spinner">${currentLang === 'ja' ? 'ルートを分析中...' : 'Analyzing trade route...'}</div>`;
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
    const localizedRecommendations = analysis.recommendations.map(r => ({
      item: r['item_' + currentLang],
      purchase_dm: r.purchase_dm,
      sale_dm: r.sale_dm,
      est_purchase_price: r.est_purchase_price,
      est_sale_price: r.est_sale_price,
      profit_per_ton: r.profit_per_ton,
      profit_margin: r.profit_margin,
      stock_tons: r.stock_tons,
      net_profit_potential: r.net_profit_potential,
      logic: r.logic
    }));

    elements.ttaData.textContent = JSON.stringify({
      api_version: "1.1.0",
      status: "ready",
      language: currentLang,
      route_analysis: {
        origin: analysis.origin,
        destination: analysis.destination,
        recommendations: localizedRecommendations,
        traffic: analysis.traffic
      }
    }, null, 2);

    // 5. URLハッシュの更新（共有用）
    window.location.hash = `/trade/${sector}/${originHex}/${destHex}?broker=${broker}&lang=${currentLang}`;

  } catch (error) {
    elements.resultsArea.innerHTML = `
      <div class="card" style="border-color: #e74c3c;">
        <h3 style="color: #e74c3c;">${currentLang === 'ja' ? '分析失敗' : 'Analysis Failed'}</h3>
        <p>${error.message}</p>
      </div>
    `;
  } finally {
    elements.searchBtn.disabled = false;
  }
}

/**
 * 貿易コードのバッジHTML生成
 */
function createTradeCodeBadge(c) {
  const info = TRADE_CODES_INFO[c];
  const title = info ? `${info['name_' + currentLang]}: ${info['desc_' + currentLang]}` : c;
  return `<span class="code-badge" title="${title}">${c}</span>`;
}

/**
 * 分析結果のレンダリング
 */
function renderResults(data) {
  const { origin, destination, recommendations, traffic } = data;

  let html = `
    <div class="card">
      <div class="world-header">
        <div>
          <h3>${origin.name} (${origin.hex})</h3>
          <div class="trade-codes-list">
            ${origin.tradeCodes.map(createTradeCodeBadge).join('')}
          </div>
        </div>
        <div style="font-size: 1.5rem; color: var(--accent-color);">⮕</div>
        <div style="text-align: right;">
          <h3>${destination.name} (${destination.hex})</h3>
          <div class="trade-codes-list" style="justify-content: flex-end;">
            ${destination.tradeCodes.map(createTradeCodeBadge).join('')}
          </div>
        </div>
      </div>
      
      <div class="traffic-info" style="margin: 1rem 0; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 8px;">
        <h4 style="margin-top: 0; color: var(--accent-color);">${currentLang === 'ja' ? '港の交通量と機会' : 'Port Traffic & Opportunities'}</h4>
        <div style="display: flex; gap: 1rem; font-size: 0.9rem; flex-wrap: wrap; align-items: center;">
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <strong>${currentLang === 'ja' ? '乗客:' : 'Passengers:'}</strong> 
                <span class="code-badge" title="${PASSENGER_TYPES_INFO.high['name_' + currentLang]}">High: ${traffic.passengers.high}</span>
                <span class="code-badge" title="${PASSENGER_TYPES_INFO.middle['name_' + currentLang]}">Mid: ${traffic.passengers.middle}</span>
                <span class="code-badge" title="${PASSENGER_TYPES_INFO.basic['name_' + currentLang]}">Basic: ${traffic.passengers.basic}</span>
                <span class="code-badge" title="${PASSENGER_TYPES_INFO.low['name_' + currentLang]}">Low: ${traffic.passengers.low}</span>
            </div>
            <div><strong>${currentLang === 'ja' ? '貨物ロット:' : 'Freight Lots:'}</strong> ${traffic.freight_lots}</div>
            <div><strong>${currentLang === 'ja' ? '郵便配達:' : 'Mail Delivery:'}</strong> ${traffic.has_mail ? (currentLang === 'ja' ? '<span style="color: #2ecc71;">あり (Cr 25,000)</span>' : '<span style="color: #2ecc71;">Available (Cr 25,000)</span>') : (currentLang === 'ja' ? 'なし' : 'None')}</div>
        </div>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>${currentLang === 'ja' ? '貿易品' : 'Trade Good'}</th>
              <th>${currentLang === 'ja' ? '在庫 (トン)' : 'Stock (Tons)'}</th>
              <th>Purchase DM</th>
              <th>Sale DM</th>
              <th>${currentLang === 'ja' ? '予測利益' : 'Est. Profit'}</th>
              <th>Margin</th>
            </tr>
          </thead>
          <tbody>
            ${recommendations.map(r => `
              <tr>
                <td>${r['item_' + currentLang]}</td>
                <td>${r.stock_tons}</td>
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
      ${recommendations.length === 0 ? `<p style="text-align: center; margin-top: 1rem;">${currentLang === 'ja' ? 'このルートで利益が出る商品は見つかりませんでした。' : 'No profitable goods found for this route.'}</p>` : ''}
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
      elements.sector.value = decodeURIComponent(path[0]);
      elements.origin.value = decodeURIComponent(path[1]);
      elements.dest.value = decodeURIComponent(path[2]);
      if (params.has('broker')) {
        elements.broker.value = params.get('broker');
      }
      if (params.has('lang')) {
        const urlLang = params.get('lang');
        if (urlLang === 'ja' || urlLang === 'en') {
          currentLang = urlLang;
          elements.langSelect.value = currentLang;
        }
      }
      performAnalysis();
    }
  } else {
    updateWelcomeMessage();
  }
}

// Event Listeners
elements.searchBtn.addEventListener('click', performAnalysis);
window.addEventListener('hashchange', handleRouting);

// 初期読み込み時のルーティング実行
handleRouting();

