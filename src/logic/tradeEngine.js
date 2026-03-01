/**
 * 貿易計算エンジン
 * 提供された「貿易関連データ集.md」に基づき、最適な商品と利益を算出する
 */

/**
 * 貿易品の定義リスト (貿易関連データ集.md より)
 */
export const TRADE_GOODS = [
    { id: '11', name: '一般電子機器', basePrice: 20000, purchaseDM: { In: 2, Ht: 3 }, saleDM: { Ni: 1, Ri: 1, As: 1 }, availability: ['All'], stockFormula: "2D*10" },
    { id: '12', name: '一般工業製品', basePrice: 10000, purchaseDM: { Na: 2, In: 5 }, saleDM: { Ni: 3, Ag: 2 }, availability: ['All'], stockFormula: "2D*10" },
    { id: '13', name: '一般加工品', basePrice: 20000, purchaseDM: { Na: 2, In: 5 }, saleDM: { Ni: 3, Hi: 2 }, availability: ['All'], stockFormula: "2D*10" },
    { id: '14', name: '一般原材料', basePrice: 5000, purchaseDM: { Ag: 3, Ga: 2 }, saleDM: { In: 2, Po: 2 }, availability: ['All'], stockFormula: "2D*20" },
    { id: '15', name: '一般消耗品', basePrice: 500, purchaseDM: { Ag: 3, Wa: 2, Ga: 1, As: -4 }, saleDM: { As: 1, Fl: 1, Ic: 1, Hi: 1 }, availability: ['All'], stockFormula: "2D*20" },
    { id: '16', name: '一般鉱石', basePrice: 1000, purchaseDM: { As: 4 }, saleDM: { In: 3, Ni: 1 }, availability: ['All'], stockFormula: "2D*20" },
    { id: '21', name: '先進電子機器', basePrice: 100000, purchaseDM: { In: 2, Ht: 3 }, saleDM: { Ni: 1, Ri: 2, As: 3 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '22', name: '先進機械部品', basePrice: 75000, purchaseDM: { In: 2, Ht: 1 }, saleDM: { As: 2, Ni: 1 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '23', name: '先進加工品', basePrice: 100000, purchaseDM: { In: 1 }, saleDM: { Hi: 1, Ri: 2 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '24', name: '先進兵器', basePrice: 150000, purchaseDM: { Ht: 2 }, saleDM: { Po: 1, Amber: 2, Red: 4 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '25', name: '先進車両', basePrice: 180000, purchaseDM: { Ht: 2 }, saleDM: { As: 2, Ri: 2 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '26', name: '生化学製品', basePrice: 50000, purchaseDM: { Ag: 1, Wa: 2 }, saleDM: { In: 2 }, availability: ['Ag', 'Wa'], stockFormula: "1D*5" },
    { id: '31', name: '貴石・結晶', basePrice: 20000, purchaseDM: { As: 2, De: 1, Ic: 1 }, saleDM: { In: 3, Ri: 2 }, availability: ['As', 'De', 'Ic'], stockFormula: "1D*5" },
    { id: '32', name: 'サイバネティクス', basePrice: 250000, purchaseDM: { Ht: 1 }, saleDM: { As: 1, Ic: 1, Ri: 2 }, availability: ['Ht'], stockFormula: "1D" },
    { id: '33', name: '生体動物', basePrice: 10000, purchaseDM: { Ag: 2 }, saleDM: { Lo: 3 }, availability: ['Ag', 'Ga'], stockFormula: "1D*10" },
    { id: '34', name: '高級消耗品', basePrice: 20000, purchaseDM: { Ag: 2, Wa: 1 }, saleDM: { Ri: 2, Hi: 2 }, availability: ['Ag', 'Ga', 'Wa'], stockFormula: "1D*10" },
    { id: '35', name: '高級品', basePrice: 200000, purchaseDM: { Hi: 1 }, saleDM: { Ri: 4 }, availability: ['Hi'], stockFormula: "1D" },
    { id: '36', name: '医療用品', basePrice: 50000, purchaseDM: { Ht: 2 }, saleDM: { In: 2, Po: 1, Ri: 1 }, availability: ['Ht', 'Hi'], stockFormula: "1D*5" },
    { id: '42', name: '医薬品', basePrice: 100000, purchaseDM: { As: 2, Hi: 1 }, saleDM: { Ri: 2, Lt: 1 }, availability: ['As', 'De', 'Hi', 'Wa'], stockFormula: "1D" },
    { id: '43', name: 'ポリマー', basePrice: 7000, purchaseDM: { In: 1 }, saleDM: { Ri: 2, Ni: 1 }, availability: ['In'], stockFormula: "1D*10" },
    { id: '44', name: '貴金属', basePrice: 50000, purchaseDM: { As: 3, De: 1, Ic: 2 }, saleDM: { Ri: 3, In: 2, Ht: 1 }, availability: ['As', 'De', 'Ic', 'Fl'], stockFormula: "1D" },
    { id: '45', name: '放射性物質', basePrice: 1000000, purchaseDM: { As: 2, Lo: 2 }, saleDM: { In: 3, Ht: 1, Ni: -2, Ag: -3 }, availability: ['As', 'De', 'Lo'], stockFormula: "1D" },
    { id: '46', name: 'ロボット', basePrice: 400000, purchaseDM: { In: 1 }, saleDM: { Ag: 2, Ht: 1 }, availability: ['In'], stockFormula: "1D*5" },
    { id: '51', name: '香辛料', basePrice: 6000, purchaseDM: { De: 2 }, saleDM: { Hi: 2, Ri: 3, Po: 3 }, availability: ['Ga', 'De', 'Wa'], stockFormula: "1D*10" },
    { id: '52', name: '繊維製品', basePrice: 3000, purchaseDM: { Ag: 7 }, saleDM: { Hi: 3, Na: 2 }, availability: ['Ag', 'Ni'], stockFormula: "1D*20" },
    { id: '53', name: '希少鉱石', basePrice: 5000, purchaseDM: { As: 4 }, saleDM: { In: 3, Ni: 1 }, availability: ['As', 'Ic'], stockFormula: "1D*20" },
    { id: '54', name: '希少原材料', basePrice: 20000, purchaseDM: { Ag: 2, Wa: 1 }, saleDM: { In: 2, Ht: 1 }, availability: ['Ag', 'De', 'Wa'], stockFormula: "1D*10" },
    { id: '55', name: '木材', basePrice: 1000, purchaseDM: { Ag: 6 }, saleDM: { Ri: 2, In: 1 }, availability: ['Ag', 'Ga'], stockFormula: "1D*20" },
    { id: '56', name: '車両', basePrice: 15000, purchaseDM: { In: 2, Ht: 1 }, saleDM: { Ni: 2, Hi: 1 }, availability: ['In', 'Ht'], stockFormula: "1D*10" }
];

/**
 * 六面体ダイス (D6) を振る汎用関数
 * @param {number} num ダイスの数
 * @returns {number} 出目の合計
 */
export function rollDice(num) {
    let total = 0;
    for (let i = 0; i < num; i++) {
        total += Math.floor(Math.random() * 6) + 1;
    }
    return total;
}

/**
 * 在庫量の式（例: "2D*10" や "1D"）を計算して結果のトン数を返す
 */
export function calculateStock(formula) {
    if (!formula) return 0;

    // 例: "2D*10" -> ["2D", "10"] / "1D" -> ["1D"]
    const parts = formula.split('*');
    const dicePart = parts[0].trim();

    // ダイス数を抽出 (例: "2D" -> 2)
    const diceMatch = dicePart.match(/^(\d+)D$/i);
    let diceResult = 0;
    if (diceMatch) {
        diceResult = rollDice(parseInt(diceMatch[1], 10));
    } else {
        return 0; // 予期せぬ書式
    }

    if (parts.length > 1) {
        const multiplier = parseInt(parts[1].trim(), 10) || 1;
        return diceResult * multiplier;
    }

    return diceResult;
}

/**
 * 修正価格テーブル (判定結果 -> 基本価格に対する%)
 * 購入時は低いほど、売却時は高いほど有利
 */
const PRICE_MODIFIER_TABLE = {
    purchase: {
        '-3': 3.00, '-2': 2.50, '-1': 2.00, '0': 1.75, '1': 1.50, '2': 1.35, '3': 1.25, '4': 1.20, '5': 1.15,
        '6': 1.10, '7': 1.05, '8': 1.00, '9': 0.95, '10': 0.90, '11': 0.85, '12': 0.80, '13': 0.75, '14': 0.70,
        '15': 0.65, '16': 0.60, '17': 0.55, '18': 0.50, '19': 0.45, '20': 0.40, '21': 0.35, '22': 0.30, '23': 0.25,
        '24': 0.20, '25': 0.15
    },
    sale: {
        '-3': 0.10, '-2': 0.20, '-1': 0.30, '0': 0.40, '1': 0.45, '2': 0.50, '3': 0.55, '4': 0.60, '5': 0.65,
        '6': 0.70, '7': 0.75, '8': 0.80, '9': 0.85, '10': 0.90, '11': 1.00, '12': 1.05, '13': 1.10, '14': 1.15,
        '15': 1.20, '16': 1.25, '17': 1.30, '18': 1.40, '19': 1.50, '20': 1.60, '21': 1.75, '22': 2.00, '23': 2.50,
        '24': 3.00, '25': 4.00
    }
};

/**
 * 境界値チェック付きテーブル参照
 */
function getPriceModifier(type, result) {
    const table = PRICE_MODIFIER_TABLE[type];
    const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
    const min = keys[0];
    const max = keys[keys.length - 1];

    const clamped = Math.max(min, Math.min(max, result));
    return table[clamped.toString()];
}

/**
 * 貿易ルートの分析を行う
 * @param {Object} origin - 出発地のデータ
 * @param {Object} destination - 目的地のデータ
 * @param {number} brokerLevel - キャラクターのブローカー技能レベル
 * @returns {Object} 分析結果
 */
export function analyzeTradeRoute(origin, destination, brokerLevel = 0) {
    const recommendations = TRADE_GOODS.map(item => {
        // 1. 出発地での入手可能性チェック
        const isAvailable = item.availability.includes('All') ||
            item.availability.some(code => origin.tradeCodes.includes(code));
        if (!isAvailable) return null;

        // 2. 購入DMの計算
        let pDM = 0;
        Object.entries(item.purchaseDM).forEach(([code, dm]) => {
            if (origin.tradeCodes.includes(code)) pDM += dm;
        });

        // 3. 売却DMの計算
        let sDM = 0;
        Object.entries(item.saleDM).forEach(([code, dm]) => {
            if (destination.tradeCodes.includes(code)) sDM += dm;
        });

        // 4. 価格判定（3Dベースだが、ここでは「期待値」や「平均的な良い結果」として +0 / -2 の相殺を考慮）
        // Update 2022 では -2 DM がデフォルトで想定される場合があるため、
        // ここでは ブローカー技能をフルに活かした場合の「ポテンシャル」を算出する。
        // 出目の中央値 10.5 (3D) をベースに計算。
        const avgRoll = 11;

        const purchaseResult = avgRoll + pDM + brokerLevel;
        const saleResult = avgRoll + sDM + brokerLevel;

        const pModifier = getPriceModifier('purchase', purchaseResult);
        const sModifier = getPriceModifier('sale', saleResult);

        const estPurchasePrice = item.basePrice * pModifier;
        const estSalePrice = item.basePrice * sModifier;
        const profit = estSalePrice - estPurchasePrice;
        const profitMargin = (profit / estPurchasePrice) * 100;

        // 在庫量の計算
        const stockTons = calculateStock(item.stockFormula);

        return {
            item: item.name,
            purchase_dm: pDM,
            sale_dm: sDM,
            est_purchase_price: estPurchasePrice,
            est_sale_price: estSalePrice,
            profit_per_ton: profit,
            profit_margin: profitMargin.toFixed(1) + '%',
            stock_tons: stockTons,
            net_profit_potential: profitMargin > 100 ? 'Very High' : profitMargin > 50 ? 'High' : 'Moderate',
            logic: `Bought with DM+${pDM}, Sold with DM+${sDM}. Stock generated via ${item.stockFormula}.`
        };
    }).filter(res => res !== null && res.profit_per_ton > 0)
        .sort((a, b) => b.profit_per_ton - a.profit_per_ton);

    return {
        origin,
        destination,
        recommendations: recommendations.slice(0, 5), // 上位5件
        traffic: calculateTraffic(origin)
    };
}

/**
 * 星系の人口に基づく旅客・貨物の発生ダイス数を算出
 * @param {Object} world - 星系データ
 * @returns {Object} 旅客・郵便等の情報
 */
export function calculateTraffic(world) {
    // ※今回は基本ルールの簡略版として、UWPの人口桁からDMを擬似生成してダイスに加算します。
    // 本来は人口やスターポートで細かく算出しますが、仕様の「基本表」に則り、
    // ここでは (2D + Population - 5) などをベースにします（目安）

    // UWPから人口値 (1文字目: Starport, 2: Size, 3: Atm, 4: Hyd, 5: Pop)
    let popVal = 0;
    if (world.uwp && world.uwp.length >= 5) {
        const popChar = world.uwp[4];
        popVal = parseInt(popChar, 16) || 0; // A=10, B=11...
    }

    const trafficRoll = rollDice(2) + Math.max(0, popVal - 4);

    let passengerDice = 0;
    let freightDice = 0;

    if (trafficRoll <= 1) { passengerDice = 0; freightDice = 0; }
    else if (trafficRoll <= 3) { passengerDice = 1; freightDice = 1; }
    else if (trafficRoll <= 5) { passengerDice = 2; freightDice = 2; }
    else if (trafficRoll === 6) { passengerDice = 2; freightDice = 3; }
    else if (trafficRoll <= 8) { passengerDice = 3; freightDice = 3; }
    else if (trafficRoll <= 10) { passengerDice = 3; freightDice = 4; }
    else if (trafficRoll === 11) { passengerDice = 4; freightDice = 4; }
    else if (trafficRoll <= 13) { passengerDice = 4; freightDice = 5; }
    else if (trafficRoll === 14) { passengerDice = 5; freightDice = 5; }
    else if (trafficRoll === 15) { passengerDice = 5; freightDice = 6; }
    else if (trafficRoll === 16) { passengerDice = 6; freightDice = 6; }
    else if (trafficRoll === 17) { passengerDice = 7; freightDice = 7; }
    else if (trafficRoll === 18) { passengerDice = 8; freightDice = 8; }
    else if (trafficRoll === 19) { passengerDice = 9; freightDice = 9; }
    else { passengerDice = 10; freightDice = 10; }

    const passengers = rollDice(passengerDice);
    const freightLots = rollDice(freightDice);

    // 郵便表 (12以上で発生)
    // 貨物が高ければ郵便も出やすい。今回は単純なDMとして freightDice * 2 を加算
    const mailDM = Math.floor(freightDice / 2);
    const mailRoll = rollDice(2) + mailDM;
    const hasMail = mailRoll >= 12;

    return {
        passengers: passengers,
        freight_lots: freightLots,
        has_mail: hasMail,
        logic: `Traffic roll was ${trafficRoll} (Pop ${popVal}). Mail roll was ${mailRoll}.`
    };
}
