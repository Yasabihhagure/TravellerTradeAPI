/**
 * Traveller Map API (travellermap.com) から星系データを取得する
 */

const BASE_URL = 'https://travellermap.com/api/jumpworlds';

/**
 * 指定されたセクターと座標の星系データを取得する
 * @param {string} sector - セクター名 (例: "Spinward-Marches")
 * @param {string} hex - 座標 (例: "2124")
 * @returns {Promise<Object>} 星系データ
 */
export async function getWorldData(sector, hex) {
  try {
    // セクター名内のハイフンをスペースに変換（APIの仕様合わせ）
    const normalizedSector = sector.replace(/-/g, ' ');
    const url = `${BASE_URL}?sector=${encodeURIComponent(normalizedSector)}&hex=${hex}&jump=0`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // jumpworlds エンドポイントは Worlds 配列を返す
    if (!data.Worlds || data.Worlds.length === 0) {
      throw new Error(`No data received for ${normalizedSector} ${hex}`);
    }
    const world = data.Worlds[0];

    const worldName = world.Name || world.name;
    const worldUwp = world.UWP || world.uwp;
    const worldRemarks = world.Remarks || world.remarks || '';
    const worldSector = world.Sector || world.sector || normalizedSector;
    const worldHex = world.Hex || world.hex || hex;
    const worldZone = world.Zone || world.zone || '';

    if (!worldName || !worldUwp) {
      throw new Error(`Incomplete data received for ${normalizedSector} ${hex}`);
    }

    // UWP から TL (Tech Level) を抽出 (例: A995984-D -> D = 13)
    const uwpParts = worldUwp.split('-');
    const tlChar = uwpParts[1] ? uwpParts[1].charAt(0) : '0';
    const techLevel = parseInt(tlChar, 16) || 0;

    return {
      name: worldName,
      uwp: worldUwp,
      tradeCodes: worldRemarks ? worldRemarks.split(' ') : [],
      sector: worldSector,
      hex: worldHex,
      techLevel: techLevel,
      zone: worldZone
    };
  } catch (error) {
    console.error('Failed to fetch world data:', error);
    throw error;
  }
}
