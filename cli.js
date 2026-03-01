import { getWorldData } from './src/api/travellerMap.js';
import { analyzeTradeRoute } from './src/logic/tradeEngine.js';

/**
 * Traveller Trade API - AI Agent CLI Tool
 * 
 * 使い方:
 * node cli.js <Sector> <OriginHex> <DestinationHex> [BrokerLevel] [MailBonus] [Language]
 * DestinationHex には "Sector:Hex" 形式で別セクターも指定可能。
 * 
 * 例:
 * node cli.js "Spinward-Marches" 2124 2125 1
 * node cli.js "Spinward-Marches" 3223 "Deneb:0124"
 */

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 3) {
        console.error("Usage: node cli.js <Sector> <OriginHex> <DestinationHex> [BrokerLevel] [MailBonus] [Language]");
        console.error("Example: node cli.js \"Spinward-Marches\" 2124 2125 1 2 ja");
        console.error("Different Sector Example: node cli.js \"Spinward-Marches\" 3223 \"Deneb:0124\"");
        process.exit(1);
    }

    const sector = args[0];
    const originHex = args[1];

    let destSector = sector;
    let destHex = args[2];
    if (destHex.includes(':')) {
        const parts = destHex.split(':');
        destSector = parts[0];
        destHex = parts[1];
    }

    let brokerLevel = 0;
    let mailBonus = 0;
    let lang = 'en';

    let aIdx = 3;
    if (args.length > aIdx && !['ja', 'en'].includes(args[aIdx])) {
        brokerLevel = parseInt(args[aIdx++], 10) || 0;
    }
    if (args.length > aIdx && !['ja', 'en'].includes(args[aIdx])) {
        mailBonus = parseInt(args[aIdx++], 10) || 0;
    }
    if (args.length > aIdx && ['ja', 'en'].includes(args[aIdx])) {
        lang = args[aIdx];
    }

    try {
        // 双方の星系データを取得
        const [originData, destData] = await Promise.all([
            getWorldData(sector, originHex),
            getWorldData(destSector, destHex)
        ]);

        // 貿易分析の実行
        const recommendations = analyzeTradeRoute(originData, destData, brokerLevel, mailBonus);

        // Web出力にあわせたローカライズ
        const localizedRecommendations = recommendations.recommendations.map(r => ({
            item: r['item_' + lang],
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

        // AI抽出用のJSONを構成
        const resultJson = {
            api_version: "1.3.0",
            status: "ready",
            language: lang,
            route_analysis: {
                origin: {
                    name: originData.name,
                    hex: originData.hex,
                    uwp: originData.uwp,
                    tradeCodes: originData.tradeCodes
                },
                destination: {
                    name: destData.name,
                    hex: destData.hex,
                    uwp: destData.uwp,
                    tradeCodes: destData.tradeCodes
                },
                recommendations: localizedRecommendations,
                traffic: recommendations.traffic
            }
        };

        // 標準出力
        console.log(JSON.stringify(resultJson, null, 2));

    } catch (error) {
        console.error("Error during trade analysis:");
        console.error(error.message);
        process.exit(1);
    }
}

main();
