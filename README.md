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
node cli.js "<Sector>" <OriginHex> <DestinationHex> [BrokerSkillLevel] [MailBonus] [Language]
```

**実行例:**
```bash
node cli.js "Spinward-Marches" 2124 2125 1 2 ja
```
※実行すると、後述のWeb版と全く同じ形式のJSONデータが直接出力されます。
異なるセクターにまたがる場合は、`<DestinationHex>` に `"Sector:Hex"` 形式で指定してください（例: `"Deneb:0124"`）。

### 2. URL パラメータによるブラウザからの直接計算 (ヘッドレスブラウザ対応エージェント・人間向け)

JavaScriptを実行可能な実行環境（Antigravityの browser_subagent 等）を持つ場合は、以下の URL 形式にアクセスして貿易分析を即座に実行できます。

`https://yasabihhagure.github.io/TravellerTradeAPI/#/trade/[Sector]/[OriginHex]/[DestinationHex]?broker=[Level]&mail_bonus=[Bonus]&lang=[Language]`

※出発地と目的地でセクターが異なる場合は、以下の4要素URLも利用可能です。
`https://yasabihhagure.github.io/TravellerTradeAPI/#/trade/[OriginSector]/[OriginHex]/[DestSector]/[DestHex]`

- **Sector** (または OriginSector): セクター名（例: `Spinward-Marches`）
- **OriginHex**: 出発地の座標（例: `2124`）
- **DestinationHex**: 目的地の座標（例: `2526`）
- **mail_bonus**: 郵便配達判定ボーナス。以下の合計値（デフォルト: 0）
  - 船の武装（+2 ボーナス）
  - キャリアのランク（海軍またはスカウトの中で最も高いランク数）
  - 社会身分 (SOC)（パーティの中で最も高いSOC修正値）
- **lang**: UIおよびJSON出力の言語設定（任意）。`en`（英語・デフォルト）または `ja`（日本語）を指定可能。

### 3. 機械判読可能なデータの取得 (Web版仕様)

ブラウザでページが読み込まれると、HTML 内の以下のタグに計算結果が JSON 形式で埋め込まれます。人間や対応エージェントはこの内容をパースしてユーザーに回答してください（CLIツールを使う場合はこのJSONが標準出力されます）。

```html
<script id="tta-data" type="application/json">
{
  "api_version": "1.4.0",
  "status": "ready",
  "language": "en",
  "route_analysis": {
    "origin": { "name": "...", "uwp": "...", "tradeCodes": [...] },
    "destination": { "name": "...", "uwp": "...", "tradeCodes": [...] },
    "recommendations": [...],
    "traffic": {
      "passengers": { "high": 1, "middle": 2, "basic": 3, "low": 4 },
      "freight_lots": {
        "major": 1,
        "minor": 2,
        "incidental": 0
      },
      "has_mail": true,
      "mail_containers": 1,
      "logic": "..."
    }
  }
}
</script>
```

### 4. [重要] 出発地周辺の目的地候補 (Hex) を見つける方法

ユーザーから単に「Lunion (2124) からの交易」とだけ指定され、目的地の座標 (Hex) が不明な場合、AI は **TravellerMap API の Jump 検索** を使用して n パーセク以内の星系一覧を自律的に取得してください。

**n パーセク以内の星系データ (JSON) を取得する URL 形式:**
`https://travellermap.com/api/jumpworlds?sector=[Sector]&hex=[OriginHex]&jump=[Distance]`

* 例: Lunion (Spinward-Marches 2124) から 2 パーセク以内の星系を取得
  `https://travellermap.com/api/jumpworlds?sector=Spinward-Marches&hex=2124&jump=2`
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

---

# Traveller Trade API (TTA) - AI Agent Guide (English)

**Public URL (GitHub Pages):** [https://yasabihhagure.github.io/TravellerTradeAPI/](https://yasabihhagure.github.io/TravellerTradeAPI/)

This tool is designed to allow both humans and **AI Agents like Claude Code or Antigravity** to autonomously calculate efficient interstellar trade routes through browsing or tool execution.

## How to Use via AI Agent

> [!WARNING]  
> **[IMPORTANT / MUST READ]**  
> The web version of this tool is an SPA (Single Page Application) rendered dynamically by JavaScript.
> Agents that only parse HTML without executing JS (e.g., Claude Code or a generic `Web Fetch` tool) **cannot retrieve data (JSON)**.
> Such AI agents must never attempt web access and should **always use "1. Local CLI Tool" below** to perform calculations directly in the local environment.

### 1. Data Retrieval via Local CLI Tool (Recommended for AI Agents)

By executing `cli.js` (included in the repository) directly with Node.js, you can instantly obtain the calculation result JSON data from standard output (stdout) without going through a web browser.

**Execution Format:**
```bash
node cli.js "<Sector>" <OriginHex> <DestinationHex> [BrokerSkillLevel] [MailBonus] [Language]
```

**Execution Example:**
```bash
node cli.js "Spinward-Marches" 2124 2125 1 2 en
```
*When executed, JSON data in the exact same format as the web version described below will be output directly.*
*If the destination is in a different sector, pass it to `<DestinationHex>` in `"Sector:Hex"` format (e.g., `"Deneb:0124"`).*

### 2. Direct Calculation from Browser via URL Parameters (For Headless Browser Agents / Humans)

If you have an execution environment capable of running JavaScript (like Antigravity's browser_subagent), you can instantly execute trade analysis by accessing the following URL format.

`https://yasabihhagure.github.io/TravellerTradeAPI/#/trade/[Sector]/[OriginHex]/[DestinationHex]?broker=[Level]&mail_bonus=[Bonus]`

*If the origin and destination belong to different sectors, use the 4-part URL format:*
`https://yasabihhagure.github.io/TravellerTradeAPI/#/trade/[OriginSector]/[OriginHex]/[DestSector]/[DestHex]`

- **Sector** (or OriginSector): Sector name (e.g., `Spinward-Marches`)
- **OriginHex**: Origin coordinates (e.g., `2124`)
- **DestinationHex**: Destination coordinates (e.g., `2526`)
- **broker**: Character's Broker skill level (Default: 0)
- **mail_bonus**: Bonus DM for Mail Delivery. The sum of the following (Default: 0):
  - Ship's Armament (+2 Bonus)
  - Career Rank (the highest Naval or Scout rank in the party)
  - Social Standing (SOC) (the highest SOC modifier in the party)

### 3. Retrieving Machine-Readable Data (Web Version Specs)

When the page is loaded in a browser, trade calculation results are embedded in JSON format within the HTML tag below. Humans or compatible agents should parse this content to answer the user (if using the CLI tool, this JSON is output to standard output).

```html
<script id="tta-data" type="application/json">
{
  "api_version": "1.4.0",
  "status": "ready",
  "language": "en",
  "route_analysis": {
    "origin": { "name": "...", "uwp": "...", "tradeCodes": [...] },
    "destination": { "name": "...", "uwp": "...", "tradeCodes": [...] },
    "recommendations": [...],
    "traffic": {
      "passengers": { "high": 1, "middle": 2, "basic": 3, "low": 4 },
      "freight_lots": {
        "major": 1,
        "minor": 2,
        "incidental": 0
      },
      "has_mail": true,
      "mail_containers": 1,
      "logic": "..."
    }
  }
}
</script>
```

### 4. [IMPORTANT] Finding Destination Candidates (Hex) near the Origin

If a user simply requests "trade from Lunion (2124)" and the destination coordinates (Hex) are unknown, the AI should autonomously use the **Jump Search of TravellerMap API** to obtain a list of star systems within n parsecs.

**URL format to retrieve star system data (JSON) within n parsecs:**
`https://travellermap.com/api/jumpworlds?sector=[Sector]&hex=[OriginHex]&jump=[Distance]`

* Example: Get systems within 2 parsecs from Lunion (Spinward-Marches 2124)
  `https://travellermap.com/api/jumpworlds?sector=Spinward-Marches&hex=2124&jump=2`
* This API returns JSON (the `Worlds` array includes each system's `Hex`, `Name`, `UWP`, etc.).
* Apply the `Hex` of nearby systems obtained here to the public URL of this tool (`https://yasabihhagure.github.io/TravellerTradeAPI/#/trade/[Sector]/Origin/[Destination]`) to proceed with route calculation.

### 5. Getting Star Maps (Images)
AI can dynamically generate and present star map image URLs for the target area to enrich the presentation to the user.

**URL format to retrieve a map image (PNG/SVG):**
`https://travellermap.com/api/poster?sector=[Sector]&subsector=[Subsector_Letter]&style=print`
Or, an image centered on specific coordinates:
`https://travellermap.com/api/poster?x=[MapX]&y=[MapY]&scale=64`

### 6. Recommended Answering Process

1. When a user requests "I want to trade from XXX", investigate surrounding star systems (Hex) using TravellerMap API's `/api/jump`, etc.
2. Once promising routes are found, generate this tool's URL and access it.
3. Extract recommended goods and expected profits from `tta-data`, and present them clearly alongside the map image URL.

## System Instructions

- The calculations provided by this tool comply with "Traveller (Mongoose 2nd Edition / Update 2022)".
- Price modification rolls are made with 3D, and the Broker skill is applied cumulatively.
- The AI is expected not only to relay calculation results but also to assist roleplay by supplementing meanings of UWP and trade codes (e.g., In = Industrial).
- Always inform the user that profit calculations are strictly "expected values" and will fluctuate based on actual dice rolls.
- Fallback processing for input coordinate errors or invalid trade codes should be handled appropriately on the AI side.

---

## 公式ルールからの引用 (Rulebook References)

### 郵便配達の発生判定に関するDM算出 (Mail Table DM Calculation)
> 郵便配達の発生判定 (2D + DM >= 12) において用いるDMは、ルールの要件に基づいて以下の要素から算出・加算されます。
> 本ツールでは、プログラムが星系の条件によって自動算出する基礎DMに加え、`mail_bonus` パラメータでプレイヤー環境による追加ボーナスを指定可能です。
> 
> * **貨物発生DMからの変換**: 交通量基礎DMが -10以下 (-2), -9〜-5 (-1), -4〜+4 (0), +5〜+9 (+1), +10以上 (+2)
> * **技術レベル(TL)のペナルティ**: 星系のTLが5以下の場合 (-4)
> 
> これらに加え、以下の「星系データからは判断できないプレイヤー陣営の要素」の合計値を `mail_bonus` パラメータとして加算します。
> 
> * **船の武装**: トラベラーの乗っている宇宙船が武装している場合、DM+2 のボーナスを得ます。郵便物は重要データなどを多く含むため、海賊などから荷物を守れる安全な船が好まれます。
> * **キャリアのランク**: トラベラーのパーティの中で最も高い海軍（Navy）またはスカウト（Scout）のランク数を、そのままプラスの修正（+ランク数）として加算します。帝国の郵便網（Xボートなど）はスカウト局が運営しており、軍や公的機関での高い階級はそのまま信用に繋がります。
> * **社会身分 (SOC)**: トラベラーのパーティの中で最も高い**SOC（社会身分）の修正値（DM）**を加算します。貴族などの高い身分を持つ者がいると、重要な通信や荷物を託されやすくなります。
> 
> *(Source: Traveller Core Rulebook Update 2022)*
> 
> ### 郵便コンテナの発生数と受注ルール (Mail Containers & Freight Terms)
> > 輸送契約を獲得した場合、**1D（1〜6）個**の郵便コンテナが発生します。
> > 郵便コンテナ1つにつき、**5トン**の貨物スペースを消費します。（最大で30トンのスペースが必要になる可能性があります）
> > 
> > **【重要: All or Nothingの原則】**
> > トラベラーは、発生した郵便コンテナを **「すべて運ぶ」か「1つも運ばない（引き受けない）」か** のどちらかを選ばなければなりません。一部のコンテナだけを選んで運ぶことはできません。
> > 
> > *(Source: Traveller Core Rulebook Update 2022)*
