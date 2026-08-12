/**
 * Japanese Practice Dataset for 6 Stages
 * All content in 100% Japanese with Kana & Furigana readings.
 */

export const PRACTICE_DATA = {
  // Mode 1: 各ポジション練習 (Playgram Typing style detailed sub-lessons)
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
        { title: 'わ行 (わをん)', kana: 'わをんわをん', display: 'わをん わをん' },
        { title: '小指特訓 (a, z, q, p)', kana: 'あつたせあつたせ', display: 'あつたせ あつたせ' },
        { title: '薬指特訓 (s, x, w, o)', kana: 'とさてらとさてら', display: 'とさてら とさてら' },
        { title: '中指特訓 (d, c, e, i)', kana: 'しそいにかしそいにか', display: 'しそいにか しそいにか' },
        { title: '人差し指特訓 (f, v, r, g, b, j, m, u, h, n)', kana: 'ふひすきこじみになん', display: 'ふひすきこ じみになん' }
      ]
    }
  ],

  // Legacy position fallback
  position: [
    { title: 'ホームポジション (fj)', kana: 'ふじふじ', display: 'ふじふじ' },
    { title: 'ホームポジション (dk)', kana: 'てきてき', display: 'てきてき' },
    { title: 'あ行ポジション', kana: 'あいうえお', display: 'あいうえお' },
    { title: 'か行ポジション', kana: 'かきくけこ', display: 'かきくけこ' }
  ],

  // Mode 2: 単語練習1 (あいうえお順 - AIUEO Order Words)
  word1: [
    { kanji: '朝', kana: 'あさ', display: '朝 (あさ)' },
    { kanji: '犬', kana: 'いぬ', display: '犬 (いぬ)' },
    { kanji: '海', kana: 'うみ', display: '海 (うみ)' },
    { kanji: '駅', kana: 'えき', display: '駅 (えき)' },
    { kanji: '音楽', kana: 'おんがく', display: '音楽 (おんがく)' },
    { kanji: '川', kana: 'かわ', display: '川 (かわ)' },
    { kanji: '木', kana: 'き', display: '木 (き)' },
    { kanji: '車', kana: 'くるま', display: '車 (くるま)' },
    { kanji: '景色', kana: 'けしき', display: '景色 (けしき)' },
    { kanji: '公園', kana: 'こうえん', display: '公園 (こうえん)' },
    { kanji: '魚', kana: 'さかな', display: '魚 (さかな)' },
    { kanji: '空', kana: 'そら', display: '空 (そら)' },
    { kanji: '太陽', kana: 'たいよう', display: '太陽 (たいよう)' },
    { kanji: '鳥', kana: 'とり', display: '鳥 (とり)' },
    { kanji: '夏', kana: 'なつ', display: '夏 (なつ)' },
    { kanji: '花', kana: 'はな', display: '花 (はな)' },
    { kanji: '星', kana: 'ほし', display: '星 (ほし)' },
    { kanji: '山', kana: 'やま', display: '山 (やま)' },
    { kanji: '夢', kana: 'ゆめ', display: '夢 (ゆめ)' },
    { kanji: '桜', kana: 'さくら', display: '桜 (さくら)' }
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

  // Mode 6: 長文練習 (Long Literature Passages)
  long: [
    {
      title: '走れメロス (太宰治)',
      passages: [
        { kanji: 'メロスは激怒した。必ず、かの邪智暴虐の王を除かなければならぬと決意した。', kana: 'めろすはげきどした。かならず、かのじゃちぼうぎゃくのおうをのぞかなければならぬとけついした。' },
        { kanji: 'メロスには政治がわからぬ。メロスは、村の牧人である。笛を吹き、羊と遊んで暮して来た。', kana: 'めろすにはせいじがわからぬ。めろすは、むらのぼくじんである。ふえをふき、ひつじとあそんでくらしてきた。' },
        { kanji: 'けれども邪悪に対しては、人一倍に敏感であった。', kana: 'けれどもじゃあくにたいしては、ひといちばいにびんかんであった。' },
        { kanji: 'メロスは未明、村を出発し、野を越え山を越え、十里離れたこのシノラクサの市にやって来た。', kana: 'めろすはみめい、むらをしゅっぱつし、のをこえやまをこえ、じゅうりにはなれたこのしのらくさのいちにやってきた。' }
      ]
    },
    {
      title: '注文の多い料理店 (宮沢賢治)',
      passages: [
        { kanji: 'ふたりの若い紳士が、すっかりイギリスの兵隊の形をして、ピカピカする鉄砲を担いで、山奥を歩いておりました。', kana: 'ふたりのわかいしんしが、すっかりいぎりすのへいたいのかたちをして、ぴかぴかするてっぽうをかついで、やまおくをあるいておりました。' },
        { kanji: '山はすばらしく奥深くて、案内してきた猟師も、どっちへ行ったらいいかわからなくなったほどでした。', kana: 'やまはすばらしくおくぶかくて、あんないしてきたりょうしも、どっちへいったらいいかわからなくなったほどでした。' },
        { kanji: '「どうだ、ここいらで少し休もうじゃないか。」', kana: '「どうだ、ここいらですこしやすもうじゃないか。」' },
        { kanji: 'ふたりは、木の下の落ち葉の上に腰をかけました。', kana: 'ふたりは、きのしたのおちばのうえにこしをかけました。' }
      ]
    },
    {
      title: '桃太郎 (日本昔話)',
      passages: [
        { kanji: 'むかし、むかし、あるところに、おじいさんとおばあさんが住んでいました。', kana: 'むかし、むかし、あるところに、おじいさんとおばあさんがすんでいました。' },
        { kanji: 'おじいさんは山へ芝刈りに、おばあさんは川へ洗濯に行きました。', kana: 'おじいさんはやまへしばかりに、おばあさんはかわへせんたくにいきました。' },
        { kanji: 'おばあさんが川で洗濯をしていると、大きな桃が流れてきました。', kana: 'おばあさんがかわでせんたくをしていると、おおきなももがながれてきました。' },
        { kanji: '「どんぶらこ、どんぶらこ」と大きな桃がどんぶらこ。', kana: '「どんぶらこ、どんぶらこ」とおおきなももがどんぶらこ。' }
      ]
    }
  ]
};
