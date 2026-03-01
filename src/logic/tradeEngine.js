/**
 * 貿易計算エンジン
 * 提供された「貿易関連データ集.md」に基づき、最適な商品と利益を算出する
 */

/**
 * 貿易品の定義リスト (貿易関連データ集.md より)
 */
export const TRADE_GOODS = [
    { id: '11', name_jp: '一般電子機器', name_en: 'Common Electronics', basePrice: 20000, purchaseDM: { In: 2, Ht: 3 }, saleDM: { Ni: 1, Ri: 1, As: 1 }, availability: ['All'], stockFormula: "2D*10" },
    { id: '12', name_jp: '一般工業製品', name_en: 'Common Industrial Goods', basePrice: 10000, purchaseDM: { Na: 2, In: 5 }, saleDM: { Ni: 3, Ag: 2 }, availability: ['All'], stockFormula: "2D*10" },
    { id: '13', name_jp: '一般加工品', name_en: 'Common Manufactured Goods', basePrice: 20000, purchaseDM: { Na: 2, In: 5 }, saleDM: { Ni: 3, Hi: 2 }, availability: ['All'], stockFormula: "2D*10" },
    { id: '14', name_jp: '一般原材料', name_en: 'Common Raw Materials', basePrice: 5000, purchaseDM: { Ag: 3, Ga: 2 }, saleDM: { In: 2, Po: 2 }, availability: ['All'], stockFormula: "2D*20" },
    { id: '15', name_jp: '一般消耗品', name_en: 'Common Consumables', basePrice: 500, purchaseDM: { Ag: 3, Wa: 2, Ga: 1, As: -4 }, saleDM: { As: 1, Fl: 1, Ic: 1, Hi: 1 }, availability: ['All'], stockFormula: "2D*20" },
    { id: '16', name_jp: '一般鉱石', name_en: 'Common Ore', basePrice: 1000, purchaseDM: { As: 4 }, saleDM: { In: 3, Ni: 1 }, availability: ['All'], stockFormula: "2D*20" },
    { id: '21', name_jp: '先進電子機器', name_en: 'Advanced Electronics', basePrice: 100000, purchaseDM: { In: 2, Ht: 3 }, saleDM: { Ni: 1, Ri: 2, As: 3 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '22', name_jp: '先進機械部品', name_en: 'Advanced Machine Parts', basePrice: 75000, purchaseDM: { In: 2, Ht: 1 }, saleDM: { As: 2, Ni: 1 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '23', name_jp: '先進加工品', name_en: 'Advanced Manufactured Goods', basePrice: 100000, purchaseDM: { In: 1 }, saleDM: { Hi: 1, Ri: 2 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '24', name_jp: '先進兵器', name_en: 'Advanced Weapons', basePrice: 150000, purchaseDM: { Ht: 2 }, saleDM: { Po: 1, Amber: 2, Red: 4 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '25', name_jp: '先進車両', name_en: 'Advanced Vehicles', basePrice: 180000, purchaseDM: { Ht: 2 }, saleDM: { As: 2, Ri: 2 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '26', name_jp: '生化学製品', name_en: 'Biochemicals', basePrice: 50000, purchaseDM: { Ag: 1, Wa: 2 }, saleDM: { In: 2 }, availability: ['Ag', 'Wa'], stockFormula: "1D*5" },
    { id: '31', name_jp: '貴石・結晶', name_en: 'Crystals & Gems', basePrice: 20000, purchaseDM: { As: 2, De: 1, Ic: 1 }, saleDM: { In: 3, Ri: 2 }, availability: ['As', 'De', 'Ic'], stockFormula: "1D*5" },
    { id: '32', name_jp: 'サイバネティクス', name_en: 'Cybernetics', basePrice: 250000, purchaseDM: { Ht: 1 }, saleDM: { As: 1, Ic: 1, Ri: 2 }, availability: ['Ht'], stockFormula: "1D" },
    { id: '33', name_jp: '生体動物', name_en: 'Live Animals', basePrice: 10000, purchaseDM: { Ag: 2 }, saleDM: { Lo: 3 }, availability: ['Ag', 'Ga'], stockFormula: "1D*10" },
    { id: '34', name_jp: '高級消耗品', name_en: 'Luxury Consumables', basePrice: 20000, purchaseDM: { Ag: 2, Wa: 1 }, saleDM: { Ri: 2, Hi: 2 }, availability: ['Ag', 'Ga', 'Wa'], stockFormula: "1D*10" },
    { id: '35', name_jp: '高級品', name_en: 'Luxury Goods', basePrice: 200000, purchaseDM: { Hi: 1 }, saleDM: { Ri: 4 }, availability: ['Hi'], stockFormula: "1D" },
    { id: '36', name_jp: '医療用品', name_en: 'Medical Supplies', basePrice: 50000, purchaseDM: { Ht: 2 }, saleDM: { In: 2, Po: 1, Ri: 1 }, availability: ['Ht', 'Hi'], stockFormula: "1D*5" },
    { id: '42', name_jp: '医薬品', name_en: 'Pharmaceuticals', basePrice: 100000, purchaseDM: { As: 2, Hi: 1 }, saleDM: { Ri: 2, Lt: 1 }, availability: ['As', 'De', 'Hi', 'Wa'], stockFormula: "1D" },
    { id: '43', name_jp: 'ポリマー', name_en: 'Polymers', basePrice: 7000, purchaseDM: { In: 1 }, saleDM: { Ri: 2, Ni: 1 }, availability: ['In'], stockFormula: "1D*10" },
    { id: '44', name_jp: '貴金属', name_en: 'Precious Metals', basePrice: 50000, purchaseDM: { As: 3, De: 1, Ic: 2 }, saleDM: { Ri: 3, In: 2, Ht: 1 }, availability: ['As', 'De', 'Ic', 'Fl'], stockFormula: "1D" },
    { id: '45', name_jp: '放射性物質', name_en: 'Radioactives', basePrice: 1000000, purchaseDM: { As: 2, Lo: 2 }, saleDM: { In: 3, Ht: 1, Ni: -2, Ag: -3 }, availability: ['As', 'De', 'Lo'], stockFormula: "1D" },
    { id: '46', name_jp: 'ロボット', name_en: 'Robots', basePrice: 400000, purchaseDM: { In: 1 }, saleDM: { Ag: 2, Ht: 1 }, availability: ['In'], stockFormula: "1D*5" },
    { id: '51', name_jp: '香辛料', name_en: 'Spices', basePrice: 6000, purchaseDM: { De: 2 }, saleDM: { Hi: 2, Ri: 3, Po: 3 }, availability: ['Ga', 'De', 'Wa'], stockFormula: "1D*10" },
    { id: '52', name_jp: '繊維製品', name_en: 'Textiles', basePrice: 3000, purchaseDM: { Ag: 7 }, saleDM: { Hi: 3, Na: 2 }, availability: ['Ag', 'Ni'], stockFormula: "1D*20" },
    { id: '53', name_jp: '希少鉱石', name_en: 'Uncommon Ore', basePrice: 5000, purchaseDM: { As: 4 }, saleDM: { In: 3, Ni: 1 }, availability: ['As', 'Ic'], stockFormula: "1D*20" },
    { id: '54', name_jp: '希少原材料', name_en: 'Uncommon Raw Materials', basePrice: 20000, purchaseDM: { Ag: 2, Wa: 1 }, saleDM: { In: 2, Ht: 1 }, availability: ['Ag', 'De', 'Wa'], stockFormula: "1D*10" },
    { id: '55', name_jp: '木材', name_en: 'Wood', basePrice: 1000, purchaseDM: { Ag: 6 }, saleDM: { Ri: 2, In: 1 }, availability: ['Ag', 'Ga'], stockFormula: "1D*20" },
    { id: '56', name_jp: '車両', name_en: 'Vehicles', basePrice: 15000, purchaseDM: { In: 2, Ht: 1 }, saleDM: { Ni: 2, Hi: 1 }, availability: ['In', 'Ht'], stockFormula: "1D*10" }
];

/**
 * 貿易コードのローカライズ情報
 */
export const TRADE_CODES_INFO = {
    Ag: { name_en: 'Agricultural', name_jp: '農業', desc_en: 'Atm 4-9, Hyd 5-7, Pop 5-7', desc_jp: '大気 4-9, 水圏 5-7, 人口 5-7' },
    As: { name_en: 'Asteroid', name_jp: '小惑星', desc_en: 'Size 0, Atm 0, Hyd 0', desc_jp: '直径 0, 大気 0, 水圏 0' },
    Ba: { name_en: 'Barren', name_jp: '不毛', desc_en: 'Pop 0, Gov 0, Law 0', desc_jp: '人口 0, 政府 0, 法律 0' },
    De: { name_en: 'Desert', name_jp: '砂漠', desc_en: 'Atm 2-9, Hyd 0', desc_jp: '大気 2-9, 水圏 0' },
    Fl: { name_en: 'Fluid Oceans', name_jp: '流体海', desc_en: 'Atm 10+, Hyd 1+', desc_jp: '大気 10+, 水圏 1+' },
    Ga: { name_en: 'Garden', name_jp: '楽園', desc_en: 'Size 6-8, Atm 5,6,8, Hyd 5-7', desc_jp: '直径 6-8, 大気 5,6,8, 水圏 5-7' },
    Hi: { name_en: 'High Population', name_jp: '高人口', desc_en: 'Pop 9+', desc_jp: '人口 9+' },
    Ht: { name_en: 'High Tech', name_jp: 'ハイテク', desc_en: 'TL 12+', desc_jp: 'TL 12+' },
    Ic: { name_en: 'Ice-Capped', name_jp: '氷結', desc_en: 'Atm 0-1, Hyd 1+', desc_jp: '大気 0-1, 水圏 1+' },
    In: { name_en: 'Industrial', name_jp: '工業', desc_en: 'Atm 0-2, 4, 7, 9-12, Pop 9+', desc_jp: '大気 0-2, 4, 7, 9-12, 人口 9+' },
    Lo: { name_en: 'Low Population', name_jp: '低人口', desc_en: 'Pop 1-3', desc_jp: '人口 1-3' },
    Lt: { name_en: 'Low Tech', name_jp: 'ローテク', desc_en: 'TL <= 5', desc_jp: 'TL 5以下' },
    Na: { name_en: 'Non-Agricultural', name_jp: '非農業', desc_en: 'Atm 0-3, Hyd 0-3, Pop 6+', desc_jp: '大気 0-3, 水圏 0-3, 人口 6+' },
    Ni: { name_en: 'Non-Industrial', name_jp: '非工業', desc_en: 'Pop 4-6', desc_jp: '人口 4-6' },
    Po: { name_en: 'Poor', name_jp: '貧困', desc_en: 'Atm 2-5, Hyd 0-3', desc_jp: '大気 2-5, 水圏 0-3' },
    Ri: { name_en: 'Rich', name_jp: '富裕', desc_en: 'Atm 6,8, Pop 6-8, Gov 4-9', desc_jp: '大気 6,8, 人口 6-8, 政府 4-9' },
    Va: { name_en: 'Vacuum', name_jp: '真空', desc_en: 'Atm 0', desc_jp: '大気 0' },
    Wa: { name_en: 'Water World', name_jp: '海洋', desc_en: 'Hyd 10+', desc_jp: '水圏 10+' },
};

export const PASSENGER_TYPES_INFO = {
    high: { name_en: 'High', name_jp: 'High / 特等' },
    middle: { name_en: 'Middle', name_jp: 'Middle / 1等' },
    basic: { name_en: 'Basic', name_jp: 'Basic / 2等' },
    low: { name_en: 'Low', name_jp: 'Low / 冷凍' },
};


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
            item_en: item.name_en,
            item_jp: item.name_jp,
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
 * 旅客用ダイス数取得ヘルパー
 */
function getPassengerDice(trafficRoll) {
    if (trafficRoll <= 1) return 0;
    if (trafficRoll <= 3) return 1;
    if (trafficRoll <= 5) return 2;
    if (trafficRoll === 6) return 2;
    if (trafficRoll <= 8) return 3;
    if (trafficRoll <= 10) return 3;
    if (trafficRoll === 11) return 4;
    if (trafficRoll <= 13) return 4;
    if (trafficRoll === 14) return 5;
    if (trafficRoll === 15) return 5;
    if (trafficRoll === 16) return 6;
    if (trafficRoll === 17) return 7;
    if (trafficRoll === 18) return 8;
    if (trafficRoll === 19) return 9;
    return 10;
}

/**
 * 貨物用ダイス数取得ヘルパー
 */
function getFreightDice(trafficRoll) {
    if (trafficRoll <= 1) return 0;
    if (trafficRoll <= 3) return 1;
    if (trafficRoll <= 5) return 2;
    if (trafficRoll === 6) return 3;
    if (trafficRoll <= 8) return 3;
    if (trafficRoll <= 10) return 4;
    if (trafficRoll === 11) return 4;
    if (trafficRoll <= 13) return 5;
    if (trafficRoll === 14) return 5;
    if (trafficRoll === 15) return 6;
    if (trafficRoll === 16) return 6;
    if (trafficRoll === 17) return 7;
    if (trafficRoll === 18) return 8;
    if (trafficRoll === 19) return 9;
    return 10;
}

/**
 * 星系の人口に基づく旅客・貨物の発生ダイス数を算出
 * @param {Object} world - 星系データ
 * @returns {Object} 旅客・郵便等の情報
 */
export function calculateTraffic(world) {
    // UWPから人口値 (1文字目: Starport, 2: Size, 3: Atm, 4: Hyd, 5: Pop)
    let popVal = 0;
    if (world.uwp && world.uwp.length >= 5) {
        const popChar = world.uwp[4];
        popVal = parseInt(popChar, 16) || 0; // A=10, B=11...
    }

    const popDM = Math.max(0, popVal - 4);

    // それぞれの旅客クラスごとに独立して 2D + 共通DM + クラス固有DM を判定
    // 固有DM: High(-4), Middle(0), Basic(0), Low(+1)
    const highRoll = Math.max(0, rollDice(2) + popDM - 4);
    const middleRoll = Math.max(0, rollDice(2) + popDM);
    const basicRoll = Math.max(0, rollDice(2) + popDM);
    const lowRoll = Math.max(0, rollDice(2) + popDM + 1);

    // 貨物用 (共通ルール)
    const freightRoll = Math.max(0, rollDice(2) + popDM);

    const passengers = {
        high: rollDice(getPassengerDice(highRoll)),
        middle: rollDice(getPassengerDice(middleRoll)),
        basic: rollDice(getPassengerDice(basicRoll)),
        low: rollDice(getPassengerDice(lowRoll))
    };

    const freightLots = rollDice(getFreightDice(freightRoll));

    // 郵便表 (12以上で発生)
    const mailDM = Math.floor(getFreightDice(freightRoll) / 2);
    const mailRoll = rollDice(2) + mailDM;
    const hasMail = mailRoll >= 12;

    return {
        passengers: passengers,
        freight_lots: freightLots,
        has_mail: hasMail,
        logic: `Traffic rolls (H/M/B/L/F): ${highRoll}/${middleRoll}/${basicRoll}/${lowRoll}/${freightRoll}. Mail roll: ${mailRoll}.`
    };
}
