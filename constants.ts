
import { Character, Phrase, Word } from './types';

export const HIRAGANA: Character[] = [
  { id: 'h1', jp: 'あ', romaji: 'a', phonetic: '아', kr: '아' }, { id: 'h2', jp: 'い', romaji: 'i', phonetic: '이', kr: '이' }, { id: 'h3', jp: 'う', romaji: 'u', phonetic: '우', kr: '우' }, { id: 'h4', jp: 'え', romaji: 'e', phonetic: '에', kr: '에' }, { id: 'h5', jp: 'お', romaji: 'o', phonetic: '오', kr: '오' },
  { id: 'h6', jp: 'か', romaji: 'ka', phonetic: '카', kr: '카' }, { id: 'h7', jp: 'き', romaji: 'ki', phonetic: '키', kr: '키' }, { id: 'h8', jp: 'く', romaji: 'ku', phonetic: '쿠', kr: '쿠' }, { id: 'h9', jp: 'け', romaji: 'ke', phonetic: '케', kr: '케' }, { id: 'h10', jp: 'こ', romaji: 'ko', phonetic: '코', kr: '코' },
  { id: 'h11', jp: 'さ', romaji: 'sa', phonetic: '사', kr: '사' }, { id: 'h12', jp: 'し', romaji: 'shi', phonetic: '시', kr: '시' }, { id: 'h13', jp: 'す', romaji: 'su', phonetic: '스', kr: '스' }, { id: 'h14', jp: 'せ', romaji: 'se', phonetic: '세', kr: '세' }, { id: 'h15', jp: 'そ', romaji: 'so', phonetic: '소', kr: '소' },
  { id: 'h16', jp: 'た', romaji: 'ta', phonetic: '타', kr: '타' }, { id: 'h17', jp: 'ち', romaji: 'chi', phonetic: '치', kr: '치' }, { id: 'h18', jp: 'つ', romaji: 'tsu', phonetic: '츠', kr: '츠' }, { id: 'h19', jp: 'て', romaji: 'te', phonetic: '테', kr: '테' }, { id: 'h20', jp: 'と', romaji: 'to', phonetic: '토', kr: '토' }
];

export const KATAKANA: Character[] = [
  { id: 'k1', jp: 'ア', romaji: 'a', phonetic: '아', kr: '아' }, { id: 'k2', jp: 'イ', romaji: 'i', phonetic: '이', kr: '이' }, { id: 'k3', jp: 'ウ', romaji: 'u', phonetic: '우', kr: '우' }, { id: 'k4', jp: 'エ', romaji: 'e', phonetic: '에', kr: '에' }, { id: 'k5', jp: 'オ', romaji: 'o', phonetic: '오', kr: '오' },
  { id: 'k6', jp: 'カ', romaji: 'ka', phonetic: '카', kr: '카' }, { id: 'k7', jp: 'キ', romaji: 'ki', phonetic: '키', kr: '키' }, { id: 'k8', jp: 'ク', romaji: 'ku', phonetic: '쿠', kr: '쿠' }
];

export const PHRASES: Phrase[] = [
  // 인사 (1~10레벨)
  { id: 'p1_1', level: 1, category: '인사', jp: 'こんにちは', romaji: 'Konnichiwa', phonetic: '콘니치와', kr: '안녕하세요' },
  { id: 'p1_2', level: 2, category: '인사', jp: 'お元気ですか？', romaji: 'Ogenki desu ka?', phonetic: '오겐키 데스카?', kr: '잘 지내시나요?' },
  { id: 'p1_3', level: 3, category: '인사', jp: 'お久しぶりですね', romaji: 'Ohisashiburi desu ne', phonetic: '오히사시부리 데스 네', kr: '오랜만이네요' },
  { id: 'p1_4', level: 4, category: '인사', jp: '初めまして', romaji: 'Hajimemashite', phonetic: '하지메마시테', kr: '처음 뵙겠습니다' },
  { id: 'p1_5', level: 5, category: '인사', jp: 'お会いできて嬉しいです', romaji: 'Oaidekite ureshii desu', phonetic: '오아이데키테 우레시- 데스', kr: '만나서 반갑습니다' },
  { id: 'p1_6', level: 6, category: '인사', jp: 'ご無沙汰しております', romaji: 'Gobusata shite orimasu', phonetic: '고부사타 시테 오리마스', kr: '오랫동안 격조했습니다' },
  { id: 'p1_7', level: 7, category: '인사', jp: '良い一日を', romaji: 'Yoi ichinichi o', phonetic: '요이 이치니치오', kr: '좋은 하루 보내세요' },
  { id: 'p1_8', level: 8, category: '인사', jp: '道中お気をつけて', romaji: 'Douchuu okiotsukete', phonetic: '도-츄- 오키오츠케테', kr: '가는 길 조심하세요' },
  { id: 'p1_9', level: 9, category: '인사', jp: '今後ともよろしくお願いいたします', romaji: 'Kongo tomo yoroshiku onegaishimasu', phonetic: '콩고 토모 요로시쿠 오네가이시마스', kr: '앞으로도 잘 부탁드립니다' },
  { id: 'p1_10', level: 10, category: '인사', jp: '皆様のご健康をお祈り申し上げます', romaji: 'Minasama no gokenkou o oinori moushiagemasu', phonetic: '미나사마노 고켕코-오 오이노리 모-시아게마스', kr: '여러분의 건강을 기원합니다' },

  // 식당 (1~10레벨)
  { id: 'p2_1', level: 1, category: '식당', jp: 'メニュー、ください', romaji: 'Menyu-, kudasai', phonetic: '메뉴-, 쿠다사이', kr: '메뉴판 주세요' },
  { id: 'p2_2', level: 2, category: '식당', jp: 'これを二つください', romaji: 'Kore o futatsu kudasai', phonetic: '코레오 후타츠 쿠다사이', kr: '이것을 두 개 주세요' },
  { id: 'p2_3', level: 3, category: '식당', jp: 'おすすめは何ですか？', romaji: 'Osusume wa nan desu ka?', phonetic: '오스스메와 난 데스카?', kr: '추천 메뉴는 무엇인가요?' },
  { id: 'p2_4', level: 4, category: '식당', jp: '禁煙席をお願いします', romaji: 'Kinuenseki o onegaishimasu', phonetic: '킹엔세키오 오네가이시마스', kr: '금연석으로 부탁합니다' },
  { id: 'p2_5', level: 5, category: '식당', jp: 'アレルギーがあるので抜いてください', romaji: 'Arerugi- ga aru node nuite kudasai', phonetic: '아레루기-가 아루노데 누이테 쿠다사이', kr: '알레르기가 있으니 빼주세요' },
  { id: 'p2_6', level: 6, category: '식당', jp: 'ラストオーダーは何時ですか？', romaji: 'Rasuto o-da- wa nanji desu ka?', phonetic: '라스토 오-다-와 난지 데스카?', kr: '마지막 주문은 몇 시인가요?' },
  { id: 'p2_7', level: 7, category: '식당', jp: 'お会計は別々にお願いできますか？', kr: '계산은 각자 할 수 있을까요?', romaji: 'Okaikei wa betsubetsu ni onegaidekimasu ka?', phonetic: '오카이케이와 베츠베츠니 오네가이데키마스카?' },
  { id: 'p2_8', level: 8, category: '식당', jp: '個室を予約したいのですが', kr: '개인실을 예약하고 싶습니다만', romaji: 'Koshitsu o yoyaku shitai no desu ga', phonetic: '코시츠오 요야쿠 시타이노 데스가' },
  { id: 'p2_9', level: 9, category: '식당', jp: 'この料理はかなり辛いですか？', kr: '이 요리는 꽤 매운가요?', romaji: 'Kono ryouri wa kanari karai desu ka?', phonetic: '코노 료-리와 카나리 카라이 데스카?' },
  { id: 'p2_10', level: 10, category: '식당', jp: 'こちらのお店、予約なしでも大丈夫でしょうか？', romaji: 'Kochira no omise, yoyaku nashi demo daijoubu deshou ka?', phonetic: '코치라노 오미세, 요야쿠 나시 데모 다이죠-부 데쇼-카?', kr: '이 가게, 예약 없이도 괜찮을까요?' },

  // 질문 (1~10레벨)
  { id: 'p3_1', level: 1, category: '질문', jp: '何ですか？', romaji: 'Nan desu ka?', phonetic: '난 데스카?', kr: '무엇입니까?' },
  { id: 'p3_2', level: 2, category: '질문', jp: 'どこですか？', kr: '어디예요?', romaji: 'Doko desu ka?', phonetic: '도코 데스카?' },
  { id: 'p3_3', level: 3, category: '질문', jp: 'いつ終わりますか？', kr: '언제 끝나나요?', romaji: 'Itsu owarimasu ka?', phonetic: '이츠 오와리마스카?' },
  { id: 'p3_4', level: 4, category: '질문', jp: 'どこに行けばいいですか？', romaji: 'Doko ni ikeba ii desu ka?', phonetic: '도코니 이케바 이- 데스카?', kr: '어디로 가면 되나요?' },
  { id: 'p3_5', level: 5, category: '질문', jp: 'どうしてそうなったのですか？', kr: '어째서 그렇게 된 건가요?', romaji: 'Doushite sou natta no desu ka?', phonetic: '도-시테 소- 낫타 노 데스카?' },
  { id: 'p3_6', level: 6, category: '질문', jp: '詳しい説明をいただけますか？', kr: '자세한 설명을 해주실 수 있나요?', romaji: 'Kuwashii setsumei o itadakemasu ka?', phonetic: '쿠와시- 세츠메-오 이타다케마스카?' },
  { id: 'p3_7', level: 7, category: '질문', jp: '使い方は難しくないですか？', kr: '사용법은 어렵지 않나요?', romaji: 'Tsukaikata wa muzukashikunai desu ka?', phonetic: '츠카이카타와 무즈카시쿠나이 데스카?' },
  { id: 'p3_8', level: 8, category: '질문', jp: '誰に聞けば分かりますか？', kr: '누구에게 물어보면 알 수 있을까요?', romaji: 'Dare ni kikeba wakarimasu ka?', phonetic: '다레니 키케바 와카리마스카?' },
  { id: 'p3_9', level: 9, category: '질문', jp: '確認のために再送いただけますか？', kr: '확인을 위해 다시 보내주실 수 있나요?', romaji: 'Kakunin no tame ni saisou itadakemasu ka?', phonetic: '카쿠닌노 타메니 사이소- 이타다케마스카?' },
  { id: 'p3_10', level: 10, category: '질문', jp: '今後のスケジュールについてお伺いできますか？', kr: '향후 일정에 대해 여쭤봐도 될까요?', romaji: 'Kongo no sukeju-ru ni tsuite oukagai dekimasu ka?', phonetic: '콩고노 스케쥬-루니 츠이테 오우카가이 데키마스카?' },

  // 쇼핑 (1~10레벨)
  { id: 'p4_1', level: 1, category: '쇼핑', jp: 'いくらですか？', romaji: 'Ikura desu ka?', phonetic: '이쿠라 데스카?', kr: '얼마예요?' },
  { id: 'p4_2', level: 2, category: '쇼핑', jp: 'これをください', kr: '이것을 주세요', romaji: 'Kore o kudasai', phonetic: '코레오 쿠다사이' },
  { id: 'p4_3', level: 3, category: '쇼핑', jp: 'カードで払えますか？', kr: '카드로 지불 가능한가요?', romaji: 'Ka-do de haraemasu ka?', phonetic: '카-도데 하라에마스카?' },
  { id: 'p4_4', level: 4, category: '쇼핑', jp: '試着してもいいですか？', romaji: 'Shichaku shitemo ii desu ka?', phonetic: '시챠쿠 시테모 이- 데스카?', kr: '입어봐도 될까요?' },
  { id: 'p4_5', level: 5, category: '쇼핑', jp: '違う色はありますか？', kr: '다른 색깔은 있나요?', romaji: 'Chigau iro wa arimasu ka?', phonetic: '치가우 이로와 아리마스카?' },
  { id: 'p4_6', level: 6, category: '쇼핑', jp: 'もっと大きいサイズはありますか？', kr: '더 큰 사이즈는 있나요?', romaji: 'Motto ookii saizu wa arimasu ka?', phonetic: '못토 오-키- 사이즈와 아리마스카?' },
  { id: 'p4_7', level: 7, category: '쇼핑', jp: '免税の手続きはできますか？', kr: '면세 절차를 밟을 수 있나요?', romaji: 'Menzei no tetsuzuki wa dekimasu ka?', phonetic: '멘제-노 테츠즈키와 데키마스카?' },
  { id: 'p4_8', level: 8, category: '쇼핑', jp: '配送をお願いしたいのですが', kr: '배송을 부탁드리고 싶습니다만', romaji: 'Haisou o onegaishitai no desu ga', phonetic: '하이소-오 오네가이시타이노 데스가' },
  { id: 'p4_9', level: 9, category: '쇼핑', jp: '返品や交換は可能ですか？', kr: '반품이나 교환은 가능한가요?', romaji: 'Henpin ya koukan wa kanou desu ka?', phonetic: '헨핑야 코-캉와 카노- 데스카?' },
  { id: 'p4_10', level: 10, category: '쇼핑', jp: 'ポイントカードを作っていただけますか？', kr: '포인트 카드를 만들어 주시겠어요?', romaji: 'Pointo ka-do o tsukutte itadakemasu ka?', phonetic: '포인토 카-도오 츠쿳테 이타다케마스카?' }
];

// 단어 챕터 1~10 (각 챕터당 최소 10개 이상)
export const CHAPTER_WORDS: Word[] = [
  // Chapter 1: 기초 명사
  { id: 'w1_1', chapter: 1, jp: '私', phonetic: '와타시', kr: '나' },
  { id: 'w1_2', chapter: 1, jp: 'あなた', phonetic: '아나타', kr: '당신' },
  { id: 'w1_3', chapter: 1, jp: '友達', phonetic: '토모다치', kr: '친구' },
  { id: 'w1_4', chapter: 1, jp: '家族', phonetic: '카조쿠', kr: '가족' },
  { id: 'w1_5', chapter: 1, jp: '先生', phonetic: '센세-', kr: '선생님' },
  { id: 'w1_6', chapter: 1, jp: '학생', phonetic: '가쿠세-', kr: '학생' },
  { id: 'w1_7', chapter: 1, jp: '日本', phonetic: '니혼', kr: '일본' },
  { id: 'w1_8', chapter: 1, jp: '韓国', phonetic: '캉코쿠', kr: '한국' },
  { id: 'w1_9', chapter: 1, jp: '名前', phonetic: '나마에', kr: '이름' },
  { id: 'w1_10', chapter: 1, jp: '学校', phonetic: '갓코-', kr: '학교' },

  // Chapter 2: 숫자와 시간
  { id: 'w2_1', chapter: 2, jp: '一', phonetic: '이치', kr: '일 (1)' },
  { id: 'w2_2', chapter: 2, jp: '二', phonetic: '니', kr: '이 (2)' },
  { id: 'w2_3', chapter: 2, jp: '三', phonetic: '산', kr: '삼 (3)' },
  { id: 'w2_4', chapter: 2, jp: '四', phonetic: '욘', kr: '사 (4)' },
  { id: 'w2_5', chapter: 2, jp: '五', phonetic: '고', kr: '오 (5)' },
  { id: 'w2_6', chapter: 2, jp: '六', phonetic: '로쿠', kr: '육 (6)' },
  { id: 'w2_7', chapter: 2, jp: '七', phonetic: '나나', kr: '칠 (7)' },
  { id: 'w2_8', chapter: 2, jp: '八', phonetic: '하치', kr: '팔 (8)' },
  { id: 'w2_9', chapter: 2, jp: '九', phonetic: '큐-', kr: '구 (9)' },
  { id: 'w2_10', chapter: 2, jp: '十', phonetic: '쥬-', kr: '십 (10)' },

  // Chapter 3: 위치와 장소
  { id: 'w3_1', chapter: 3, jp: 'ここ', phonetic: '코코', kr: '여기' },
  { id: 'w3_2', chapter: 3, jp: 'そこ', phonetic: '소코', kr: '거기' },
  { id: 'w3_3', chapter: 3, jp: 'あそこ', phonetic: '아소코', kr: '저기' },
  { id: 'w3_4', chapter: 3, jp: 'どこ', phonetic: '도코', kr: '어디' },
  { id: 'w3_5', chapter: 3, jp: '家', phonetic: '이에', kr: '집' },
  { id: 'w3_6', chapter: 3, jp: '駅', phonetic: '에키', kr: '역' },
  { id: 'w3_7', chapter: 3, jp: '銀行', phonetic: '깅코-', kr: '은행' },
  { id: 'w3_8', chapter: 3, jp: '公園', phonetic: '코-엥', kr: '공원' },
  { id: 'w3_9', chapter: 3, jp: '病院', phonetic: '뵤-잉', kr: '병원' },
  { id: 'w3_10', chapter: 3, jp: '交番', phonetic: '코-방', kr: '파출소' },

  // Chapter 4: 음식과 식재료
  { id: 'w4_1', chapter: 4, jp: '水', phonetic: '미즈', kr: '물' },
  { id: 'w4_2', chapter: 4, jp: 'ご飯', phonetic: '고항', kr: '밥' },
  { id: 'w4_3', chapter: 4, jp: '肉', phonetic: '니쿠', kr: '고기' },
  { id: 'w4_4', chapter: 4, jp: '魚', phonetic: '사카나', kr: '생선' },
  { id: 'w4_5', chapter: 4, jp: '卵', phonetic: '타마고', kr: '계란' },
  { id: 'w4_6', chapter: 4, jp: '野菜', phonetic: '야사이', kr: '야채' },
  { id: 'w4_7', chapter: 4, jp: '果物', phonetic: '쿠다모노', kr: '과일' },
  { id: 'w4_8', chapter: 4, jp: 'パン', phonetic: '팡', kr: '빵' },
  { id: 'w4_9', chapter: 4, jp: 'お酒', phonetic: '오사케', kr: '술' },
  { id: 'w4_10', chapter: 4, jp: '牛乳', phonetic: '규-뉴-', kr: '우유' },

  // Chapter 5: 생활 도구
  { id: 'w5_1', chapter: 5, jp: '時計', phonetic: '토케-', kr: '시계' },
  { id: 'w5_2', chapter: 5, jp: '本', phonetic: '홍', kr: '책' },
  { id: 'w5_3', chapter: 5, jp: '眼鏡', phonetic: '메가네', kr: '안경' },
  { id: 'w5_4', chapter: 5, jp: '服', phonetic: '후쿠', kr: '옷' },
  { id: 'w5_5', chapter: 5, jp: '財布', phonetic: '사이후', kr: '지갑' },
  { id: 'w5_6', chapter: 5, jp: '鞄', phonetic: '카방', kr: '가방' },
  { id: 'w5_7', chapter: 5, jp: '靴', phonetic: '쿠츠', kr: '신발' },
  { id: 'w5_8', chapter: 5, jp: '電話', phonetic: '뎅와', kr: '전화' },
  { id: 'w5_9', chapter: 5, jp: '傘', phonetic: '카사', kr: '우산' },
  { id: 'w5_10', chapter: 5, jp: '鍵', phonetic: '카기', kr: '열쇠' },

  // Chapter 6: 동사 (1)
  { id: 'w6_1', chapter: 6, jp: '行く', phonetic: '이쿠', kr: '가다' },
  { id: 'w6_2', chapter: 6, jp: '来る', phonetic: '쿠루', kr: '오다' },
  { id: 'w6_3', chapter: 6, jp: '食べる', phonetic: '타베루', kr: '먹다' },
  { id: 'w6_4', chapter: 6, jp: '飲む', phonetic: '노무', kr: '마시다' },
  { id: 'w6_5', chapter: 6, jp: '見る', phonetic: '미루', kr: '보다' },
  { id: 'w6_6', chapter: 6, jp: '聞く', phonetic: '키쿠', kr: '듣다' },
  { id: 'w6_7', chapter: 6, jp: '話す', phonetic: '하나스', kr: '말하다' },
  { id: 'w6_8', chapter: 6, jp: '寝る', phonetic: '네루', kr: '자다' },
  { id: 'w6_9', chapter: 6, jp: '起きる', phonetic: '오키루', kr: '일어나다' },
  { id: 'w6_10', chapter: 6, jp: '勉強する', phonetic: '벤쿄-스루', kr: '공부하다' },

  // Chapter 7: 형용사 (1)
  { id: 'w7_1', chapter: 7, jp: '大きい', phonetic: '오-키-', kr: '크다' },
  { id: 'w7_2', chapter: 7, jp: '小さい', phonetic: '치-사이', kr: '작다' },
  { id: 'w7_3', chapter: 7, jp: '高い', phonetic: '타카이', kr: '비싸다/높다' },
  { id: 'w7_4', chapter: 7, jp: '安い', phonetic: '야스이', kr: '싸다' },
  { id: 'w7_5', chapter: 7, jp: '暑い', phonetic: '아츠이', kr: '덥다' },
  { id: 'w7_6', chapter: 7, jp: '寒い', phonetic: '사무이', kr: '춥다' },
  { id: 'w7_7', chapter: 7, jp: '良い', phonetic: '이-', kr: '좋다' },
  { id: 'w7_8', chapter: 7, jp: '悪い', phonetic: '와루이', kr: '나쁘다' },
  { id: 'w7_9', chapter: 7, jp: 'おいしい', phonetic: '오이시-', kr: '맛있다' },
  { id: 'w7_10', chapter: 7, jp: '忙しい', phonetic: '이소가시-', kr: '바쁘다' },

  // Chapter 8: 색상과 감정
  { id: 'w8_1', chapter: 8, jp: '赤', phonetic: '아카', kr: '빨강' },
  { id: 'w8_2', chapter: 8, jp: '青', phonetic: '아오', kr: '파랑' },
  { id: 'w8_3', chapter: 8, jp: '白', phonetic: '시로', kr: '하양' },
  { id: 'w8_4', chapter: 8, jp: '黒', phonetic: '쿠로', kr: '검정' },
  { id: 'w8_5', chapter: 8, jp: '嬉しい', phonetic: '우레시-', kr: '기쁘다' },
  { id: 'w8_6', chapter: 8, jp: '悲しい', phonetic: '카나시-', kr: '슬프다' },
  { id: 'w8_7', chapter: 8, jp: '楽しい', phonetic: '타노시-', kr: '즐겁다' },
  { id: 'w8_8', chapter: 8, jp: '好き', phonetic: '스키', kr: '좋아함' },
  { id: 'w8_9', chapter: 8, jp: '嫌い', phonetic: '키라이', kr: '싫어함' },
  { id: 'w8_10', chapter: 8, jp: '面白い', phonetic: '오모시로이', kr: '재미있다' },

  // Chapter 9: 방향과 신체
  { id: 'w9_1', chapter: 9, jp: '右', phonetic: '미기', kr: '오른쪽' },
  { id: 'w9_2', chapter: 9, jp: '左', phonetic: '히다리', kr: '왼쪽' },
  { id: 'w9_3', chapter: 9, jp: '前', phonetic: '마에', kr: '앞' },
  { id: 'w9_4', chapter: 9, jp: '後ろ', phonetic: '우시로', kr: '뒤' },
  { id: 'w9_5', chapter: 9, jp: '頭', phonetic: '아타마', kr: '머리' },
  { id: 'w9_6', chapter: 9, jp: '目', phonetic: '메', kr: '눈' },
  { id: 'w9_7', chapter: 9, jp: '耳', phonetic: '미미', kr: '귀' },
  { id: 'w9_8', chapter: 9, jp: '鼻', phonetic: '하나', kr: '코' },
  { id: 'w9_9', chapter: 9, jp: '口', phonetic: '쿠치', kr: '입' },
  { id: 'w9_10', chapter: 9, jp: '手', phonetic: '테', kr: '손' },

  // Chapter 10: 일상 문구
  { id: 'w10_1', chapter: 10, jp: 'はい', phonetic: '하이', kr: '네' },
  { id: 'w10_2', chapter: 10, jp: 'いいえ', phonetic: '이-에', kr: '아니요' },
  { id: 'w10_3', chapter: 10, jp: 'すみません', phonetic: '스미마센', kr: '미안합니다/실례합니다' },
  { id: 'w10_4', chapter: 10, jp: '大丈夫', phonetic: '다이죠-부', kr: '괜찮음' },
  { id: 'w10_5', chapter: 10, jp: 'ちょっと', phonetic: '춋토', kr: '잠깐' },
  { id: 'w10_6', chapter: 10, jp: 'もっと', phonetic: '못토', kr: '더' },
  { id: 'w10_7', chapter: 10, jp: '本当', phonetic: '혼토-', kr: '정말' },
  { id: 'w10_8', chapter: 10, jp: 'もちろん', phonetic: '모치론', kr: '물론' },
  { id: 'w10_9', chapter: 10, jp: '一緒に', phonetic: '잇쇼니', kr: '함께' },
  { id: 'w10_10', chapter: 10, jp: '一人で', phonetic: '히토리데', kr: '혼자서' }
];
