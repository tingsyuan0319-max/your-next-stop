// 登機倒數：測一張暫停生活的單程機票 - 資料庫

const DESTINATIONS = {
  // === 中短程地點池 (11 個目的地) ===
  '廣島': {
    id: 'hiroshima',
    name: '廣島',
    nameEn: 'Hiroshima',
    country: '日本',
    countryEn: 'Japan',
    category: 'short',
    flight: 'HIJ2027',
    gate: '7A',
    seat: '19C',
    date: '2027.02.14',
    time: '08:30',
    image: 'Hiroshima.png',
    quote: '在水流靜靜流淌的岸邊，\n將所有柔軟的心願摺進微風裡。',
    tagline: '靜謐之境・和平與祈願之川',
    vibe: '療癒溫柔系',
    tags: ['#水畔漫步', '#紙鶴心願', '#微風與河畔', '#放慢呼吸']
  },
  '札幌': {
    id: 'sapporo',
    name: '札幌',
    nameEn: 'Sapporo',
    country: '日本',
    countryEn: 'Japan',
    category: 'short',
    flight: 'CTS2027',
    gate: 'E8',
    seat: '12F',
    date: '2027.02.14',
    time: '14:30',
    image: 'Sapporo.png',
    quote: '在紛飛落下的柔軟初雪裡，\n捧著熱騰騰的溫度一起慢慢走。',
    tagline: '雪國暖意・拉麵與白雪的慰藉',
    vibe: '冬日純白系',
    tags: ['#初雪漫步', '#熱騰拉麵', '#純白森林', '#溫暖微光']
  },
  '釜山': {
    id: 'busan',
    name: '釜山',
    nameEn: 'Busan',
    country: '韓國',
    countryEn: 'Korea',
    category: 'short',
    flight: 'PUS1995',
    gate: 'G7',
    seat: '17B',
    date: '2027.02.14',
    time: '08:30',
    image: 'Busan.png',
    quote: '迎著微鹹的海風與山海小巷，\n走向天色漸暗的海岸線。',
    tagline: '海風小巷・微醺與浪濤的私語',
    vibe: '海派浪漫系',
    tags: ['#山海巷弄', '#夜幕海灣', '#熱鬧烤腸', '#海風微醺']
  },
  '大邱': {
    id: 'daegu',
    name: '大邱',
    nameEn: 'Daegu',
    country: '韓國',
    countryEn: 'Korea',
    category: 'short',
    flight: 'TAE2027',
    gate: 'G6',
    seat: '18C',
    date: '2027.02.14',
    time: '12:30',
    image: 'Daegu.png',
    quote: '在充滿旋律的老街巷弄裡，\n找到屬於彼此最舒服的節奏。',
    tagline: '文藝復古・巷弄音符與咖啡香',
    vibe: '文藝慢活系',
    tags: ['#復古老街', '#咖啡時光', '#悠揚旋律', '#私房小店']
  },
  '濟州島': {
    id: 'jeju',
    name: '濟州島',
    nameEn: 'Jeju Island',
    country: '韓國',
    countryEn: 'Korea',
    category: 'short',
    flight: 'CJU0711',
    gate: 'G2',
    seat: '14A',
    date: '2027.02.14',
    time: '15:30',
    image: 'Jeju Island.png',
    quote: '把生活的步調放慢一點，\n看看風景，也看看身邊的彼此。',
    tagline: '海島斷訊・橘子香氣與蔚藍浪花',
    vibe: '自然躺平系',
    tags: ['#海島放空', '#橘子莊園', '#玄武岩海岸', '#不設鬧鐘']
  },
  '重慶': {
    id: 'chongqing',
    name: '重慶',
    nameEn: 'Chongqing',
    country: '中國',
    countryEn: 'China',
    category: 'short',
    flight: 'CKG2021',
    gate: 'J10',
    seat: '20C',
    date: '2027.02.14',
    time: '08:30',
    image: 'Chongqing.png',
    quote: '有些城市，走進去之前，\n很難想像它會長什麼樣子。',
    tagline: '魔幻立體・穿梭於山城雲霧與煙火',
    vibe: '魔幻探索系',
    tags: ['#立體山城', '#江畔索道', '#麻辣煙火', '#賽博霓虹']
  },
  '雲南': {
    id: 'yunnan',
    name: '雲南',
    nameEn: 'Yunnan',
    country: '中國',
    countryEn: 'China',
    category: 'short',
    flight: 'YUN1010',
    gate: 'H3',
    seat: '20B',
    date: '2027.02.14',
    time: '14:30',
    image: 'Yunnan.png',
    quote: '走進山水如畫的雲霧間，\n把日子過成一壺慢慢回甘的茶。',
    tagline: '山水如畫・古橋流水與回甘普洱',
    vibe: '世外桃源系',
    tags: ['#彩雲之南', '#古鎮流水', '#慢品回甘', '#蒼山洱海']
  },
  '河內': {
    id: 'hanoi',
    name: '河內',
    nameEn: 'Hanoi',
    country: '越南',
    countryEn: 'Vietnam',
    category: 'short',
    flight: 'HAN0808',
    gate: 'A6',
    seat: '11C',
    date: '2027.02.14',
    time: '12:30',
    image: 'Hanoi.png',
    quote: '在老樹林立的喧鬧街角，\n找一張矮凳坐下，喝一杯滴落的甜。',
    tagline: '法式懷舊・滴漏咖啡與古街喧囂',
    vibe: '市井慵懶系',
    tags: ['#街角矮凳', '#滴漏咖啡', '#法式老屋', '#熱騰河粉']
  },
  '清邁': {
    id: 'chiangmai',
    name: '清邁',
    nameEn: 'Chiang Mai',
    country: '泰國',
    countryEn: 'Thailand',
    category: 'short',
    flight: 'CNX0930',
    gate: 'C4',
    seat: '17A',
    date: '2027.02.14',
    time: '13:30',
    image: 'Chiang Mai.png',
    quote: '把時間的指針撥慢，\n讓日子只留下微風、花香與安靜。',
    tagline: '蘭納微風・古寺林蔭與手作香氣',
    vibe: '森系療癒系',
    tags: ['#林蔭古寺', '#花香微風', '#手作市集', '#悠哉發呆']
  },
  '檳城': {
    id: 'penang',
    name: '檳城',
    nameEn: 'Penang',
    country: '馬來西亞',
    countryEn: 'Malaysia',
    category: 'short',
    flight: 'PEN1202',
    gate: 'E1',
    seat: '09C',
    date: '2027.02.14',
    time: '16:30',
    image: 'Penang.png',
    quote: '在充滿歲月痕跡的騎樓小巷裡，\n循著香氣找尋記憶中的滋味。',
    tagline: '時光騎樓・壁畫穿梭與南洋古早味',
    vibe: '南洋復古系',
    tags: ['#歲月騎樓', '#巷弄壁畫', '#南洋炒粿條', '#老時光']
  },
  '新加坡': {
    id: 'singapore',
    name: '新加坡',
    nameEn: 'Singapore',
    country: '新加坡',
    countryEn: 'Singapore',
    category: 'short',
    flight: 'SIN2008',
    gate: 'H8',
    seat: '12D',
    date: '2027.02.14',
    time: '08:30',
    image: 'Singapore.png',
    quote: '在被綠意溫柔擁抱的城市裡，\n找回對未來最純粹的想像。',
    tagline: '花園都會・摩登未來與綠意共生',
    vibe: '精緻都會系',
    tags: ['#綠意都會', '#海灣夜景', '#未來之森', '#乾淨從容']
  },

  // === 長程地點池 (18 個目的地) ===
  '雪梨': {
    id: 'sydney',
    name: '雪梨',
    nameEn: 'Sydney',
    country: '澳洲',
    countryEn: 'Australia',
    category: 'long',
    flight: 'SYD2000',
    gate: 'D4',
    seat: '14K',
    date: '2027.02.14',
    time: '08:30',
    image: 'Sydney.png',
    quote: '陽光落在波光粼粼的海港，\n連發呆都有海風的溫度。',
    tagline: '陽光海灣・歌劇院倒影與衝浪生活',
    vibe: '陽光自由系',
    tags: ['#海港微風', '#金色沙灘', '#悠閒早午餐', '#日光浴']
  },
  '奧克蘭': {
    id: 'auckland',
    name: '奧克蘭',
    nameEn: 'Auckland',
    country: '紐西蘭',
    countryEn: 'New Zealand',
    category: 'long',
    flight: 'AKL2001',
    gate: 'E5',
    seat: '15F',
    date: '2027.02.14',
    time: '08:30',
    image: 'Auckland.png',
    quote: '把日常留在對岸，\n乘著風去收集海與山丘的晴朗。',
    tagline: '帆船之都・千帆破浪與翠綠山丘',
    vibe: '純淨曠野系',
    tags: ['#山海連天', '#純淨牧場', '#帆船出海', '#晴朗長空']
  },
  '西雅圖': {
    id: 'seattle',
    name: '西雅圖',
    nameEn: 'Seattle',
    country: '美國',
    countryEn: 'USA',
    category: 'long',
    flight: 'SEA2024',
    gate: '15C',
    seat: '22F',
    date: '2027.02.14',
    time: '11:30',
    image: 'Seattle.png',
    quote: '在雨水洗刷過的清冷空氣裡，\n握著一杯熱咖啡慢慢甦醒。',
    tagline: '翡翠之城・派克市場與星巴克發源地',
    vibe: '雨意微光系',
    tags: ['#細雨微光', '#派克市場', '#初焙咖啡', '#太空針塔']
  },
  '紐約': {
    id: 'newyork',
    name: '紐約',
    nameEn: 'New York',
    country: '美國',
    countryEn: 'USA',
    category: 'long',
    flight: 'JFK2027',
    gate: '12D',
    seat: '24K',
    date: '2027.02.14',
    time: '09:30',
    image: 'New York.png',
    quote: '站在世界舞台的正中央，\n感受這座城市永不熄滅的脈搏。',
    tagline: '摩登帝國・時代廣場霓虹與百老匯旋律',
    vibe: '大都會野心系',
    tags: ['#百老匯', '#時代廣場', '#中央公園', '#不夜城']
  },
  '倫敦': {
    id: 'london',
    name: '倫敦',
    nameEn: 'London',
    country: '英國',
    countryEn: 'UK',
    category: 'long',
    flight: 'LHR1848',
    gate: 'A12',
    seat: '10A',
    date: '2027.02.14',
    time: '13:30',
    image: 'London.png',
    quote: '在紅磚與薄霧交織的街道上，\n每一聲鐘響都是時光的迴響。',
    tagline: '霧都紳士・紅色巴士與泰晤士河夕陽',
    vibe: '古典優雅系',
    tags: ['#紅色巴士', '#泰晤士河', '#經典大笨鐘', '#英倫雨巷']
  },
  '巴黎': {
    id: 'paris',
    name: '巴黎',
    nameEn: 'Paris',
    country: '法國',
    countryEn: 'France',
    category: 'long',
    flight: 'FRA0915',
    gate: 'D7',
    seat: '16F',
    date: '2027.02.14',
    time: '17:30',
    image: 'Paris.png',
    quote: '在街角露天的咖啡座看著行人，\n把整個下午都揮霍給浪漫與發呆。',
    tagline: '流動盛宴・塞納河畔的法式可頌',
    vibe: '法式浪漫系',
    tags: ['#露天咖啡', '#鐵塔黃昏', '#藝術漫遊', '#浪漫揮霍']
  },
  '羅馬': {
    id: 'rome',
    name: '羅馬',
    nameEn: 'Rome',
    country: '義大利',
    countryEn: 'Italy',
    category: 'long',
    flight: 'ROM1960',
    gate: 'F6',
    seat: '11C',
    date: '2027.02.14',
    time: '08:30',
    image: 'Rome.png',
    quote: '在古老石磚鋪成的巷弄裡，\n生活原本就該如此漫不經心。',
    tagline: '甜蜜生活・萬神殿前的偉士牌微風',
    vibe: '漫不經心系',
    tags: ['#石磚古巷', '#義式冰淇淋', '#競技場餘暉', '#甜蜜日常']
  },
  '蘇黎世': {
    id: 'zurich',
    name: '蘇黎世',
    nameEn: 'Zurich',
    country: '瑞士',
    countryEn: 'Switzerland',
    category: 'long',
    flight: 'ZRH2027',
    gate: 'J2',
    seat: '22A',
    date: '2027.02.14',
    time: '15:30',
    image: 'Zurich.png',
    quote: '乘著湖面吹來的清風，\n看群山倒映出生活純淨的模樣。',
    tagline: '湖畔純淨・阿爾卑斯山倒影與澄澈',
    vibe: '極致純淨系',
    tags: ['#澄澈湖水', '#雪峰倒影', '#湖畔微風', '#無瑕寧靜']
  },
  '斯德哥爾摩': {
    id: 'stockholm',
    name: '斯德哥爾摩',
    nameEn: 'Stockholm',
    country: '瑞典',
    countryEn: 'Sweden',
    category: 'long',
    flight: 'STO1912',
    gate: 'C3',
    seat: '22A',
    date: '2027.02.14',
    time: '08:30',
    image: 'Stockholm.png',
    quote: '如果生活可以暫停幾天，\n我想和你一起換個舒服的步調。',
    tagline: '北歐美學・水上島嶼與極簡暖光',
    vibe: '北歐極簡系',
    tags: ['#群島水都', '#Fika咖啡', '#彩色老城', '#換個步調']
  },
  '哥本哈根': {
    id: 'copenhagen',
    name: '哥本哈根',
    nameEn: 'Copenhagen',
    country: '丹麥',
    countryEn: 'Denmark',
    category: 'long',
    flight: 'CPH2027',
    gate: 'L5',
    seat: '16B',
    date: '2027.02.14',
    time: '17:30',
    image: 'Copenhagen.png',
    quote: '踩著單車穿過彩色街角，\n體會簡單而溫暖的日常幸福。',
    tagline: '溫暖生活・新港運河畔的單車微風',
    vibe: '童話日常系',
    tags: ['#單車穿梭', '#彩色港口', '#日常微光', '#童話街角']
  },
  '布達佩斯': {
    id: 'budapest',
    name: '布達佩斯',
    nameEn: 'Budapest',
    country: '匈牙利',
    countryEn: 'Hungary',
    category: 'long',
    flight: 'BUD1873',
    gate: 'B2',
    seat: '18D',
    date: '2027.02.14',
    time: '08:30',
    image: 'Budapest.png',
    quote: '夜幕降臨的時候，沿著大河兩岸，\n看整座城市為你亮起暖黃色的燈火。',
    tagline: '多瑙明珠・鏈橋金輝與大河夜曲',
    vibe: '大河微光系',
    tags: ['#多瑙河畔', '#鏈橋夜景', '#暖黃燈火', '#復古浪漫']
  },
  '雷克雅維克': {
    id: 'reykjavik',
    name: '雷克雅維克',
    nameEn: 'Reykjavik',
    country: '冰島',
    countryEn: 'Iceland',
    category: 'long',
    flight: 'ICE0808',
    gate: 'D2',
    seat: '13F',
    date: '2027.02.14',
    time: '11:30',
    image: 'Reykjavik.png',
    quote: '走到世界盡頭般安靜的角落，\n等待夜空裡那一抹神奇的光芒。',
    tagline: '冷酷異境・瀑布溫泉與極光幻境',
    vibe: '世界盡頭系',
    tags: ['#極光夜空', '#冰河瀑布', '#地熱溫泉', '#極致寂靜']
  },
  '伊斯坦堡': {
    id: 'istanbul',
    name: '伊斯坦堡',
    nameEn: 'Istanbul',
    country: '土耳其',
    countryEn: 'Turkey',
    category: 'long',
    flight: 'IST1923',
    gate: 'A1',
    seat: '12C',
    date: '2027.02.14',
    time: '08:30',
    image: 'Istanbul.png',
    quote: '在兩片海洋交匯的黃昏，\n看時光把古老的日常染成金色。',
    tagline: '雙海交界・藍色清真寺與金色落日',
    vibe: '古老交匯系',
    tags: ['#雙海交會', '#金色黃昏', '#香料市集', '#古老召喚']
  },
  '烏茲別克': {
    id: 'uzbekistan',
    name: '烏茲別克',
    nameEn: 'Samarkand',
    country: '烏茲別克',
    countryEn: 'Uzbekistan',
    category: 'long',
    flight: 'SKB2027',
    gate: 'H10',
    seat: '11D',
    date: '2027.02.14',
    time: '13:30',
    image: 'Samarkand.png',
    quote: '沿著古老貿易之路的足跡，\n仰望深邃如星空的藍色穹頂。',
    tagline: '絲路繁星・帖木兒藍色穹頂與千年月光',
    vibe: '千夜神話系',
    tags: ['#絲路古道', '#藍色穹頂', '#異域圖騰', '#星空夜話']
  },
  '馬爾地夫': {
    id: 'maldives',
    name: '馬爾地夫',
    nameEn: 'Maldives',
    country: '馬爾地夫',
    countryEn: 'Maldives',
    category: 'long',
    flight: 'MLE2027',
    gate: 'K3',
    seat: '09C',
    date: '2027.02.14',
    time: '16:30',
    image: 'Male.png',
    quote: '醒在純淨透明的蔚藍之上，\n讓世界只剩下海浪輕柔的聲音。',
    tagline: '人間琉璃・水上別墅與珊瑚海龜',
    vibe: '極致度假系',
    tags: ['#玻璃海', '#水上木屋', '#海浪白噪', '#與世隔絕']
  },
  '摩洛哥': {
    id: 'morocco',
    name: '摩洛哥',
    nameEn: 'Morocco',
    country: '摩洛哥',
    countryEn: 'Morocco',
    category: 'long',
    flight: 'CMN2027',
    gate: 'D4',
    seat: '14A',
    date: '2027.02.14',
    time: '11:30',
    image: 'Casablanca.png',
    quote: '在斑斕色彩與微甜薄荷香裡，\n遇見如沙漠綠洲般的迷人時光。',
    tagline: '北非綠洲・馬約爾藍與撒哈拉駝鈴',
    vibe: '異國幻境系',
    tags: ['#薄荷甜茶', '#沙漠帳篷', '#斑斕磁磚', '#撒哈拉星河']
  },
  '聖地牙哥': {
    id: 'santiago',
    name: '聖地牙哥',
    nameEn: 'Santiago',
    country: '智利',
    countryEn: 'Chile',
    category: 'long',
    flight: 'SCL2027',
    gate: '15A',
    seat: '21B',
    date: '2027.02.14',
    time: '09:30',
    image: 'Santiago.png',
    quote: '抬頭就是皚皚的雪山，\n在天空與山脊相遇處感受浩瀚。',
    tagline: '安地斯之巔・雪山天際線與高原湖泊',
    vibe: '壯麗天地系',
    tags: ['#安地斯山', '#高原湖泊', '#天空之巔', '#浩瀚壯闊']
  },
  '里約熱內盧': {
    id: 'riodejaneiro',
    name: '里約熱內盧',
    nameEn: 'Rio de Janeiro',
    country: '巴西',
    countryEn: 'Brazil',
    category: 'long',
    flight: 'GIG2027',
    gate: '22F',
    seat: '20D',
    date: '2027.02.14',
    time: '10:30',
    image: 'Rio de Janeiro.png',
    quote: '踩在被陽光曬暖的細沙上，\n連呼吸都跟著熱情的節奏起伏。',
    tagline: '森巴熱浪・耶穌山俯瞰與暖陽沙灘',
    vibe: '熱烈狂歡系',
    tags: ['#森巴節奏', '#暖陽細沙', '#耶穌山頂', '#熱情擁抱']
  }
};

const QUIZ_QUESTIONS = [
  {
    id: 'q0',
    number: '00',
    title: '看看行事曆與特休餘額，現在的你想來一趟什麼旅程？',
    subtitle: '',
    isBranching: true,
    options: [
      {
        key: 'short',
        letter: 'A',
        text: '3～5 天的小小出逃',
        pool: 'short'
      },
      {
        key: 'long',
        letter: 'B',
        text: '7 天以上的長途流浪',
        pool: 'long'
      }
    ]
  },
  {
    id: 'q1',
    number: '01',
    title: '週五打卡踏出公司的那一刻，你的「靈魂電量」正處於什麼狀態？',
    options: [
      {
        letter: 'A',
        text: '電量 1%，連說話都累，只想斷開所有人類訊號，<br>找個安靜無聲的地方躺平',
        scores: {
          short: ['濟州島', '清邁'],
          long: ['馬爾地夫', '雷克雅維克', '蘇黎世']
        }
      },
      {
        letter: 'B',
        text: '處於過載當機邊緣，急需大口吃肉、喝一杯、<br>被滿滿的人間煙火氣拯救',
        scores: {
          short: ['釜山', '檳城', '河內'],
          long: ['羅馬', '巴黎', '布達佩斯']
        }
      },
      {
        letter: 'C',
        text: '精神麻木空虛，生活一成不變太久，<br>極度渴望未知的冒險與強烈奇景來震懾大腦',
        scores: {
          short: ['重慶', '雲南'],
          long: ['摩洛哥', '烏茲別克', '聖地牙哥', '里約熱內盧']
        }
      },
      {
        letter: 'D',
        text: '腦袋發燙運轉過度，想鑽進一間有品味的小店，<br>在有質感的環境裡慢慢冷卻',
        scores: {
          short: ['廣島', '札幌', '大邱', '新加坡'],
          long: ['倫敦', '西雅圖', '紐約', '斯德哥爾摩', '哥本哈根', '雪梨', '奧克蘭', '伊斯坦堡']
        }
      }
    ]
  },
  {
    id: 'q2',
    number: '02',
    title: '打開行李箱準備打包時，你的行李風格通常是哪一種？',
    options: [
      {
        letter: 'A',
        text: '舒適至上，以柔軟棉麻衣物、眼罩、降噪耳機為主，<br>能少帶就少帶',
        scores: {
          short: ['濟州島', '清邁', '札幌'],
          long: ['馬爾地夫', '奧克蘭', '蘇黎世']
        }
      },
      {
        letter: 'B',
        text: '實用掃街型，好穿好走的球鞋、常備胃藥與大容量購物袋，<br>準備穿梭大街小巷',
        scores: {
          short: ['檳城', '河內', '大邱'],
          long: ['巴黎', '羅馬', '哥本哈根', '布達佩斯']
        }
      },
      {
        letter: 'C',
        text: '全副武裝型，防風外套、底片相機、萬用轉接頭，<br>應對各種探索環境',
        scores: {
          short: ['重慶', '雲南'],
          long: ['雷克雅維克', '聖地牙哥', '摩洛哥', '烏茲別克']
        }
      },
      {
        letter: 'D',
        text: '風格氛圍型，挑選符合目的地氛圍的穿搭、隨身香氛，<br>與一本讀到一半的小說',
        scores: {
          short: ['廣島', '釜山', '新加坡'],
          long: ['倫敦', '紐約', '西雅圖', '斯德哥爾摩', '雪梨', '伊斯坦堡', '里約熱內盧']
        }
      }
    ]
  },
  {
    id: 'q3',
    number: '03',
    title: '終於坐上位子出發，看向窗外時，最能讓你瞬間放鬆的視野是？',
    options: [
      {
        letter: 'A',
        text: '純淨的大片蔚藍，無邊無際的晴空、大海，<br>或是被綠意覆蓋的平緩山丘',
        scores: {
          short: ['濟州島', '釜山', '新加坡'],
          long: ['馬爾地夫', '雪梨', '奧克蘭', '蘇黎世']
        }
      },
      {
        letter: 'B',
        text: '溫暖的生活街景，漸漸亮起昏黃燈火的老街、<br>磚瓦屋頂與街角飄出的白煙',
        scores: {
          short: ['河內', '檳城', '清邁'],
          long: ['布達佩斯', '巴黎', '羅馬', '伊斯坦堡']
        }
      },
      {
        letter: 'C',
        text: '壯闊的奇特地貌，層層疊疊的奇峰、<br>古老大地或神秘荒原',
        scores: {
          short: ['重慶', '雲南'],
          long: ['雷克雅維克', '聖地牙哥', '烏茲別克', '摩洛哥']
        }
      },
      {
        letter: 'D',
        text: '繁華優雅的都會輪廓，錯落有致的現代建築天際線<br>與林蔭大道',
        scores: {
          short: ['廣島', '札幌', '大邱'],
          long: ['紐約', '倫敦', '西雅圖', '斯德哥爾摩', '哥本哈根', '里約熱內盧']
        }
      }
    ]
  },
  {
    id: 'q4',
    number: '04',
    title: '抵達住宿地點放好隨身行李的第一個小時，你的直覺選擇是？',
    options: [
      {
        letter: 'A',
        text: '撲倒在床上，先享受沒有待辦清單的寧靜，<br>發呆或睡個無負擔的午覺',
        scores: {
          short: ['清邁', '濟州島', '札幌'],
          long: ['馬爾地夫', '蘇黎世', '奧克蘭']
        }
      },
      {
        letter: 'B',
        text: '直奔在地小吃，循著香味找一間人聲鼎沸的老店，<br>用第一口在地滋味昭告旅行開始',
        scores: {
          short: ['釜山', '檳城', '河內'],
          long: ['巴黎', '羅馬', '里約熱內盧']
        }
      },
      {
        letter: 'C',
        text: '立刻出門暴走，一刻都閒不下來，<br>迫不及待想要走進複雜的街巷尋寶',
        scores: {
          short: ['重慶', '雲南'],
          long: ['摩洛哥', '烏茲別克', '伊斯坦堡', '聖地牙哥']
        }
      },
      {
        letter: 'D',
        text: '找間舒服的咖啡館，坐下來點一杯拿鐵，<br>拿著地圖感受周遭緩慢流動的人群',
        scores: {
          short: ['廣島', '大邱', '新加坡'],
          long: ['西雅圖', '斯德哥爾摩', '哥本哈根', '倫敦', '紐約', '雪梨', '雷克雅維克', '布達佩斯']
        }
      }
    ]
  },
  {
    id: 'q5',
    number: '05',
    title: '散步時遇見一條不在地圖標記上的神祕小路，你會？',
    options: [
      {
        letter: 'A',
        text: '找個視野最好的轉角坐下，吹吹微風看看風景，<br>去哪裡其實都不重要',
        scores: {
          short: ['濟州島', '清邁', '札幌'],
          long: ['馬爾地夫', '蘇黎世', '奧克蘭', '雷克雅維克']
        }
      },
      {
        letter: 'B',
        text: '只要看到有在地人排隊就跟著走，<br>鑽進充滿生活氣息與傳統市集的小弄',
        scores: {
          short: ['檳城', '河內', '大邱'],
          long: ['羅馬', '巴黎', '布達佩斯', '伊斯坦堡']
        }
      },
      {
        letter: 'C',
        text: '眼睛一亮直接轉進去，越難以預測的立體街道<br>或荒野岔路越想走走看',
        scores: {
          short: ['重慶', '雲南', '釜山'],
          long: ['摩洛哥', '烏茲別克', '聖地牙哥', '里約熱內盧']
        }
      },
      {
        letter: 'D',
        text: '駐足觀察街角細節，欣賞老房子的配色、<br>文創櫥窗設計或街頭藝人的演奏',
        scores: {
          short: ['廣島', '新加坡'],
          long: ['斯德哥爾摩', '哥本哈根', '倫敦', '紐約', '西雅圖', '雪梨']
        }
      }
    ]
  },
  {
    id: 'q6',
    number: '06',
    title: '旅行途中手機突然震動，跳出公務通知或工作群組的紅點，你的反應是？',
    options: [
      {
        letter: 'A',
        text: '徹底裝死，早就開啟勿擾模式，<br>心裡只想「人在外太空，有事請燒香」',
        scores: {
          short: ['清邁', '濟州島', '雲南'],
          long: ['馬爾地夫', '雷克雅維克', '聖地牙哥']
        }
      },
      {
        letter: 'B',
        text: '邊吃邊翻白眼，嘴裡嚼著好料，<br>跟同行旅伴無情吐槽兩句後直接滑掉',
        scores: {
          short: ['釜山', '檳城', '重慶'],
          long: ['巴黎', '羅馬', '布達佩斯', '里約熱內盧']
        }
      },
      {
        letter: 'C',
        text: '訊號剛好不好，置身在遼闊天地或異域市集，<br>連點開通知的網路都懶得找',
        scores: {
          short: ['河內', '大邱'],
          long: ['摩洛哥', '烏茲別克', '蘇黎世', '奧克蘭']
        }
      },
      {
        letter: 'D',
        text: '冷靜而體面地已讀，心中默念「休假中請自重」，<br>優雅地收起手機不予理會',
        scores: {
          short: ['廣島', '札幌', '新加坡'],
          long: ['倫敦', '紐約', '西雅圖', '斯德哥爾摩', '哥本哈根', '雪梨', '伊斯坦堡']
        }
      }
    ]
  },
  {
    id: 'q7',
    number: '07',
    title: '旅途中哪一個瞬間，最能讓你深深感到「活著真好」？',
    options: [
      {
        letter: 'A',
        text: '聽著海浪或踩著軟雪，身邊沒有鬧鐘催促，<br>全世界只剩下乾淨的白噪音',
        scores: {
          short: ['濟州島', '札幌', '新加坡'],
          long: ['馬爾地夫', '雷克雅維克', '蘇黎世', '奧克蘭']
        }
      },
      {
        letter: 'B',
        text: '在昏黃的熱鬧露天座喝下第一口酒，食物剛烤好，<br>周遭笑聲喧嘩，極具生命力',
        scores: {
          short: ['釜山', '檳城', '河內'],
          long: ['巴黎', '羅馬', '哥本哈根', '里約熱內盧']
        }
      },
      {
        letter: 'C',
        text: '站在宏偉神秘的歷史遺跡或山巔前，被無垠天地包圍，<br>瞬間覺得工作煩惱微不足道',
        scores: {
          short: ['重慶', '雲南'],
          long: ['聖地牙哥', '烏茲別克', '摩洛哥', '伊斯坦堡']
        }
      },
      {
        letter: 'D',
        text: '在傍晚的大河邊或藝術館門口散步，<br>城市的暖黃燈火逐漸點亮，浪漫而寧靜',
        scores: {
          short: ['廣島', '清邁', '大邱'],
          long: ['倫敦', '紐約', '布達佩斯', '西雅圖', '斯德哥爾摩', '雪梨']
        }
      }
    ]
  },
  {
    id: 'q8',
    number: '08',
    title: '假期最後一天的傍晚，你希望用哪種儀式收尾這次逃跑？',
    options: [
      {
        letter: 'A',
        text: '在看得到夕陽沉落的地方放空，靜靜等待天空轉為深藍，<br>把腦袋徹底清空',
        scores: {
          short: ['濟州島', '釜山', '清邁'],
          long: ['馬爾地夫', '雪梨', '奧克蘭', '蘇黎世']
        }
      },
      {
        letter: 'B',
        text: '拎著滿滿伴手禮在老餐館乾杯，<br>用肚皮和行李箱的飽足感為旅行畫下熱鬧句點',
        scores: {
          short: ['檳城', '河內', '大邱'],
          long: ['巴黎', '羅馬', '布達佩斯', '里約熱內盧']
        }
      },
      {
        letter: 'C',
        text: '整理相機裡如夢似幻的相片，<br>回味那些驚險又驚喜的異地冒險片段',
        scores: {
          short: ['重慶', '雲南'],
          long: ['摩洛哥', '烏茲別克', '雷克雅維克', '聖地牙哥']
        }
      },
      {
        letter: 'D',
        text: '挑一張明信片寫給回到常軌的自己，記錄下這份自在從容，<br>提醒自己生活還有別的模樣',
        scores: {
          short: ['廣島', '札幌', '新加坡'],
          long: ['倫敦', '紐約', '西雅圖', '斯德哥爾摩', '哥本哈根', '伊斯坦堡']
        }
      }
    ]
  }
];
