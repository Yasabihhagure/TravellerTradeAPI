/**
 * 貿易計算エンジン
 * 提供された「貿易関連データ集.md」に基づき、最適な商品と利益を算出する
 */

/**
 * 貿易品の定義リスト (貿易関連データ集.md より)
 */
export const TRADE_GOODS = [
    { id: '11', name_ja: '一般電子機器', name_en: 'Common Electronics', basePrice: 20000, purchaseDM: { In: 2, Ht: 3 }, saleDM: { Ni: 1, Ri: 1, As: 1 }, availability: ['All'], stockFormula: "2D*10" },
    { id: '12', name_ja: '一般工業製品', name_en: 'Common Industrial Goods', basePrice: 10000, purchaseDM: { Na: 2, In: 5 }, saleDM: { Ni: 3, Ag: 2 }, availability: ['All'], stockFormula: "2D*10" },
    { id: '13', name_ja: '一般加工品', name_en: 'Common Manufactured Goods', basePrice: 20000, purchaseDM: { Na: 2, In: 5 }, saleDM: { Ni: 3, Hi: 2 }, availability: ['All'], stockFormula: "2D*10" },
    { id: '14', name_ja: '一般原材料', name_en: 'Common Raw Materials', basePrice: 5000, purchaseDM: { Ag: 3, Ga: 2 }, saleDM: { In: 2, Po: 2 }, availability: ['All'], stockFormula: "2D*20" },
    { id: '15', name_ja: '一般消耗品', name_en: 'Common Consumables', basePrice: 500, purchaseDM: { Ag: 3, Wa: 2, Ga: 1, As: -4 }, saleDM: { As: 1, Fl: 1, Ic: 1, Hi: 1 }, availability: ['All'], stockFormula: "2D*20" },
    { id: '16', name_ja: '一般鉱石', name_en: 'Common Ore', basePrice: 1000, purchaseDM: { As: 4 }, saleDM: { In: 3, Ni: 1 }, availability: ['All'], stockFormula: "2D*20" },
    { id: '21', name_ja: '先進電子機器', name_en: 'Advanced Electronics', basePrice: 100000, purchaseDM: { In: 2, Ht: 3 }, saleDM: { Ni: 1, Ri: 2, As: 3 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '22', name_ja: '先進機械部品', name_en: 'Advanced Machine Parts', basePrice: 75000, purchaseDM: { In: 2, Ht: 1 }, saleDM: { As: 2, Ni: 1 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '23', name_ja: '先進加工品', name_en: 'Advanced Manufactured Goods', basePrice: 100000, purchaseDM: { In: 1 }, saleDM: { Hi: 1, Ri: 2 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '24', name_ja: '先進兵器', name_en: 'Advanced Weapons', basePrice: 150000, purchaseDM: { Ht: 2 }, saleDM: { Po: 1, Amber: 2, Red: 4 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '25', name_ja: '先進車両', name_en: 'Advanced Vehicles', basePrice: 180000, purchaseDM: { Ht: 2 }, saleDM: { As: 2, Ri: 2 }, availability: ['In', 'Ht'], stockFormula: "1D*5" },
    { id: '26', name_ja: '生化学製品', name_en: 'Biochemicals', basePrice: 50000, purchaseDM: { Ag: 1, Wa: 2 }, saleDM: { In: 2 }, availability: ['Ag', 'Wa'], stockFormula: "1D*5" },
    { id: '31', name_ja: '貴石・結晶', name_en: 'Crystals & Gems', basePrice: 20000, purchaseDM: { As: 2, De: 1, Ic: 1 }, saleDM: { In: 3, Ri: 2 }, availability: ['As', 'De', 'Ic'], stockFormula: "1D*5" },
    { id: '32', name_ja: 'サイバネティクス', name_en: 'Cybernetics', basePrice: 250000, purchaseDM: { Ht: 1 }, saleDM: { As: 1, Ic: 1, Ri: 2 }, availability: ['Ht'], stockFormula: "1D" },
    { id: '33', name_ja: '生体動物', name_en: 'Live Animals', basePrice: 10000, purchaseDM: { Ag: 2 }, saleDM: { Lo: 3 }, availability: ['Ag', 'Ga'], stockFormula: "1D*10" },
    { id: '34', name_ja: '高級消耗品', name_en: 'Luxury Consumables', basePrice: 20000, purchaseDM: { Ag: 2, Wa: 1 }, saleDM: { Ri: 2, Hi: 2 }, availability: ['Ag', 'Ga', 'Wa'], stockFormula: "1D*10" },
    { id: '35', name_ja: '高級品', name_en: 'Luxury Goods', basePrice: 200000, purchaseDM: { Hi: 1 }, saleDM: { Ri: 4 }, availability: ['Hi'], stockFormula: "1D" },
    { id: '36', name_ja: '医療用品', name_en: 'Medical Supplies', basePrice: 50000, purchaseDM: { Ht: 2 }, saleDM: { In: 2, Po: 1, Ri: 1 }, availability: ['Ht', 'Hi'], stockFormula: "1D*5" },
    { id: '42', name_ja: '医薬品', name_en: 'Pharmaceuticals', basePrice: 100000, purchaseDM: { As: 2, Hi: 1 }, saleDM: { Ri: 2, Lt: 1 }, availability: ['As', 'De', 'Hi', 'Wa'], stockFormula: "1D" },
    { id: '43', name_ja: 'ポリマー', name_en: 'Polymers', basePrice: 7000, purchaseDM: { In: 1 }, saleDM: { Ri: 2, Ni: 1 }, availability: ['In'], stockFormula: "1D*10" },
    { id: '44', name_ja: '貴金属', name_en: 'Precious Metals', basePrice: 50000, purchaseDM: { As: 3, De: 1, Ic: 2 }, saleDM: { Ri: 3, In: 2, Ht: 1 }, availability: ['As', 'De', 'Ic', 'Fl'], stockFormula: "1D" },
    { id: '45', name_ja: '放射性物質', name_en: 'Radioactives', basePrice: 1000000, purchaseDM: { As: 2, Lo: 2 }, saleDM: { In: 3, Ht: 1, Ni: -2, Ag: -3 }, availability: ['As', 'De', 'Lo'], stockFormula: "1D" },
    { id: '46', name_ja: 'ロボット', name_en: 'Robots', basePrice: 400000, purchaseDM: { In: 1 }, saleDM: { Ag: 2, Ht: 1 }, availability: ['In'], stockFormula: "1D*5" },
    { id: '51', name_ja: '香辛料', name_en: 'Spices', basePrice: 6000, purchaseDM: { De: 2 }, saleDM: { Hi: 2, Ri: 3, Po: 3 }, availability: ['Ga', 'De', 'Wa'], stockFormula: "1D*10" },
    { id: '52', name_ja: '繊維製品', name_en: 'Textiles', basePrice: 3000, purchaseDM: { Ag: 7 }, saleDM: { Hi: 3, Na: 2 }, availability: ['Ag', 'Ni'], stockFormula: "1D*20" },
    { id: '53', name_ja: '希少鉱石', name_en: 'Uncommon Ore', basePrice: 5000, purchaseDM: { As: 4 }, saleDM: { In: 3, Ni: 1 }, availability: ['As', 'Ic'], stockFormula: "1D*20" },
    { id: '54', name_ja: '希少原材料', name_en: 'Uncommon Raw Materials', basePrice: 20000, purchaseDM: { Ag: 2, Wa: 1 }, saleDM: { In: 2, Ht: 1 }, availability: ['Ag', 'De', 'Wa'], stockFormula: "1D*10" },
    { id: '55', name_ja: '木材', name_en: 'Wood', basePrice: 1000, purchaseDM: { Ag: 6 }, saleDM: { Ri: 2, In: 1 }, availability: ['Ag', 'Ga'], stockFormula: "1D*20" },
    { id: '56', name_ja: '車両', name_en: 'Vehicles', basePrice: 15000, purchaseDM: { In: 2, Ht: 1 }, saleDM: { Ni: 2, Hi: 1 }, availability: ['In', 'Ht'], stockFormula: "1D*10" }
];

/**
 * 貿易コードのローカライズ情報
 */
export const TRADE_CODES_INFO = {
    // Climate
    Co: { name_en: 'Cold World', name_ja: '寒冷' },
    Fr: { name_en: 'Frozen World', name_ja: '極寒' },
    Ho: { name_en: 'Hot World', name_ja: '灼熱' },
    Tr: { name_en: 'Tropic World', name_ja: '熱帯' },
    Tu: { name_en: 'Tundra World', name_ja: 'ツンドラ' },
    // Economic
    Na: { name_en: 'Non-Agricultural', name_ja: '非農業' },
    Pa: { name_en: 'Pre-Agricultural', name_ja: '前農業' },
    Pi: { name_en: 'Pre-Industrial', name_ja: '前工業' },
    Pr: { name_en: 'Pre-Rich', name_ja: '前富裕' },
    Ri: { name_en: 'Rich', name_ja: '富裕' },
    Ag: { name_en: 'Agricultural', name_ja: '農業' },
    In: { name_en: 'Industrial', name_ja: '工業' },
    // Planetary
    As: { name_en: 'Asteroid Belt', name_ja: '小惑星帯' },
    De: { name_en: 'Desert', name_ja: '砂漠' },
    Fl: { name_en: 'Fluid Oceans', name_ja: '流体海' },
    Ga: { name_en: 'Garden', name_ja: '楽園' },
    He: { name_en: 'Hellworld', name_ja: '地獄' },
    Ic: { name_en: 'Ice-Capped', name_ja: '氷結' },
    Lk: { name_en: 'Locked', name_ja: '同期自転' },
    Oc: { name_en: 'Ocean World', name_ja: '大海' },
    Po: { name_en: 'Poor', name_ja: '貧困' },
    Tz: { name_en: 'Twilight Zone', name_ja: 'トワイライトゾーン' },
    Va: { name_en: 'Vacuum', name_ja: '真空' },
    Wa: { name_en: 'Water World', name_ja: '海洋' },
    // Political
    Cp: { name_en: 'Subsector Capital', name_ja: 'サブセクター首都' },
    Cs: { name_en: 'Sector Capital', name_ja: 'セクター首都' },
    Cx: { name_en: 'Imperial Capital', name_ja: '帝国首都' },
    Cy: { name_en: 'Colony', name_ja: '植民地' },
    // Population
    Ba: { name_en: 'Barren', name_ja: '不毛' },
    Di: { name_en: 'Die Back', name_ja: '衰退' },
    Hi: { name_en: 'High Population', name_ja: '高人口' },
    Lo: { name_en: 'Low Population', name_ja: '低人口' },
    Ni: { name_en: 'Non-Industrial', name_ja: '非工業' },
    Ph: { name_en: 'Pre-High Population', name_ja: '前高人口' },
    // Secondary / Others
    Fa: { name_en: 'Farming', name_ja: '農耕' },
    Ht: { name_en: 'High Tech', name_ja: 'ハイテク' },
    Lt: { name_en: 'Low Tech', name_ja: 'ローテク' },
    Mi: { name_en: 'Mining', name_ja: '鉱業' },
    Mr: { name_en: 'Military Rule', name_ja: '軍政' },
    Pe: { name_en: 'Penal Colony', name_ja: '流刑地' },
    Px: { name_en: 'Prison Camp', name_ja: '収容所' },
    Re: { name_en: 'Red Zone / Reserve', name_ja: 'レッドゾーン / 保護区' },
    // Special
    Ab: { name_en: 'Data Repository', name_ja: 'データ保管庫' },
    An: { name_en: 'Ancients Site', name_ja: 'エンシェント遺跡' },
    Ax: { name_en: 'Construct', name_ja: '人工天体' },
    Da: { name_en: 'Dangerous', name_ja: '危険' },
    Fo: { name_en: 'Forbidden', name_ja: '禁断' },
    Pz: { name_en: 'Puzzle', name_ja: '謎' },
    Rs: { name_en: 'Research Station', name_ja: '研究所' },
    Sa: { name_en: 'Satellite', name_ja: '衛星' },
    Xb: { name_en: 'X-Boat Station', name_ja: 'Xボートステーション' },
};

export const PASSENGER_TYPES_INFO = {
    high: { name_en: 'High', name_ja: '特等' },
    middle: { name_en: 'Middle', name_ja: '1等' },
    basic: { name_en: 'Basic', name_ja: '2等' },
    low: { name_en: 'Low', name_ja: '冷凍' },
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
 * @param {number} mailBonus - 郵便配達判定用ボーナス（デフォルト0）
 * @returns {Object} 分析結果
 */
export function analyzeTradeRoute(origin, destination, brokerLevel = 0, mailBonus = 0) {
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
            item_ja: item.name_ja,
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
        traffic: calculateTraffic(origin, mailBonus)
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
 * 星系のUWP等に基づく旅客・貨物・郵便の発生ダイス数を算出
 * @param {Object} world - 星系データ
 * @param {number} mailBonus - 郵便配達判定用ボーナス（武装、ランク等）
 * @returns {Object} 旅客・郵便等の情報
 */
export function calculateTraffic(world, mailBonus = 0) {
    let popVal = 0;
    let starport = 'X';
    let tlVal = 0;

    if (world.uwp && world.uwp.length >= 7) {
        starport = world.uwp[0].toUpperCase();
        popVal = parseInt(world.uwp[4], 16) || 0;

        const dashIdx = world.uwp.indexOf('-');
        if (dashIdx !== -1 && world.uwp.length > dashIdx + 1) {
            tlVal = parseInt(world.uwp.substring(dashIdx + 1), 16) || 0;
        }
    }

    // Traffic DM (交通量修正値) の計算
    let trafficDM = 0;
    if (popVal <= 1) trafficDM -= 4;
    else if (popVal === 6 || popVal === 7) trafficDM += 1;
    else if (popVal >= 8) trafficDM += 3;

    if (starport === 'A') trafficDM += 2;
    else if (starport === 'B') trafficDM += 1;
    else if (starport === 'E') trafficDM -= 1;
    else if (starport === 'X') trafficDM -= 3;

    if (tlVal <= 6) trafficDM -= 1;
    else if (tlVal >= 9) trafficDM += 2;

    // 旅客判定 (2D + Traffic DM + クラス別DM)
    const highRoll = Math.max(0, rollDice(2) + trafficDM - 4);
    const middleRoll = Math.max(0, rollDice(2) + trafficDM);
    const basicRoll = Math.max(0, rollDice(2) + trafficDM);
    const lowRoll = Math.max(0, rollDice(2) + trafficDM + 1);

    // 貨物判定 (2D + Traffic DM)
    const freightRoll = Math.max(0, rollDice(2) + trafficDM);

    const passengers = {
        high: rollDice(getPassengerDice(highRoll)),
        middle: rollDice(getPassengerDice(middleRoll)),
        basic: rollDice(getPassengerDice(basicRoll)),
        low: rollDice(getPassengerDice(lowRoll))
    };

    const freightLots = rollDice(getFreightDice(freightRoll));

    // 郵便判定 (Mail DM)
    let baseMailDM = 0;
    if (trafficDM <= -10) baseMailDM = -2;
    else if (trafficDM <= -5) baseMailDM = -1;
    else if (trafficDM <= 4) baseMailDM = 0;
    else if (trafficDM <= 9) baseMailDM = 1;
    else baseMailDM = 2;

    if (tlVal <= 5) {
        baseMailDM -= 4;
    }

    const totalMailDM = baseMailDM + mailBonus;
    const mailRoll = rollDice(2) + totalMailDM;
    const hasMail = mailRoll >= 12;

    return {
        passengers: passengers,
        freight_lots: freightLots,
        has_mail: hasMail,
        logic: `Traffic DM: ${trafficDM}, Traffic rolls (H/M/B/L/F): ${highRoll}/${middleRoll}/${basicRoll}/${lowRoll}/${freightRoll} | Mail roll: 2D+${totalMailDM} = ${mailRoll}`
    };
}
