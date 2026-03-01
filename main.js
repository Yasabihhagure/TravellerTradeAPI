import { getWorldData } from './src/api/travellerMap.js';
import { analyzeTradeRoute, TRADE_CODES_INFO, PASSENGER_TYPES_INFO } from './src/logic/tradeEngine.js';

/**
 * UI Constants
 */
const elements = {
  sector: document.getElementById('sector'),
  origin: document.getElementById('origin-hex'),
  destSector: document.getElementById('dest-sector'),
  dest: document.getElementById('dest-hex'),
  broker: document.getElementById('broker'),
  searchBtn: document.getElementById('search-btn'),
  resultsArea: document.getElementById('results-area'),
  ttaData: document.getElementById('tta-data'),
  langSelect: document.getElementById('lang-select'),
  mailBonus: document.getElementById('mail-bonus')
};

// UI静的要素の取得
const uiElements = {
  labelSector: document.querySelector('label[for="sector"]'),
  labelOrigin: document.querySelector('label[for="origin-hex"]'),
  labelDestSector: document.querySelector('label[for="dest-sector"]'),
  labelDest: document.querySelector('label[for="dest-hex"]'),
  labelBroker: document.querySelector('label[for="broker"]'),
  labelMailBonus: document.querySelector('label[for="mail-bonus"]'),
  searchBtnText: elements.searchBtn,
  footerWelcome: document.querySelector('footer p:nth-child(2)'),
};

const UI_TEXTS = {
  en: {
    sector: "Origin Sector",
    origin: "Origin Hex",
    destSector: "Dest Sector",
    dest: "Destination Hex",
    broker: "Broker Level",
    mailBonus: "Mail Bonus",
    analyze: "Analyze Route",
    footer: "This tool is designed for AI interaction. Human users are also welcome.",
    alert: "Please fill in Sector, Origin, and Destination.",
    analyzing: "Analyzing trade route...",
    welcome: "Please enter the sector name and coordinates, then click \"Analyze Route\". AI agents can directly access this page to propose trade routes.",
    failTitle: "Analysis Failed",
    portTraffic: "Port Traffic & Opportunities",
    passengers: "Passengers:",
    freightLots: "Available Freight Lots:",
    freightMajor: "Major:",
    freightMinor: "Minor:",
    freightIncidental: "Incidental:",
    mailDelivery: "Mail Delivery:",
    mailAvail: "Available",
    mailAvailDetail: "({0} Containers / {1}t / Cr {2})",
    mailNone: "None",
    mailTooltip: "Mail Delivery: All or Nothing. Either take all generated containers or none.",
    tblGood: "Trade Good",
    tblStock: "Stock (Tons)",
    tblProfit: "Est. Profit",
    noProfit: "No profitable goods found for this route.",
  },
  ja: {
    sector: "出発セクター",
    origin: "出発座標 (Hex)",
    destSector: "宛先セクター",
    dest: "目的座標 (Hex)",
    broker: "ブローカー技能",
    mailBonus: "郵便ボーナス",
    analyze: "ルートを分析",
    footer: "このツールはAIエージェントの処理向けに設計されています。人間の利用も歓迎します。",
    alert: "セクター、出発地、目的地を入力してください。",
    analyzing: "ルートを分析中...",
    welcome: "セクター名と座標を入力して、「ルートを分析」をクリックしてください。AIエージェントはこのページに直接アクセスして貿易ルートを提案できます。",
    failTitle: "分析失敗",
    portTraffic: "港の交通量と機会",
    passengers: "乗客:",
    freightLots: "委託貨物ロット:",
    freightMajor: "大口:",
    freightMinor: "小口:",
    freightIncidental: "付随:",
    mailDelivery: "郵便配達:",
    mailAvail: "あり",
    mailAvailDetail: "({0}個 / {1}トン / Cr {2})",
    mailNone: "なし",
    mailTooltip: "郵便配達: 全て運ぶか、1つも運ばないかを選択する必要があります（一部輸送不可）",
    tblGood: "貿易品",
    tblStock: "在庫 (トン)",
    tblProfit: "予測利益",
    noProfit: "このルートで利益が出る商品は見つかりませんでした。",
  }
};

let currentLang = elements.langSelect.value || 'en';

function updateStaticUI() {
  const t = UI_TEXTS[currentLang];
  if (uiElements.labelSector) uiElements.labelSector.textContent = t.sector;
  if (uiElements.labelOrigin) uiElements.labelOrigin.textContent = t.origin;
  if (uiElements.labelDestSector) uiElements.labelDestSector.textContent = t.destSector;
  if (uiElements.labelDest) uiElements.labelDest.textContent = t.dest;
  if (uiElements.labelBroker) uiElements.labelBroker.textContent = t.broker;
  if (uiElements.labelMailBonus) uiElements.labelMailBonus.textContent = t.mailBonus;
  if (uiElements.searchBtnText) uiElements.searchBtnText.textContent = t.analyze;
  if (uiElements.footerWelcome) uiElements.footerWelcome.textContent = t.footer;
}

elements.langSelect.addEventListener('change', (e) => {
  currentLang = e.target.value;
  updateStaticUI();

  if (elements.sector.value && elements.origin.value && elements.dest.value) {
    performAnalysis();
  } else {
    updateWelcomeMessage();
  }
});

function updateWelcomeMessage() {
  const t = UI_TEXTS[currentLang];
  elements.resultsArea.innerHTML = `
    <div class="card" id="welcome-message">
      <p>${t.welcome}</p>
    </div>
  `;
}

/**
 * ルート分析の実行
 */
async function performAnalysis() {
  const t = UI_TEXTS[currentLang];
  const sector = elements.sector.value.trim();
  const originHex = elements.origin.value.trim();
  const destSector = elements.destSector.value.trim() || sector;
  const destHex = elements.dest.value.trim();
  const broker = parseInt(elements.broker.value) || 0;
  const mailBonus = parseInt(elements.mailBonus.value) || 0;

  if (!sector || !originHex || !destHex) {
    alert(t.alert);
    return;
  }

  elements.resultsArea.innerHTML = `<div class="loading-spinner">${t.analyzing}</div>`;
  elements.searchBtn.disabled = true;

  try {
    const [originData, destData] = await Promise.all([
      getWorldData(sector, originHex),
      getWorldData(destSector, destHex)
    ]);

    const analysis = analyzeTradeRoute(originData, destData, broker, mailBonus);
    renderResults(analysis);

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
      api_version: "1.4.0",
      status: "ready",
      language: currentLang,
      route_analysis: {
        origin: analysis.origin,
        destination: analysis.destination,
        recommendations: localizedRecommendations,
        traffic: analysis.traffic
      }
    }, null, 2);

    const destSectorPath = elements.destSector.value.trim() ? `/${encodeURIComponent(destSector)}` : '';
    window.location.hash = `/trade/${encodeURIComponent(sector)}/${originHex}${destSectorPath}/${destHex}?broker=${broker}&mail_bonus=${mailBonus}&lang=${currentLang}`;

  } catch (error) {
    elements.resultsArea.innerHTML = `
      <div class="card" style="border-color: #e74c3c;">
        <h3 style="color: #e74c3c;">${t.failTitle}</h3>
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
  const title = info ? info['name_' + currentLang] : c;
  return `<span class="code-badge" title="${title}">${c}</span>`;
}

/**
 * 分析結果のレンダリング
 */
function renderResults(data) {
  const t = UI_TEXTS[currentLang];
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
        <h4 style="margin-top: 0; color: var(--accent-color);">${t.portTraffic}</h4>
        <div style="display: flex; gap: 1rem; font-size: 0.9rem; flex-wrap: wrap; align-items: center;">
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <strong>${t.passengers}</strong> 
                <span class="code-badge">${PASSENGER_TYPES_INFO.high['name_' + currentLang]}: ${traffic.passengers.high}</span>
                <span class="code-badge">${PASSENGER_TYPES_INFO.middle['name_' + currentLang]}: ${traffic.passengers.middle}</span>
                <span class="code-badge">${PASSENGER_TYPES_INFO.basic['name_' + currentLang]}: ${traffic.passengers.basic}</span>
                <span class="code-badge">${PASSENGER_TYPES_INFO.low['name_' + currentLang]}: ${traffic.passengers.low}</span>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <strong>${t.freightLots}</strong> 
                <span class="code-badge" title="10-60 tons per lot">${t.freightMajor} ${traffic.freight_lots.major} (${traffic.freight_lots.major_tons}t)</span>
                <span class="code-badge" title="5-30 tons per lot">${t.freightMinor} ${traffic.freight_lots.minor} (${traffic.freight_lots.minor_tons}t)</span>
                <span class="code-badge" title="1-6 tons per lot">${t.freightIncidental} ${traffic.freight_lots.incidental} (${traffic.freight_lots.incidental_tons}t)</span>
            </div>
            <div title="${t.mailTooltip}">
                <strong>${t.mailDelivery}</strong> 
                ${traffic.has_mail
      ? `<span style="color: #2ecc71;">${t.mailAvail} ${t.mailAvailDetail.replace('{0}', traffic.mail_containers).replace('{1}', traffic.mail_containers * 5).replace('{2}', (25000 * traffic.mail_containers).toLocaleString())}</span>`
      : t.mailNone}
            </div>
        </div>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>${t.tblGood}</th>
              <th>${t.tblStock}</th>
              <th>Purchase DM</th>
              <th>Sale DM</th>
              <th>${t.tblProfit}</th>
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
      ${recommendations.length === 0 ? `<p style="text-align: center; margin-top: 1rem;">${t.noProfit}</p>` : ''}
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

      if (path.length >= 4) {
        elements.destSector.value = decodeURIComponent(path[2]);
        elements.dest.value = decodeURIComponent(path[3]);
      } else {
        elements.destSector.value = '';
        elements.dest.value = decodeURIComponent(path[2]);
      }

      if (params.has('broker')) {
        elements.broker.value = params.get('broker');
      }
      if (params.has('mail_bonus')) {
        elements.mailBonus.value = params.get('mail_bonus');
      }
      if (params.has('lang')) {
        const urlLang = params.get('lang');
        if (urlLang === 'ja' || urlLang === 'en') {
          currentLang = urlLang;
          elements.langSelect.value = currentLang;
          updateStaticUI();
        }
      }
      performAnalysis();
    }
  } else {
    updateStaticUI();
    updateWelcomeMessage();
  }
}

// Event Listeners
elements.searchBtn.addEventListener('click', performAnalysis);
window.addEventListener('hashchange', handleRouting);

// 初期読み込み時のルーティング実行
handleRouting();

