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
        console.error("Usage: node cli.js <Sector> <OriginHex> <DestinationHex> [BrokerLevel]");
        console.error("Example: node cli.js \"Spinward-Marches\" 2124 2125 1");
        process.exit(1);
    }

    const sector = args[0];
    const originHex = args[1];
    const destHex = args[2];
    const brokerLevel = args.length >= 4 ? parseInt(args[3], 10) : 0;

    try {
        // 双方の星系データを取得
        const [originData, destData] = await Promise.all([
            getWorldData(sector, originHex),
            getWorldData(sector, destHex)
        ]);

        // 貿易分析の実行
        const recommendations = analyzeTradeRoute(originData, destData, brokerLevel);

        // AI抽出用のJSONを全く同じ形式で構成
        // analyzeTradeRoute の新しい戻り値形式 (recommendations, traffic含む) を展開
        const resultJson = {
            api_version: "1.0.0",
            status: "ready",
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
                recommendations: recommendations.recommendations,
                traffic: recommendations.traffic
            }
        };

        // 標準出力 (AIがパースしやすいようフォーマットして出力)
        console.log(JSON.stringify(resultJson, null, 2));

    } catch (error) {
        console.error("Error during trade analysis:");
        console.error(error.message);
        process.exit(1);
    }
}

main();
