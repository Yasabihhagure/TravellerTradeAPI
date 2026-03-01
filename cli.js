import { getWorldData } from './src/api/travellerMap.js';
import { analyzeTradeRoute } from './src/logic/tradeEngine.js';

/**
 * Traveller Trade API - AI Agent CLI Tool
 * 
 * 使い方:
 * node cli.js <Sector> <OriginHex> <DestinationHex> [BrokerLevel]
 * 
 * 例:
 * node cli.js "Spinward-Marches" 2124 2125 1
 */

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 3) {
        console.error("Usage: node cli.js <Sector> <OriginHex> <DestinationHex> [BrokerLevel] [Language]");
        console.error("Example: node cli.js \"Spinward-Marches\" 2124 2125 1 ja");
        process.exit(1);
    }

    const sector = args[0];
    const originHex = args[1];
    const destHex = args[2];
    const brokerLevel = args.length >= 4 ? parseInt(args[3], 10) : 0;
    const lang = (args.length >= 5 && args[4] === 'ja') ? 'ja' : 'en';

    try {
        // 双方の星系データを取得
        const [originData, destData] = await Promise.all([
            getWorldData(sector, originHex),
            getWorldData(sector, destHex)
        ]);

        // 貿易分析の実行
        const recommendations = analyzeTradeRoute(originData, destData, brokerLevel);

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
            api_version: "1.1.0",
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
