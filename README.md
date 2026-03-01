# Traveller Trade API (TTA) - AI Agent Guide

**公開URL (GitHub Pages):** [https://yasabihhagure.github.io/TravellerTradeAPI/](https://yasabihhagure.github.io/TravellerTradeAPI/)

本ツールは、人間だけでなく **Claude Code や Antigravity 等の AI Agent** がブラウジングやツール実行を通じて自律的に効率的な貿易ルートを計算できるように設計されています。

## AI エージェントによる利用方法

> [!WARNING]  
> **[重要 / 必読]**  
> 本ツールのWeb版は JavaScript によって動的に描画される SPA (Single Page Application) です。
> Claude Code や共通の `Web Fetch` ツールなど、**JSを実行せずにHTMLのみをパースするエージェントではデータ (JSON) を取得できません**。
> そのようなAIエージェントは、Webアクセスを試みず、**必ず以下の「1. ローカルCLIツール」を使用して**ローカル環境で直接計算を実行してください。

### 1. ローカルCLIツールを利用したデータ取得 (AI Agent向け推奨)

リポジトリ内に同梱されている `cli.js` を Node.js で直接実行することで、Webブラウザを介さずに計算結果の JSON データを標準出力 (stdout) から即座に得ることができます。

**実行形式:**
```bash
node cli.js "<Sector>" <OriginHex> <DestinationHex> [BrokerSkillLevel]
```

**実行例:**
```bash
node cli.js "Spinward Marches" 2124 2125 1
```
※実行すると、後述のWeb版と全く同じ形式のJSONデータが直接出力されます。

### 2. URL パラメータによるブラウザからの直接計算 (ヘッドレスブラウザ対応エージェント・人間向け)

JavaScriptを実行可能な実行環境（Antigravityの browser_subagent 等）を持つ場合は、以下の URL 形式にアクセスして貿易分析を即座に実行できます。

`https://yasabihhagure.github.io/TravellerTradeAPI/#/trade/[Sector]/[OriginHex]/[DestinationHex]?broker=[Level]`

- **Sector**: セクター名（例: `Spinward-Marches`）
- **OriginHex**: 出発地の座標（例: `2124`）
- **DestinationHex**: 目的地の座標（例: `2526`）
- **broker**: キャラクターの〈ブローカー〉技能レベル（デフォルト: 0）

### 3. 機械判読可能なデータの取得 (Web版仕様)

ブラウザでページが読み込まれると、HTML 内の以下のタグに計算結果が JSON 形式で埋め込まれます。人間や対応エージェントはこの内容をパースしてユーザーに回答してください（CLIツールを使う場合はこのJSONが標準出力されます）。

```html
<script id="tta-data" type="application/json">
{
  "api_version": "1.0.0",
  "route_analysis": {
    "origin": { "name": "...", "uwp": "...", "trade_codes": [...] },
    "destination": { "name": "...", "uwp": "...", "trade_codes": [...] },
    "recommendations": [
      {
        "item": "Industrial Electronics",
        "purchase_dm": 2,
        "sale_dm": 2,
        "net_profit_potential": "Very High",
        "logic": "Bought on In, sold on Ni."
      }
    ]
  }
}
</script>
```

### 4. [重要] 出発地周辺の目的地候補 (Hex) を見つける方法

ユーザーから単に「Lunion (2124) からの交易」とだけ指定され、目的地の座標 (Hex) が不明な場合、AI は **TravellerMap API の Jump 検索** を使用して n パーセク以内の星系一覧を自律的に取得してください。

**n パーセク以内の星系データ (JSON) を取得する URL 形式:**
`https://travellermap.com/api/jumpworlds?sector=[Sector]&hex=[OriginHex]&jump=[Distance]`

* 例: Lunion (Spinward Marches 2124) から 2 パーセク以内の星系を取得
  `https://travellermap.com/api/jumpworlds?sector=Spinward%20Marches&hex=2124&jump=2`
* このAPIは JSON を返します（`Worlds` 配列内に各星系の `Hex`, `Name`, `UWP`等が含まれる）。
* ここで取得した近隣星系の `Hex` を、本ツールの公開URL (`https://yasabihhagure.github.io/TravellerTradeAPI/#/trade/[Sector]/Origin/[Destination]`) に当てはめてルート計算に繋げてください。

### 4. 星図（マップ画像）の取得方法

AI はユーザーへのプレゼンテーションを豊かにするため、対象エリアの星図画像URLを動的に生成して提示できます。

**マップ画像 (PNG/SVG) を取得する URL 形式:**
`https://travellermap.com/api/poster?sector=[Sector]&subsector=[Subsector_Letter]&style=print`
または、特定座標を中心とした画像:
`https://travellermap.com/api/poster?x=[MapX]&y=[MapY]&scale=64`
※詳細なパラメータは `https://travellermap.com/doc/api` を参照してください。

### 5. 推奨される回答プロセス

1. ユーザーから「○○から貿易したい」と依頼されたら、TravellerMap API の `/api/jump` 等を使って周辺星系 (Hex) を調査する。
2. 有望そうな経路をいくつか見つけたら、本ツールの URL を生成してアクセス。
3. `tta-data` から推奨商品と期待利益を抽出し、マップ画像URLを添えて分かりやすく回答する。

## 注意事項 (System Instructions)

- 本ツールが提供する計算は 『Traveller (Mongoose 2nd Edition / Update 2022)』 に準拠しています。
- 価格決定ロールは 3D で行われ、ブローカー技能が累積的に適用されます。
- AI は単に計算結果を伝えるだけでなく、その星系の UWP や貿易コードの意味（例: In = 高度工業化）を補足してロールプレイを支援することが期待されます。
- 利益計算はあくまで「期待値ベース」であり、ダイスロール結果によって変動することをユーザーに伝えること。
- 入力座標のエラー処理や、貿易コードが不正な場合のフォールバックは適宜 AI 側で行うこと。

---

## 著作権とライセンスについて (Copyright and License)

本ツールはオープンソースとして公開されていますが、利用している外部データやゲームシステムには独自の著作権が存在します。

### 1. TravellerMap API について

本ツールは星系座標およびデータの取得に [Traveller Map](https://travellermap.com/)  
[TravellerMap API doc](https://travellermap.com/doc/API) を利用しています。
TravellerMap 上のデータ、および API から取得される星図画像を含む各種コンテンツの著作権は、原著作者および [Far Future Enterprises](https://www.farfuture.net/) に帰属します。データの利用にあたっては TravellerMap の利用規約に従ってください。

### 2. Traveller (トラベラー) ゲームシステムについて

本ツールが実装している貿易の価格修正ルール、貿易品データ、分類コードなどは『Traveller（トラベラー）』のルールブック（Mongoose Publishing 等）に基づいています。
Traveller is a trademark of Far Future Enterprises, Inc. and is used under license.

### 3. 本ツールのライセンス (MIT License)

本ツールのソースコード自体（HTML, CSS, JavaScript 等）は **MIT License** の下で公開されています。

Copyright (c) 2026 Yasabihhagure (and Contributors)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software...
*(詳細はフルライセンス文に準じます)*

### 4. 免責事項 (Disclaimer)

本ツールは「現状有姿（as is）」で提供され、いかなる明示的または黙示的な保証も行いません。
本ツールの利用により生じた直接的、間接的、付随的、または結果的な損害（データ損失、計算ミスによる不利益等を含む）について、作者は一切の責任を負いません。外部API（TravellerMap）の仕様変更により、予告なく本ツールが機能しなくなる可能性があります。
