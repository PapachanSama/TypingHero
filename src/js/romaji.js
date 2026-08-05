/**
 * Flexible Japanese Kana to Romaji Parsing Engine
 * Supports standard Hepburn, Kunrei-shiki, and keyboard variations.
 */

const KANA_ROMAJI_MAP = {
  // 50音 - あ行
  'あ': ['a'], 'い': ['i'], 'う': ['u'], 'え': ['e'], 'お': ['o'],
  // か行
  'か': ['ka'], 'き': ['ki'], 'く': ['ku'], 'け': ['ke'], 'こ': ['ko'],
  // さ行
  'さ': ['sa'], 'し': ['shi', 'si'], 'す': ['su'], 'せ': ['se'], 'そ': ['so'],
  // た行
  'た': ['ta'], 'ち': ['chi', 'ti'], 'つ': ['tsu', 'tu'], 'て': ['te'], 'と': ['to'],
  // な行
  'な': ['na'], 'に': ['ni'], 'ぬ': ['nu'], 'ね': ['ne'], 'の': ['no'],
  // は行
  'は': ['ha'], 'ひ': ['hi'], 'ふ': ['fu', 'hu'], 'へ': ['he'], 'ほ': ['ho'],
  // ま行
  'ま': ['ma'], 'み': ['mi'], 'む': ['mu'], 'め': ['me'], 'も': ['mo'],
  // や行
  'や': ['ya'], 'ゆ': ['yu'], 'よ': ['yo'],
  // ら行
  'ら': ['ra'], 'り': ['ri'], 'る': ['ru'], 'れ': ['re'], 'ろ': ['ro'],
  // わ行
  'わ': ['wa'], 'ゐ': ['wi'], 'ゑ': ['we'], 'を': ['wo'], 'ん': ['nn', 'n\'', 'n'],

  // 濁音 - が行
  'が': ['ga'], 'ぎ': ['gi'], 'ぐ': ['gu'], 'げ': ['ge'], 'ご': ['go'],
  // ざ行
  'ざ': ['za'], 'じ': ['ji', 'zi'], 'ず': ['zu'], 'ぜ': ['ze'], 'ぞ': ['zo'],
  // だ行
  'だ': ['da'], 'ぢ': ['ji', 'di'], 'づ': ['zu', 'du'], 'で': ['de'], 'ど': ['do'],
  // ば行
  'ば': ['ba'], 'び': ['bi'], 'ぶ': ['bu'], 'べ': ['be'], 'ぼ': ['bo'],
  // 半濁音 - ぱ行
  'ぱ': ['pa'], 'ぴ': ['pi'], 'ぷ': ['pu'], 'ぺ': ['pe'], 'ぽ': ['po'],

  // 拗音 (Compound Kana)
  'きゃ': ['kya'], 'きゅ': ['kyu'], 'きょ': ['kyo'],
  'しゃ': ['sha', 'sya'], 'しゅ': ['shu', 'syu'], 'しょ': ['sho', 'syo'],
  'ちゃ': ['cha', 'tya', 'cya'], 'ちゅ': ['chu', 'tyu', 'cyu'], 'ちょ': ['cho', 'tyo', 'cyo'],
  'にゃ': ['nya'], 'にゅ': ['nyu'], 'にょ': ['nyo'],
  'ひゃ': ['hya'], 'ひゅ': ['hyu'], 'ひょ': ['hyo'],
  'みゃ': ['mya'], 'みゅ': ['myu'], 'みょ': ['myo'],
  'りゃ': ['rya'], 'りゅ': ['ryu'], 'りょ': ['ryo'],
  'ぎゃ': ['gya'], 'ぎゅ': ['gyu'], 'ぎょ': ['gyo'],
  'じゃ': ['ja', 'zya', 'jya'], 'じゅ': ['ju', 'zyu', 'jyu'], 'じょ': ['jo', 'zyo', 'jyo'],
  'びゃ': ['bya'], 'びゅ': ['byu'], 'びょ': ['byo'],
  'ぴゃ': ['pya'], 'ぴゅ': ['pyu'], 'ぴょ': ['pyo'],

  // 小文字単体
  'ぁ': ['la', 'xa'], 'ぃ': ['li', 'xi'], 'ぅ': ['lu', 'xu'], 'ぇ': ['le', 'xe'], 'ぉ': ['lo', 'xo'],
  'っ': ['ltu', 'xtsu', 'xtu'], 'ゃ': ['lya', 'xya'], 'ゅ': ['lyu', 'xyu'], 'ょ': ['lyo', 'xyo'],
  
  // 記号・数字・英字
  'ー': ['-'], '〜': ['~'], '！': ['!'], '？': ['?'], '、': [','], '。': ['.'], ' ': [' '], '　': [' ']
};

/**
 * Converts Kana string into structured Romaji tokens for typing evaluation.
 * Returns array of Kana units with primary Romaji & valid alternative representations.
 */
export function parseKanaToRomajiTokens(kanaStr) {
  const tokens = [];
  let i = 0;
  
  while (i < kanaStr.length) {
    const char = kanaStr[i];
    const nextChar = kanaStr[i + 1];

    // Check for 2-character compound (拗音: きゃ, しゃ, etc.)
    if (nextChar && KANA_ROMAJI_MAP[char + nextChar]) {
      const compound = char + nextChar;
      const romajiList = KANA_ROMAJI_MAP[compound];
      tokens.push({
        kana: compound,
        romajiCandidates: romajiList,
        defaultRomaji: romajiList[0]
      });
      i += 2;
      continue;
    }

    // Check for Sokuon (っ) + Consonant
    if (char === 'っ' && nextChar) {
      // Find romaji of next unit
      let nextUnitRomaji = null;
      if (kanaStr[i + 2] && KANA_ROMAJI_MAP[nextChar + kanaStr[i + 2]]) {
        nextUnitRomaji = KANA_ROMAJI_MAP[nextChar + kanaStr[i + 2]][0];
      } else if (KANA_ROMAJI_MAP[nextChar]) {
        nextUnitRomaji = KANA_ROMAJI_MAP[nextChar][0];
      }

      if (nextUnitRomaji) {
        const doubleConsonant = nextUnitRomaji[0];
        tokens.push({
          kana: 'っ',
          romajiCandidates: [doubleConsonant, 'xtsu', 'ltu', 'xtu'],
          defaultRomaji: doubleConsonant
        });
        i += 1;
        continue;
      }
    }

    // Single Kana mapping
    if (KANA_ROMAJI_MAP[char]) {
      const romajiList = KANA_ROMAJI_MAP[char];
      tokens.push({
        kana: char,
        romajiCandidates: romajiList,
        defaultRomaji: romajiList[0]
      });
    } else {
      // English, numbers, or unmapped symbols pass through
      tokens.push({
        kana: char,
        romajiCandidates: [char.toLowerCase()],
        defaultRomaji: char.toLowerCase()
      });
    }

    i++;
  }

  return tokens;
}
