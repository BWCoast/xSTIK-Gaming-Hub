/**
 * xSTIK POKER CARD DECK — MASTER DEFINITION
 * ============================================
 * PROTECTED FILE — DO NOT MODIFY
 * 
 * Contains all 52 standard playing cards mapped to xSTIK NFT data.
 * Source: xstik.csv (Poker Card tier)
 * 
 * Each card has:
 *   - name: Human-readable (e.g., "Ace of Spades")
 *   - rank: Game shorthand (A, 2-10, J, Q, K)
 *   - suit: Hearts, Diamonds, Clubs, Spades
 *   - value: Numeric game value (Aces = 11, face = 10)
 *   - ace: Boolean flag for Ace special handling
 *   - nftId: xSTIK NFT ID from XRPL
 *   - primaryUrl: Google Storage CDN URL (empty = no CDN image)
 *   - fallbackPath: Local fallback image path
 * 
 * Cards missing Google Storage URLs (use fallback only):
 *   - 1261: Ace of Diamonds
 *   - 1275: 3 of Hearts
 *   - 1290: Queen of Diamonds
 *   - 1292: 5 of Diamonds
 */

const XSTIK_POKER_DECK = [
  // ===== HEARTS =====
  { name:'Ace of Hearts',    rank:'A',  suit:'Hearts',   value:11, ace:true,  nftId:1276, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63367', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1276.png' },
  { name:'2 of Hearts',      rank:'2',  suit:'Hearts',   value:2,  ace:false, nftId:1245, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63368', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1245.png' },
  { name:'3 of Hearts',      rank:'3',  suit:'Hearts',   value:3,  ace:false, nftId:1275, primaryUrl:'', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1275.png' },
  { name:'4 of Hearts',      rank:'4',  suit:'Hearts',   value:4,  ace:false, nftId:1270, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63371', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1270.png' },
  { name:'5 of Hearts',      rank:'5',  suit:'Hearts',   value:5,  ace:false, nftId:1244, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63372', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1244.png' },
  { name:'6 of Hearts',      rank:'6',  suit:'Hearts',   value:6,  ace:false, nftId:1264, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63373', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1264.png' },
  { name:'7 of Hearts',      rank:'7',  suit:'Hearts',   value:7,  ace:false, nftId:1248, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63374', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1248.png' },
  { name:'8 of Hearts',      rank:'8',  suit:'Hearts',   value:8,  ace:false, nftId:1247, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63375', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1247.png' },
  { name:'9 of Hearts',      rank:'9',  suit:'Hearts',   value:9,  ace:false, nftId:1286, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63376', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1286.png' },
  { name:'10 of Hearts',     rank:'10', suit:'Hearts',   value:10, ace:false, nftId:1265, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63377', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1265.png' },
  { name:'Jack of Hearts',   rank:'J',  suit:'Hearts',   value:10, ace:false, nftId:1249, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63378', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1249.png' },
  { name:'Queen of Hearts',  rank:'Q',  suit:'Hearts',   value:10, ace:false, nftId:1246, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63379', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1246.png' },
  { name:'King of Hearts',   rank:'K',  suit:'Hearts',   value:10, ace:false, nftId:1284, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63380', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1284.png' },

  // ===== DIAMONDS =====
  { name:'Ace of Diamonds',  rank:'A',  suit:'Diamonds', value:11, ace:true,  nftId:1261, primaryUrl:'', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1261.png' },
  { name:'2 of Diamonds',    rank:'2',  suit:'Diamonds', value:2,  ace:false, nftId:1271, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63381', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1271.png' },
  { name:'3 of Diamonds',    rank:'3',  suit:'Diamonds', value:3,  ace:false, nftId:1269, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63382', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1269.png' },
  { name:'4 of Diamonds',    rank:'4',  suit:'Diamonds', value:4,  ace:false, nftId:1258, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63383', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1258.png' },
  { name:'5 of Diamonds',    rank:'5',  suit:'Diamonds', value:5,  ace:false, nftId:1292, primaryUrl:'', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1292.png' },
  { name:'6 of Diamonds',    rank:'6',  suit:'Diamonds', value:6,  ace:false, nftId:1267, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63385', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1267.png' },
  { name:'7 of Diamonds',    rank:'7',  suit:'Diamonds', value:7,  ace:false, nftId:1254, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63386', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1254.png' },
  { name:'8 of Diamonds',    rank:'8',  suit:'Diamonds', value:8,  ace:false, nftId:1255, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63387', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1255.png' },
  { name:'9 of Diamonds',    rank:'9',  suit:'Diamonds', value:9,  ace:false, nftId:1291, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63388', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1291.png' },
  { name:'10 of Diamonds',   rank:'10', suit:'Diamonds', value:10, ace:false, nftId:1278, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63389', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1278.png' },
  { name:'Jack of Diamonds', rank:'J',  suit:'Diamonds', value:10, ace:false, nftId:1272, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63391', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1272.png' },
  { name:'Queen of Diamonds',rank:'Q',  suit:'Diamonds', value:10, ace:false, nftId:1290, primaryUrl:'', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1290.png' },
  { name:'King of Diamonds', rank:'K',  suit:'Diamonds', value:10, ace:false, nftId:1287, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63393', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1287.png' },

  // ===== CLUBS =====
  { name:'Ace of Clubs',     rank:'A',  suit:'Clubs',    value:11, ace:true,  nftId:1277, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63417', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1277.png' },
  { name:'2 of Clubs',       rank:'2',  suit:'Clubs',    value:2,  ace:false, nftId:1253, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63407', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1253.png' },
  { name:'3 of Clubs',       rank:'3',  suit:'Clubs',    value:3,  ace:false, nftId:1281, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63408', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1281.png' },
  { name:'4 of Clubs',       rank:'4',  suit:'Clubs',    value:4,  ace:false, nftId:1268, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63409', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1268.png' },
  { name:'5 of Clubs',       rank:'5',  suit:'Clubs',    value:5,  ace:false, nftId:1273, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63410', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1273.png' },
  { name:'6 of Clubs',       rank:'6',  suit:'Clubs',    value:6,  ace:false, nftId:1259, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63411', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1259.png' },
  { name:'7 of Clubs',       rank:'7',  suit:'Clubs',    value:7,  ace:false, nftId:1279, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63412', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1279.png' },
  { name:'8 of Clubs',       rank:'8',  suit:'Clubs',    value:8,  ace:false, nftId:1285, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63424', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1285.png' },
  { name:'9 of Clubs',       rank:'9',  suit:'Clubs',    value:9,  ace:false, nftId:1288, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63415', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1288.png' },
  { name:'10 of Clubs',      rank:'10', suit:'Clubs',    value:10, ace:false, nftId:1289, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63416', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1289.png' },
  { name:'Jack of Clubs',    rank:'J',  suit:'Clubs',    value:10, ace:false, nftId:1257, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63418', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1257.png' },
  { name:'Queen of Clubs',   rank:'Q',  suit:'Clubs',    value:10, ace:false, nftId:1242, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63419', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1242.png' },
  { name:'King of Clubs',    rank:'K',  suit:'Clubs',    value:10, ace:false, nftId:1274, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63423', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1274.png' },

  // ===== SPADES =====
  { name:'Ace of Spades',    rank:'A',  suit:'Spades',   value:11, ace:true,  nftId:1283, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63403', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1283.png' },
  { name:'2 of Spades',      rank:'2',  suit:'Spades',   value:2,  ace:false, nftId:1243, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63394', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1243.png' },
  { name:'3 of Spades',      rank:'3',  suit:'Spades',   value:3,  ace:false, nftId:1252, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63395', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1252.png' },
  { name:'4 of Spades',      rank:'4',  suit:'Spades',   value:4,  ace:false, nftId:1282, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63396', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1282.png' },
  { name:'5 of Spades',      rank:'5',  suit:'Spades',   value:5,  ace:false, nftId:1260, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63397', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1260.png' },
  { name:'6 of Spades',      rank:'6',  suit:'Spades',   value:6,  ace:false, nftId:1280, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63398', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1280.png' },
  { name:'7 of Spades',      rank:'7',  suit:'Spades',   value:7,  ace:false, nftId:1266, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63399', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1266.png' },
  { name:'8 of Spades',      rank:'8',  suit:'Spades',   value:8,  ace:false, nftId:1293, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63400', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1293.png' },
  { name:'9 of Spades',      rank:'9',  suit:'Spades',   value:9,  ace:false, nftId:1263, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63401', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1263.png' },
  { name:'10 of Spades',     rank:'10', suit:'Spades',   value:10, ace:false, nftId:1251, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63402', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1251.png' },
  { name:'Jack of Spades',   rank:'J',  suit:'Spades',   value:10, ace:false, nftId:1250, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63404', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1250.png' },
  { name:'Queen of Spades',  rank:'Q',  suit:'Spades',   value:10, ace:false, nftId:1256, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63405', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1256.png' },
  { name:'King of Spades',   rank:'K',  suit:'Spades',   value:10, ace:false, nftId:1262, primaryUrl:'https://storage.googleapis.com/nft-assets-public/data/rN2BCBn5qPHJJnGYkunD2dGqBJbr89yWDV/63406', fallbackPath:'/SHARED-CORE/assets/fallback-images/poker-card/1262.png' }
];

// Card back image path
const CARD_BACK_PATH = '/SHARED-CORE/assets/cardback.jpg';

// Suit symbols for SVG placeholder fallback
const SUIT_SYMBOLS = { Hearts: '♥', Diamonds: '♦', Clubs: '♣', Spades: '♠' };
const SUIT_COLORS  = { Hearts: '#ef4444', Diamonds: '#ef4444', Clubs: '#1a1a1a', Spades: '#1a1a1a' };
