/**
 * Japanese Practice Dataset for 6 Stages
 * Includes Detailed Playgram-style Positional Lessons,
 * 10-Row Hiragana Word Lists (A-gyo to Wa-gyo),
 * and dynamic external loader configuration for Long Passages.
 */

export const PRACTICE_DATA = {
  // Mode 1: 各ポジション練習
  positionCategories: [
    {
      id: 'home',
      name: 'ホームポジション',
      lessons: [
        { title: '左手ホーム (a s d f)', kana: 'あさだふあさだふ', display: 'あさだふ あさだふ' },
        { title: '右手ホーム (j k l ;)', kana: 'じかけりじかけり', display: 'じかけり じかけり' },
        { title: '両手基本 (f j d k s l a ;)', kana: 'ふじてきさりあれふじてき', display: 'ふじ てき さり あれ' }
      ]
    },
    {
      id: 'top',
      name: '上段ポジション',
      lessons: [
        { title: '左手上段 (q w e r t)', kana: 'たていすかんたていすかん', display: 'たていすかん たていすかん' },
        { title: '右手上段 (y u i o p)', kana: 'んなにせらんなにせら', display: 'んなにせら んなにせら' },
        { title: '上段まとめ (q~p)', kana: 'たていすかんなにせら', display: 'たていすかん なにせら' }
      ]
    },
    {
      id: 'bottom',
      name: '下段ポジション',
      lessons: [
        { title: '左手下段 (z x c v b)', kana: 'つさそひこつさそひこ', display: 'つさそひこ つさそひこ' },
        { title: '右手下段 (n m , .)', kana: 'みもねるみもねる', display: 'みもねる みもねる' },
        { title: '下段まとめ (z~.)', kana: 'つさそひこみもねる', display: 'つさそひこ みもねる' }
      ]
    },
    {
      id: 'gojuon',
      name: '50音・指別練習',
      lessons: [
        { title: 'あ行 (あいうえお)', kana: 'あいうえおあいうえお', display: 'あいうえお あいうえお' },
        { title: 'か行 (かきくけこ)', kana: 'かきくけこかきくけこ', display: 'かきくけこ かきくけこ' },
        { title: 'さ行 (さしすせそ)', kana: 'さしすせそさしすせそ', display: 'さしすせそ さしすせそ' },
        { title: 'た行 (たちつてと)', kana: 'たちつてとたちつてと', display: 'たちつてと たちつてと' },
        { title: 'な行 (なにぬねの)', kana: 'なにぬねのなにぬねの', display: 'なにぬねの なにぬねの' },
        { title: 'は行 (はひふへほ)', kana: 'はひふへほはひふへほ', display: 'はひふへほ はひふへほ' },
        { title: 'ま行 (まみむめも)', kana: 'まみむめもまみむめも', display: 'まみむめも まみむめも' },
        { title: 'や行 (やゆよ)', kana: 'やゆよやゆよ', display: 'やゆよ やゆよ' },
        { title: 'ら行 (らりるれろ)', kana: 'らりるれろらりるれろ', display: 'らりるれろ らりるれろ' },
        { title: 'わ行 (わをん)', kana: 'わをんわをん', display: 'わをん わをん' }
      ]
    }
  ],

  // Mode 2: 単語練習1 (あ行〜わ行のひらがな 5つずつのレッスン)
  word1Categories: [
    {
      id: 'a-gyo',
      name: 'あ行',
      lessons: [
        { char: 'あ', title: '「あ」の単語', words: ['あいす', 'あめ', 'あさ', 'あり', 'あお'] },
        { char: 'い', title: '「い」の単語', words: ['いぬ', 'いちご', 'いと', 'いえ', 'いけ'] },
        { char: 'う', title: '「う」の単語', words: ['うみ', 'うた', 'うち', 'うし', 'うさぎ'] },
        { char: 'え', title: '「え」の単語', words: ['えんぴつ', 'えほん', 'えき', 'えだ', 'えのぐ'] },
        { char: 'お', title: '「お」の単語', words: ['おんがく', 'おかね', 'おにぎり', 'おもちゃ', 'おおきい'] }
      ]
    },
    {
      id: 'ka-gyo',
      name: 'か行',
      lessons: [
        { char: 'か', title: '「か」の単語', words: ['かわ', 'かさ', 'かめ', 'かに', 'かぜ'] },
        { char: 'き', title: '「き」の単語', words: ['きつね', 'きいろ', 'きっぷ', 'きもの', 'きゅうり'] },
        { char: 'く', title: '「く」の単語', words: ['くるま', 'くつ', 'くom', 'くま', 'くすり'] },
        { char: 'け', title: '「け」の単語', words: ['けしごむ', 'けむり', 'けいと', 'けしき', 'けんか'] },
        { char: 'こ', title: '「こ」の単語', words: ['こめ', 'こま', 'こいぬ', 'ことり', 'こえ'] }
      ]
    },
    {
      id: 'sa-gyo',
      name: 'さ行',
      lessons: [
        { char: 'さ', title: '「さ」の単語', words: ['さかな', 'さくら', 'さる', 'さんぽ', 'さとう'] },
        { char: 'し', title: '「し」の単語', words: ['しお', 'しんぶん', 'しか', 'しっぽ', 'しんごう'] },
        { char: 'す', title: '「す」の単語', words: ['すいか', 'すずめ', 'すな', 'すし', 'すべりだい'] },
        { char: 'せ', title: '「せ」の単語', words: ['せんせい', 'せなか', 'せっけん', 'せんぷうき', 'せみ'] },
        { char: 'そ', title: '「そ」の単語', words: ['そら', 'そーだ', 'そば', 'そり', 'そと'] }
      ]
    },
    {
      id: 'ta-gyo',
      name: 'た行',
      lessons: [
        { char: 'た', title: '「た」の単語', words: ['たいよう', 'たけ', 'たまご', 'たぬき', 'たこ'] },
        { char: 'ち', title: '「ち」の単語', words: ['ちず', 'ちきゅう', 'ちから', 'ちち', 'ちゅうりっぷ'] },
        { char: 'つ', title: '「つ」の単語', words: ['つくえ', 'つき', 'つばめ', 'つち', 'つり'] },
        { char: 'て', title: '「て」の単語', words: ['てがみ', 'てんき', 'てつぼう', 'てんとうむし', 'て'] },
        { char: 'と', title: '「と」の単語', words: ['とら', 'とり', 'とまと', 'ともだち', 'とけい'] }
      ]
    },
    {
      id: 'na-gyo',
      name: 'な行',
      lessons: [
        { char: 'な', title: '「な」の単語', words: ['なつ', 'なし', 'なわとび', 'なみ', 'なす'] },
        { char: 'に', title: '「に」の単語', words: ['niwa', 'にし', 'にんじん', 'にじ', 'にほん'] },
        { char: 'ぬ', title: '「ぬ」の単語', words: ['ぬりえ', 'ぬま', 'ぬの', 'ぬいぐるみ', 'ぬくもり'] },
        { char: 'ね', title: '「ね」の単語', words: ['ねんど', 'ねだん', 'ねむい', 'ねこ', 'ねむり'] },
        { char: 'の', title: '「の」の単語', words: ['のり', 'のこぎり', 'のはら', 'のど', 'のりもの'] }
      ]
    },
    {
      id: 'ha-gyo',
      name: 'は行',
      lessons: [
        { char: 'は', title: '「は」の単語', words: ['はな', 'はし', 'はこ', 'はる', 'はっぱ'] },
        { char: 'ひ', title: '「ひ」の単語', words: ['ひかり', 'ひこうき', 'ひつじ', 'ひまわり', 'ひがし'] },
        { char: 'ふ', title: '「ふ」の単語', words: ['ふね', 'ふうせん', 'ふて', 'ふゆ', 'ふく'] },
        { char: 'へ', title: '「へ」の単語', words: ['へや', 'へび', 'へいわ', 'へんじ', 'へるめっと'] },
        { char: 'ほ', title: '「ほ」の単語', words: ['ほし', 'ほん', 'ほたる', 'ほっぺ', 'ほうき'] }
      ]
    },
    {
      id: 'ma-gyo',
      name: 'ま行',
      lessons: [
        { char: 'ま', title: '「ま」の単語', words: ['まつ', 'まど', 'まくら', 'まめ', 'まち'] },
        { char: 'み', title: '「み」の単語', words: ['みかん', 'みず', 'みち', 'みどり', 'みなみ'] },
        { char: 'む', title: '「む」の単語', words: ['むし', 'むぎ', 'むら', 'むかし', 'むね'] },
        { char: 'め', title: '「め」の単語', words: ['めがね', 'めだか', 'めろん', 'め', 'めいろ'] },
        { char: 'も', title: '「も」の単語', words: ['もも', 'もり', 'もち', 'もみじ', 'もくひょう'] }
      ]
    },
    {
      id: 'ya-gyo',
      name: 'や行',
      lessons: [
        { char: 'や', title: '「や」の単語', words: ['やま', 'やさい', 'やさしい', 'やね', 'やどかり'] },
        { char: 'ゆ', title: '「ゆ」の単語', words: ['ゆき', 'ゆめ', 'ゆうやけ', 'ゆび', 'ゆうびん'] },
        { char: 'よ', title: '「よ」の単語', words: ['よる', 'よっと', 'ようい', 'よみもの', 'よつば'] }
      ]
    },
    {
      id: 'ra-gyo',
      name: 'ら行',
      lessons: [
        { char: 'ら', title: '「ら」の単語', words: ['らいおん', 'らくがき', 'らっぱ', 'らいねん', 'らくえん'] },
        { char: 'り', title: '「り」の単語', words: ['りんご', 'りぼん', 'りす', 'りか', 'りょうり'] },
        { char: 'る', title: '「る」の単語', words: ['るり', 'るすばん', 'るーる', 'るーぺ', 'るびー'] },
        { char: 'れ', title: '「れ」の単語', words: ['れもん', 'れんしゅう', 'れきし', 'れいぞうこ', 'れーる'] },
        { char: 'ろ', title: '「ろ」の単語', words: ['ろけっと', 'ろうそく', 'ろば', 'ろーぷ', 'ろうか'] }
      ]
    },
    {
      id: 'wa-gyo',
      name: 'わ行',
      lessons: [
        { char: 'わ', title: '「わ」の単語', words: ['わに', 'わたあめ', 'わらい', 'わごむ', 'わたし'] },
        { char: 'を', title: '「を」の単語', words: ['ほんをよむ', 'てをあらう', 'はなをみる', 'えをかく', 'おとをきく'] },
        { char: 'ん', title: '「ん」の単語', words: ['しんぶん', 'でんしゃ', 'みかん', 'らいおん', 'にほん'] }
      ]
    }
  ],

  // Mode 3: 単語練習2 (General & Theme Words)
  word2: [
    { kanji: '学校', kana: 'がっこう', display: '学校 (がっこう)' },
    { kanji: '勉強', kana: 'べんきょう', display: '勉強 (べんきょう)' },
    { kanji: '友達', kana: 'ともだち', display: '友達 (ともだち)' },
    { kanji: '図書館', kana: 'としょかん', display: '図書館 (としょかん)' },
    { kanji: '教科書', kana: 'きょうかしょ', display: '教科書 (きょうかしょ)' },
    { kanji: 'コンピューター', kana: 'こんぴゅーたー', display: 'コンピューター' },
    { kanji: '未来', kana: 'みらい', display: '未来 (みらい)' },
    { kanji: '挑戦', kana: 'ちょうせん', display: '挑戦 (ちょうせん)' },
    { kanji: '努力', kana: 'どりょく', display: '努力 (どりょく)' },
    { kanji: '成功', kana: 'せいこう', display: '成功 (せいこう)' },
    { kanji: '希望', kana: 'きぼう', display: '希望 (きぼう)' },
    { kanji: '平和', kana: 'へいわ', display: '平和 (へいわ)' },
    { kanji: '新幹線', kana: 'しんかんせん', display: '新幹線 (しんかんせん)' },
    { kanji: '富士山', kana: 'ふじさん', display: '富士山 (ふじさん)' },
    { kanji: '文化', kana: 'ぶんか', display: '文化 (ぶんか)' }
  ],

  // Mode 4: 文節練習 (Bunsetsu Phrase Units)
  bunsetsu: [
    { kanji: 'きょうは', kana: 'きょうは', display: 'きょうは' },
    { kanji: 'いい てんきだ', kana: 'いいてんきだ', display: 'いい てんきだ' },
    { kanji: 'がっこうへ', kana: 'がっこうへ', display: 'がっこうへ' },
    { kanji: 'あるいて いきます', kana: 'あるいていきます', display: 'あるいて いきます' },
    { kanji: 'ともだちと', kana: 'ともだちと', display: 'ともだちと' },
    { kanji: 'たのしく あそぶ', kana: 'たのしくあそぶ', display: 'たのしく あそぶ' },
    { kanji: 'ほんを', kana: 'ほんを', display: 'ほんを' },
    { kanji: 'たくさん よむ', kana: 'たくさんよむ', display: 'たくさん よむ' },
    { kanji: 'おいしい ごはんを', kana: 'おいしいごはんを', display: 'おいしい ごはんを' },
    { kanji: 'みんなで たべる', kana: 'みんなでたべる', display: 'みんなで たべる' },
    { kanji: 'さくらが', kana: 'さくらが', display: 'さくらが' },
    { kanji: 'きれいに さいている', kana: 'きれいにさいている', display: 'きれいに さいている' },
    { kanji: 'ゆめを', kana: 'ゆめを', display: 'ゆめを' },
    { kanji: 'かなえる ために', kana: 'かなえるために', display: 'かなえる ために' },
    { kanji: 'まいにち れんしゅうする', kana: 'まいにちれんしゅうする', display: 'まいにち れんしゅうする' }
  ],

  // Mode 5: 短文練習 (Short Sentences)
  short: [
    { kanji: '継続は力なり。', kana: 'けいぞくはちからなり。', display: '継続は力なり。 (けいぞくはちからなり。)' },
    { kanji: '早起きは三文の徳。', kana: 'はやおきはさんもんのとく。', display: '早起きは三文の徳。 (はやおきはさんもんのとく。)' },
    { kanji: '千里の道も一歩から。', kana: 'せんりのみちもいっぽから。', display: '千里の道も一歩から。 (せんりのみちもいっぽから。)' },
    { kanji: '今日はとても気持ちの良い晴れの日です。', kana: 'きょうはとてもきもちのよいはれのひです。', display: '今日はとても気持ちの良い晴れの日です。' },
    { kanji: '図書室で面白い本を借りて読みました。', kana: 'としょしつでおもしろいほんをかりてよみました。', display: '図書室で面白い本を借りて読みました。' },
    { kanji: '失敗は成功のもとと言われています。', kana: 'しっぱいはせいこうのもとといわれています。', display: '失敗は成功のもとと言われています。' },
    { kanji: '夢に向かって毎日一歩ずつ進みましょう。', kana: 'ゆめにむかってまいにちいっぽずつすすみましょう。', display: '夢に向かって毎日一歩ずつ進みましょう。' },
    { kanji: '笑う門には福来たる。', kana: 'わらうかどにはふくきたる。', display: '笑う門には福来たる。 (わらうかどにはふくきたる。)' },
    { kanji: '友達と一緒にサッカーをして遊びました。', kana: 'ともだちといっしょにさっかーをしてあそびました。', display: '友達と一緒にサッカーをして遊びました。' },
    { kanji: '明日は今日よりもっと良い日になります。', kana: 'あしたはきょうよりもっとよいひになります。', display: '明日は今日よりもっと良い日になります。' }
  ],

  // Mode 6: 長文練習 (External Level-Based Notepad Loaders)
  longCategories: [
    {
      id: 'long-beginner',
      name: '초심자',
      lessons: [
        { id: 'b1', title: '초심자 1 (桃太郎)', file: './data/long/beginner_1.txt' }
      ]
    },
    {
      id: 'long-intermediate',
      name: '중급자',
      lessons: [
        { id: 'i1', title: '중급자 1 (注文の多い料理店)', file: './data/long/intermediate_1.txt' }
      ]
    },
    {
      id: 'long-advanced',
      name: '고급자',
      lessons: [
        { id: 'a1', title: '고급자 1 (走れメロス)', file: './data/long/advanced_1.txt' }
      ]
    },
    {
      id: 'long-others',
      name: 'その他長文',
      lessons: [
        { id: 'o1', title: '기타 1 (銀河鉄道の夜)', file: './data/long/others_1.txt' }
      ]
    }
  ]
};
