//{아파트 스펙터클 프로젝트}

let img;
let maskImg; 
let depthMaskImg;

//시대별 이미지 마스크 전역변수
let eraImages = [];
let eraMasks = [];
let eraDepthMasks = [];
let useDepthMask = true;

// depthMask (흰/연회/짙은회/검)
let depthCuts = [230, 160, 90];
let maskInvert = false;

// 폰트(고딕)
let fontG;

// 시기: 0: 1960s, 1: 1980s, 2: 2000s, 3: 2020s
let currentEra = 0;
let lastEra = 0;

// 시대별 이미지 깔리는 판 크기
let planeWidths = [];
let planeHeights = [];

// 텍스트 블럭이 배치되는 그리드 크기
let gridW;
let gridH;

// 텍스트 박스 관련
let cellSize = 10; // 모든 시대 공통 블럭 크기
let blocks = [];
let fontSize = 7;
let padX = 1;
let padY = 2;
let textOffsetY = 0;

// buildLevel 범위
let minBuildLevel = Infinity;
let maxBuildLevel = -Infinity;

// <슬라이더 관련>
let densitySlider;
let eraSlider;

let sliderWidth = 200;
let sliderHeight = 16;

let densityLabel;
let eraLabel;

// 리셋 버튼, 전시 설명
let resetButton;
let descP;
let legendDiv;

// 비율 버튼
let ratioButton;
let showRatioMode = false;

// 그래프 모드용(현재 시대 기준)
let ratioBins = [];
let ratioOrder = [];
let ratioTotal = 0;

// 캔버스/카메라
let cnv;
let cameraRotX = 0;
let cameraRotY = 0;
let maxRotY;
let maxRotX;

// 스크롤 줌용 전역 배율
let zoomFactor = 1.0;

// 슬라이더 드래그 중인지 여부
let draggingSlider = false;

// 빌드 애니메이션
let buildAnim = 0;

// 시대별 아파트
let eraAptNames = [
  "[마포 아파트]",
  "[아시아 선수촌 아파트]",
  "[타워팰리스]",
  "[아크로서울포레스트]"
];

// 6개 카테고리/색상 (HSB)
let keywordCategories = {
  techFuture:   { name: "기술과 미래",   color: [60, 100, 100] },   // 노랑
  comfortSafe:  { name: "편의와 안전",   color: [230, 100, 100] },  // 파랑
  wellbeing:    { name: "웰빙",         color: [120, 100, 100] },  // 초록
  premium:      { name: "프리미엄",     color: [300, 100, 100] },  // 핑크
  location:     { name: "입지",         color: [180, 100, 100] },  // 하늘
  asset:        { name: "자산과 투자",  color: [0, 100, 100] }     // 빨강
};

// 키워드 카테고리 매핑
let keywordCategoryMap = {
  // (1) 기술과 미래
  "현대식": "techFuture",
  "근대문명": "techFuture",
  "생활개혁": "techFuture",
  "생활혁명": "techFuture",
  "구조": "techFuture",
  "공법": "techFuture",
  "내진설계": "techFuture",
  "에너지": "techFuture",
  "컬러TV": "techFuture",
  "서구식": "techFuture",
  "첨단": "techFuture",
  "시스템": "techFuture",
  "자동화": "techFuture",
  "디지털": "techFuture",
  "스마트": "techFuture",
  "미래": "techFuture",
  "미래기술": "techFuture",
  "지속가능": "techFuture",

  // (2) 편의와 안전
  "시설": "comfortSafe",
  "엘리베이터": "comfortSafe",
  "가스": "comfortSafe",
  "설계": "comfortSafe",
  "편리": "comfortSafe",
  "난방": "comfortSafe",
  "수세식": "comfortSafe",
  "수세식 화장실": "comfortSafe",
  "주방": "comfortSafe",
  "샤워실": "comfortSafe",
  "시공": "comfortSafe",
  "자재": "comfortSafe",
  "품질": "comfortSafe",
  "경비": "comfortSafe",
  "안전": "comfortSafe",
  "복지시설": "comfortSafe",
  "편의시설": "comfortSafe",
  "빌트인": "comfortSafe",
  "마감재": "comfortSafe",

  // (3) 웰빙
  "놀이터": "wellbeing",
  "유치원": "wellbeing",
  "공동생활": "wellbeing",
  "웰빙": "wellbeing",
  "친환경": "wellbeing",
  "녹지": "wellbeing",
  "조경": "wellbeing",
  "자연": "wellbeing",
  "힐링": "wellbeing",
  "개성": "wellbeing",
  "편안함": "wellbeing",
  "자연친화": "wellbeing",
  "가족적": "wellbeing",
  "커뮤니티": "wellbeing",
  "피트니스": "wellbeing",
  "골프": "wellbeing",
  "단지조경": "wellbeing",
  "환경": "wellbeing",
  "숲": "wellbeing",
  "공원": "wellbeing",
  "건강": "wellbeing",

  // (4) 프리미엄
  "고급": "premium",
  "최대규모": "premium",
  "혜택": "premium",
  "성과": "premium",
  "우아한": "premium",
  "아름다움": "premium",
  "웅장": "premium",
  "품위": "premium",
  "명성": "premium",
  "최고": "premium",
  "최고급": "premium",
  "특급": "premium",
  "상류사회": "premium",
  "스위트홈": "premium",
  "갤러리": "premium",
  "주택문화관": "premium",
  "세련": "premium",
  "감각": "premium",
  "멋": "premium",
  "브랜드": "premium",
  "명품": "premium",
  "프리미엄": "premium",
  "힐스테이트": "premium",
  "래미안": "premium",
  "푸르지오": "premium",
  "유럽양식": "premium",
  "차별화": "premium",
  "디자인": "premium",
  "예술": "premium",
  "환상": "premium",
  "랜드마크": "premium",
  "초고층": "premium",
  "마천루": "premium",
  "하이엔드": "premium",
  "주거상품": "premium",
  "명품주거": "premium",
  "라운지": "premium",
  "프레스티지": "premium",
  "시그니처": "premium",

  // (5) 입지
  "교통": "location",
  "남향": "location",
  "사회성": "location",
  "생활권": "location",
  "교육": "location",
  "학군": "location",
  "뉴타운": "location",
  "교통망": "location",
  "중심": "location",
  "역세권": "location",
  "초역세권": "location",
  "중심입지": "location",
  "오션뷰": "location",
  "파노라마": "location",

  // (6) 자산과 투자
  "경제적": "asset",
  "관리비": "asset",
  "6층": "asset",
  "분양가": "asset",
  "가격": "asset",
  "절약": "asset",
  "연료비": "asset",
  "가치": "asset",
  "전세금": "asset",
  "이익": "asset",
  "비용절감": "asset",
  "경제성": "asset"
};

// <인덱스 비율 함수 코드들>
function getKeywordCategory(word) {
  return keywordCategoryMap[word] || "comfortSafe";
}

// target 자동 산출
function computeTargetFromWords(wordsArr, useUnique = false) {
  let counts = { techFuture: 0, comfortSafe: 0, wellbeing: 0, premium: 0, location: 0, asset: 0 };
  let arr = useUnique ? [...new Set(wordsArr)] : wordsArr;

  for (let w of arr) {
    let cat = getKeywordCategory(w);
    counts[cat] = (counts[cat] || 0) + 1;
  }

  let total = 0;
  for (let c in counts) total += counts[c];

  let target = {};
  if (total <= 0) {
    let uni = 1 / 6;
    for (let c in counts) target[c] = uni;
    return target;
  }

  for (let c in counts) target[c] = counts[c] / total;

  let sum = 0;
  for (let c in target) sum += target[c];
  if (sum > 0) {
    for (let c in target) target[c] /= sum;
  }
  return target;
}

function buildWordsByCategory(wordsArr) {
  let byCat = {};
  for (let w of wordsArr) {
    let cat = getKeywordCategory(w);
    if (!byCat[cat]) byCat[cat] = [];
    byCat[cat].push(w);
  }
  return byCat;
}

function pickFittableWordWithCells(pool, maxCells) {
  if (!pool || pool.length === 0) return null;

  let shuffled = pool.slice();
  shuffle(shuffled, true);

  for (let candidate of shuffled) {
    if (candidate.length > 4) continue;

    let baseW = textWidth(candidate) + padX * 2;

    let cells = 0;
    if (candidate.length === 1) {
      if (baseW > cellSize || maxCells < 1) continue;
      cells = 1;
    } else {
      let minCellsByWidth = ceil(baseW / cellSize);
      if (minCellsByWidth < 2) minCellsByWidth = 2;
      if (minCellsByWidth > 4) continue;
      if (minCellsByWidth > maxCells) continue;
      cells = minCellsByWidth;
    }

    let wBox = cells * cellSize;
    if (baseW > wBox) continue;

    return { txt: candidate, cells: cells, wBox: wBox };
  }
  return null;
}

// <시대별 단어들>
let eraWords = [
  ["시설","엘리베이터","현대식","교통","가스","설계","편리","경제적","관리비","현대식","고급",
  "6층","난방","수세식","수세식 화장실","주방","샤워실","놀이터","유치원","생활개혁","공동생활",
  "최대규모","근대문명","혜택","성과","생활혁명","남향","우아한","아름다움","웅장"],

  ["구조","시공","공법","자재","품질","내진설계","경비","안전","경제적","관리비","복지시설","품위",
  "교육","명성","분양가","가격","절약","에너지","연료비","가치","전세금","이익","비용절감","경제성",
  "사회성","생활권","최고","고급","최고급","서구식","특급","상류사회","스위트홈","갤러리","주택문화관",
  "컬러TV","세련","감각","멋","웅장"],

  ["첨단","시스템","자동화","편의시설","디지털","스마트","빌트인","웰빙","친환경","녹지","조경",
  "자연","힐링","개성","편안함","자연친화","가족적","첨단","시스템","편의시설","브랜드","명품",
  "프리미엄","힐스테이트","래미안","푸르지오","가치","교육","학군","커뮤니티","피트니스","골프",
  "단지조경","유럽양식","차별화","미래","뉴타운","예술","감각","환상"],

  ["교통망","중심","환경","프리미엄","역세권","디자인","오션뷰","파노라마","랜드마크","랜드마크","초고층",
  "마천루","하이엔드","주거상품","명품주거","초역세권","역세권","중심입지","라운지","커뮤니티","차별화",
  "최고급","마감재","미래기술","지속가능","프레스티지","시그니처","자연친화","숲","공원","웰빙","건강",
  "녹지","힐링","친환경","시그니처","환상"]
];
// 사이드 이펙트 단어들
let eraHoverWords = [
  ["주택난","불도저","개발","민심공략","정치적","선전","난개발","자금난","군사혁명","예산부족",
  "분양대금","기초자재","기술부족","부정부패","성냥갑"],

  ["투기","계급화","철거민","고층화","고밀화","용역깡패","분쟁","투쟁","복부인"],

  ["강남불패","투기","버블","계급화","집값상승","가격폭등","주거난"],

  ["영끌","빚투","역전세난","청약광풍","전세사기","인프라격차","빗장공동체","투기과열","벼락거지"]
];

// 텍스트 박스 단어들
let words = [];
let hoverWords = [];

function setEraText(idx) {
  words = eraWords[idx];
  hoverWords = eraHoverWords[idx];
}

function preload() {
  //이미지, 폰트 로드
  fontG = loadFont("asset/AppleSDGothicNeoR.ttf");

  eraImages[0] = loadImage("asset/1960.jpg");
  eraMasks[0]  = loadImage("asset/1960_mask.png");
  eraDepthMasks[0] = loadImage("asset/1960_depthmask.png"); 

  eraImages[1] = loadImage("asset/1980.jpg");
  eraMasks[1]  = loadImage("asset/1980_mask.png");
  eraDepthMasks[1] = loadImage("asset/1980_depthmask.png"); 

  eraImages[2] = loadImage("asset/2000.jpg");
  eraMasks[2]  = loadImage("asset/2000_mask.png");
  eraDepthMasks[2] = loadImage("asset/2000_depthmask.png"); 

  eraImages[3] = loadImage("asset/2020.jpg");
  eraMasks[3]  = loadImage("asset/2020_mask.png");
}

function setup() {
  cnv = createCanvas(950, 750, WEBGL);
  centerCanvas();

  maxRotY = PI / 6;
  maxRotX = PI / 12;

  textFont(fontG);
  textSize(fontSize);
  textAlign(CENTER, CENTER);
  textOffsetY = -fontSize * 0.15;

  // 캔버스 높이를 기준으로 시대별 화면 크기 계산
  let targetH = height;
  for (let i = 0; i < eraImages.length; i++) {
    if (eraImages[i]) {
      let iw = eraImages[i].width;
      let ih = eraImages[i].height;
      let s  = targetH / ih;
      planeHeights[i] = targetH;
      planeWidths[i]  = iw * s;
    }
  }

  // 2000년대 폭 기준 통일
  let basePlaneW = planeWidths[2];
  for (let i = 0; i < planeWidths.length; i++) {
    if (i === 2) continue;
    let scale = basePlaneW / planeWidths[i];
    planeWidths[i]  *= scale;
    planeHeights[i] *= scale;
  }

  currentEra = 0;
  lastEra = 0;
  updateEraAssets(0);

  // <슬라이더>
  densitySlider = createSlider(0, 100, 100);
  densitySlider.style("width", sliderWidth + "px");

  eraSlider = createSlider(0, 3, 0, 1);
  eraSlider.style("width", sliderWidth + "px");

  densityLabel = createP("건축하기");
  densityLabel.style("color", "#888");
  densityLabel.style("margin", "0");
  densityLabel.style("font-size", "12px");

  eraLabel = createP("시간여행 (1960 / 1980 / 2000 / 2020)");
  eraLabel.style("color", "#888");
  eraLabel.style("margin", "0");
  eraLabel.style("font-size", "12px");

  //(리셋 버튼)
  resetButton = createButton("되돌리기");
  resetButton.mousePressed(resetCamera);
  // 기본 스타일
  resetButton.style("padding", "6px 14px");
  resetButton.style("font-size", "11px");
  resetButton.style("background", "#eee");
  resetButton.style("border", "1px solid #ccc");
  resetButton.style("cursor", "pointer");
  //완전 둥근 끝(알약형태)
  resetButton.style("border-radius", "9999px");
  resetButton.style("line-height", "1");
  // 가운데 정렬 쉽게
  resetButton.style("display", "inline-flex");
  resetButton.style("align-items", "center");
  resetButton.style("justify-content", "center");

  // (비율 버튼)
  ratioButton = createButton("비율 층위");
  ratioButton.mousePressed(() => {
  showRatioMode = !showRatioMode;
  ratioButton.html(showRatioMode ? "비율 층위: 켜짐" : "비율 층위");});
  ratioButton.style("padding", "6px 14px");
  ratioButton.style("font-size", "11px");
  ratioButton.style("background", "#eee");
  ratioButton.style("border", "1px solid #ccc");
  ratioButton.style("cursor", "pointer");
  ratioButton.style("border-radius", "9999px");
  ratioButton.style("line-height", "1");
  ratioButton.style("display", "inline-flex");
  ratioButton.style("align-items", "center");
  ratioButton.style("justify-content", "center");

  // 전시 설명
  let descHtml =
    "1960년대 한국에서 아파트는 낯설고, 성냥갑 같은 건축물에 가까웠다. 그러나 새마을 운동을 비롯한 국가의 근대화 정책이 본격화 되면서,<br>아파트는 점차 이상적 생활 양식을 상징하는 ’홈, 스위트 홈’이 되었다. 당시 대중에게 익숙<br>하지 않았던 스페이스, 맨숀, 뉴스타일과 같은 외래어들은 서구적인 삶을 연상시키는 환상의<br>장치가 되었고, 아파트는 곧 근대적이고 세련된 중산층의 표상으로 자리 잡았다. 시간이 흐르며 아파트를 둘러싼 난해하고 과장된 단어들은<br>사람들의 계층적 욕망과 불평등한 현실을 <br>드러내게 되었다." +
    "본 프로젝트는 이러한 선전적 언어가 만들어 낸 아파트의 ‘환상’과 그 이면에 감춰진 부작용을 텍스트 픽셀과 인터랙션을<br>통해 시각적으로 드러내고자 한다.";

  descP = createP(descHtml);
  descP.style("color", "#444");
  descP.style("margin", "0");
  descP.style("font-size", "11px");
  descP.style("line-height", "1.6");
  descP.style("width", sliderWidth + "px");

  legendDiv = createDiv();
  legendDiv.html(`
    <div style="font-size:11px; color:#444; margin-top:0x;">
      <div style="margin-bottom:8px;"><색상 인덱스></div>
      <div style="display:flex; align-items:center; margin-bottom:3px;">
        <span style="display:inline-block; width:10px; height:10px; background:#ffff00; margin-right:6px;"></span>
        기술과 미래
      </div>
      <div style="display:flex; align-items:center; margin-bottom:3px;">
        <span style="display:inline-block; width:10px; height:10px; background:#0000ff; margin-right:6px;"></span>
        편의와 안전
      </div>
      <div style="display:flex; align-items:center; margin-bottom:3px;">
        <span style="display:inline-block; width:10px; height:10px; background:#00ff00; margin-right:6px;"></span>
        웰빙
      </div>
      <div style="display:flex; align-items:center; margin-bottom:3px;">
        <span style="display:inline-block; width:10px; height:10px; background:#ff00ff; margin-right:6px;"></span>
        프리미엄
      </div>
      <div style="display:flex; align-items:center; margin-bottom:3px;">
        <span style="display:inline-block; width:10px; height:10px; background:#00ced1; margin-right:6px;"></span>
        입지
      </div>
      <div style="display:flex; align-items:center;">
        <span style="display:inline-block; width:10px; height:10px; background:#ff0000; margin-right:6px;"></span>
        자산과 투자
      </div>
    </div>`);
  legendDiv.style("margin", "0");
  legendDiv.style("padding", "0");
  placeUI();
}

// 특정 시대마다 이미지/마스크/블럭 재세팅
function updateEraAssets(idx) {
  img = eraImages[idx];
  maskImg = eraMasks[idx];
  depthMaskImg = eraDepthMasks[idx] || null;

  // 정수화 (resize 안정)
  gridW = floor(planeWidths[idx]);
  gridH = floor(planeHeights[idx]);

  if (maskImg) {
    maskImg.resize(gridW, gridH);
    maskImg.loadPixels();
  }

  //마스크 인식(검정, 하양)
  maskInvert = false;
  if (maskImg) {
    let samples = 120;
    let sumB = 0;

    // 밝기가 컬러모드의 영향을 받을 수 있으니 RGB를 기준으로
    colorMode(RGB, 255);

    for (let i = 0; i < samples; i++) {
      let sx = floor(random(0, gridW));
      let sy = floor(random(0, gridH));
      let c = maskImg.get(sx, sy);
      sumB += brightness(c);
    }

    let avgB = sumB / samples;
    if (avgB > 140) maskInvert = true;
  }

  if (depthMaskImg) {
    depthMaskImg.resize(gridW, gridH);
    depthMaskImg.loadPixels();
  }

  // depthCuts = [흰컷, 연회색, 짙은회색] (0~255)
  if (useDepthMask && depthMaskImg && maskImg) {
    const MASK_WHITE = 50;

    function isInMaskLocal(x, y) {
      let c = maskImg.get(x, y);
      // 알파가 있으면 알파 우선
      if (alpha(c) > 10) return true;
      // 알파가 거의 없으면 밝기로
      let b = brightness(c);
      return maskInvert ? (b < 255 - MASK_WHITE) : (b > MASK_WHITE);
    }

    // 샘플링해서 depth 밝기값 모으기(건물 영역만)
    let vals = [];
    let samples = 900;
    colorMode(RGB, 255);

    for (let i = 0; i < samples; i++) {
      let sx = floor(random(0, gridW));
      let sy = floor(random(0, gridH));
      if (!isInMaskLocal(sx, sy)) continue;

      let d = brightness(depthMaskImg.get(sx, sy));
      vals.push(d);
    }

    if (vals.length >= 80) {
      vals.sort((a, b) => a - b);

      // 분포 기반 컷(상단/중단/하단을 자연스럽게 나눔)
      // 흰(가장 밝은 층) / 연회 / 짙은회 / 검(가장 어두운 층)
      let q = (p) => vals[floor((vals.length - 1) * p)];

      let Twhite     = q(0.80); // 상위 20% 근처
      let TlightGray = q(0.55); // 중간 상단
      let TdarkGray  = q(0.30); // 중간 하단

      // 너무 붙으면 단계가 안 보여서 최소 간격 
      const MIN_GAP = 22;
      if (Twhite - TlightGray < MIN_GAP) TlightGray = Twhite - MIN_GAP;
      if (TlightGray - TdarkGray < MIN_GAP) TdarkGray = TlightGray - MIN_GAP;

      Twhite     = constrain(Twhite, 180, 250);
      TlightGray = constrain(TlightGray, 80, Twhite - 10);
      TdarkGray  = constrain(TdarkGray, 15, TlightGray - 10);

      depthCuts = [Twhite, TlightGray, TdarkGray];
    } else {
      // 샘플이 너무 적으면 기본값 유지
      depthCuts = [230, 160, 90];
    }
  } else {
    depthCuts = [230, 160, 90];
  }

  setEraText(idx);

  // 전 시대 고딕 통일
  textFont(fontG);

  regenerateBlocks();

  buildAnim = 0;
}

// 카메라 리셋
function resetCamera() {
  cameraRotX = 0;
  cameraRotY = 0;
  zoomFactor = 1.0;
}

// 블록 생성
function regenerateBlocks() {

  function getDepthLevelAt(px, py) {
  if (!useDepthMask || !depthMaskImg) return 0; // 0=흰(기본)
  let d = brightness(depthMaskImg.get(px, py)); // 0~255

  // depthCuts: [Twhite, TlightGray, TdarkGray]
  let Twhite = depthCuts[0];
  let Tlg    = depthCuts[1];
  let Tdg    = depthCuts[2];

  if (d >= Twhite) return 0; // 흰
  if (d >= Tlg)    return 1; // 연회
  if (d >= Tdg)    return 2; // 짙은회
  return 3;                  // 검
}

  randomSeed(millis());
  blocks = [];
  minBuildLevel = Infinity;
  maxBuildLevel = -Infinity;

  if (!maskImg) return;

  // 마스크 샘플링은 RGB 기준이 안전
  colorMode(RGB, 255);

  // binary mask 판정 기준(밝기)
  const MASK_WHITE = 50;

  function fillProbByDepthLevel(lv) {
    if (lv === 0) return 1.00;
    if (lv === 1) return 0.85;
    return 0.70;
  }

  // 마스크 판정 함수
  // 1순위: 알파(투명도) 기반
  // 2순위: 밝기 기반
  function isInMask(x, y) {
    let c = maskImg.get(x, y);

    // 알파가 있으면 알파로 우선 판정
    if (alpha(c) > 10) return true;

    // 알파가 거의 없으면 밝기로 판정
    let b = brightness(c);
    return maskInvert ? (b < 255 - MASK_WHITE) : (b > MASK_WHITE);
  }

  //depth 기반 "채움 확률"
  function depthFillProb(depth01) {
    return map(depth01, 0, 1, 0.15, 1.0);
  }

  // (1) target 자동 산출
  let target = computeTargetFromWords(words, false);

  // (2) 총 셀 예산 계산
  let totalCellsBudget = 0;
  for (let yy = 0; yy < gridH; yy += cellSize) {
    for (let xx = 0; xx < gridW; xx += cellSize) {
      let sx = min(xx + cellSize / 2, gridW - 1);
      let sy = min(yy + cellSize / 2, gridH - 1);
      if (isInMask(sx, sy)) totalCellsBudget++;
    }
  }
  if (totalCellsBudget <= 0) return;

  // (3) target -> quotaCells(할당량)
  let quotaCells = { techFuture: 0, comfortSafe: 0, wellbeing: 0, premium: 0, location: 0, asset: 0 };
  let remainders = [];
  let used = 0;

  for (let cat in quotaCells) {
    let raw = (target[cat] || 0) * totalCellsBudget;
    let base = floor(raw);
    quotaCells[cat] = base;
    used += base;
    remainders.push({ cat: cat, rem: raw - base });
  }

  let wordsByCategory = buildWordsByCategory(words);

  function pickCategoryByQuota(quotaObj) {
    let sum = 0;
    for (let cat in quotaObj) if (quotaObj[cat] > 0) sum += quotaObj[cat];
    if (sum <= 0) return null;

    let r = random(sum);
    for (let cat in quotaObj) {
      let v = quotaObj[cat];
      if (v <= 0) continue;
      r -= v;
      if (r <= 0) return cat;
    }
    return null;
  }

  for (let y = gridH - cellSize; y >= 0; y -= cellSize) {
    let x = 0;

    while (x < gridW) {
      let sampleX = min(x + cellSize / 2, gridW - 1);
      let sampleY = min(y + cellSize / 2, gridH - 1);

      if (!isInMask(sampleX, sampleY)) {
        x += cellSize;
        continue;
      }

      let depthLevel = getDepthLevelAt(sampleX, sampleY);

      // 연속 구간(runCells) 계산
      let runCells = 0;
      for (let cx = x; cx < gridW; cx += cellSize) {
        let centerX = min(cx + cellSize / 2, gridW - 1);
        if (isInMask(centerX, sampleY)) runCells++;
        else break;
      }

      if (runCells === 0) {
        x += cellSize;
        continue;
      }

      let maxCells = min(4, runCells);

      // quota 남은 카테고리 선택
      let chosenCategoryKey = pickCategoryByQuota(quotaCells);
      if (!chosenCategoryKey) {
        x += cellSize;
        continue;
      }

      let allowedCells = min(maxCells, quotaCells[chosenCategoryKey]);
      if (allowedCells < 1) {
        quotaCells[chosenCategoryKey] = 0;
        x += cellSize;
        continue;
      }

      // 단어 뽑기
      let picked = pickFittableWordWithCells(wordsByCategory[chosenCategoryKey], allowedCells);

      // fallback
      if (!picked) {
        let cats = Object.keys(quotaCells);
        shuffle(cats, true);
        let found = null, foundCat = null;

        for (let c2 of cats) {
          if (quotaCells[c2] <= 0) continue;
          let allow2 = min(maxCells, quotaCells[c2]);
          if (allow2 < 1) continue;

          let cand2 = pickFittableWordWithCells(wordsByCategory[c2], allow2);
          if (cand2) { found = cand2; foundCat = c2; break; }
        }

        if (!found) {

          let w = cellSize;
          let h = cellSize;

          let cy = y + h / 2;
          let buildLevel = cy;
          minBuildLevel = min(minBuildLevel, buildLevel);
          maxBuildLevel = max(maxBuildLevel, buildLevel);

          let categoryColor = keywordCategories["comfortSafe"].color;

          blocks.push({
            x, y, w, h,
            txt: "",
            altTxt: null,
            baseHue: categoryColor[0],
            baseSat: categoryColor[1],
            baseBri: categoryColor[2],
            blinkSpeed: random(0.02, 0.08),
            phase: random(TWO_PI),
            buildLevel,
            appearAt: 0,
            depthLevel: depthLevel
          });

          x += cellSize;
          continue;
        }

        picked = found;
        chosenCategoryKey = foundCat;
      }

      let txt = picked.txt;
      let cells = picked.cells;
      let w = picked.wBox;
      let h = cellSize;

      let leftX = x + w * 0.1;
      let rightX = x + w * 0.9;
      let centerX2 = x + w * 0.5;

      let okL = isInMask(constrain(leftX, 0, gridW - 1), sampleY);
      let okC = isInMask(constrain(centerX2, 0, gridW - 1), sampleY);
      let okR = isInMask(constrain(rightX, 0, gridW - 1), sampleY);

      if (!okL || !okC || !okR) {
        x += cellSize;
        continue;
      }

      // 이면 텍스트(폭 맞는 것만)
      let altTxt = null;
      for (let tries = 0; tries < 60; tries++) {
        let candidateAlt = random(hoverWords);
        let altW = textWidth(candidateAlt) + padX * 2;
        if (altW <= w) { altTxt = candidateAlt; break; }
      }

      let cy = y + h / 2;
      let buildLevel = cy;

      minBuildLevel = min(minBuildLevel, buildLevel);
      maxBuildLevel = max(maxBuildLevel, buildLevel);

      let categoryColor = keywordCategories[chosenCategoryKey].color;

      // quota(할당량) 차감
      quotaCells[chosenCategoryKey] = max(0, quotaCells[chosenCategoryKey] - cells);

      blocks.push({
        x, y, w, h,
        txt,
        altTxt,
        baseHue: categoryColor[0],
        baseSat: categoryColor[1],
        baseBri: categoryColor[2],
        blinkSpeed: random(0.02, 0.08),
        phase: random(TWO_PI),
        buildLevel,
        appearAt: 0,
        depthLevel: depthLevel
      });

      x += w;
    }
  }

  blocks.sort((a, b) => b.buildLevel - a.buildLevel);

  if (blocks.length > 0 && minBuildLevel !== Infinity && maxBuildLevel !== -Infinity) {
    for (let b of blocks) {
      let baseRatio = map(b.buildLevel, maxBuildLevel, minBuildLevel, 0.1, 1.0);
      let jitter = random(-0.05, 0.05);
      b.appearAt = constrain(baseRatio + jitter, 0.1, 1.0);
    }
  }


// 그래프 모드용: txt 있는 블럭에 순번 부여 + ratioBins 생성
let visible = [];
for (let b of blocks) {
  if (b.txt && b.txt.trim() !== "") visible.push(b);
}
ratioTotal = visible.length;

// buildLevel 큰 것부터
visible.sort((a,b)=> b.buildLevel - a.buildLevel);

// 각 블럭에 그래프 순번 저장
for (let i = 0; i < visible.length; i++) {
  visible[i].ratioRank = i;
}
// 카테고리 내림차순 정렬(비율 큰 순 = 인덱스 비율 순)
ratioOrder = Object.keys(target).sort((a,b)=> (target[b]||0) - (target[a]||0));

// 블럭 개수 기준으로 카운트 할당(합이 ratioTotal이 되게)
let counts = {};
let usedRatio = 0;
let rema = [];

for (let c of ratioOrder) {
  let raw = (target[c] || 0) * ratioTotal;
  let base = floor(raw);
  counts[c] = base;
  usedRatio += base;
  rema.push({cat:c, rem: raw-base});
}

let left = ratioTotal - usedRatio;

rema.sort((a,b)=> b.rem - a.rem);
let k = 0;
while (left > 0 && rema.length > 0) {
  counts[rema[k % rema.length].cat]++;
  left--;
  k++;
}

// bins(구간) 만들기: rank가 어느 구간이면 어떤 색으로 칠할지
ratioBins = [];
let acc = 0;
for (let c of ratioOrder) {
  let cnt = counts[c] || 0;
  ratioBins.push({ cat: c, from: acc, to: acc + cnt - 1, count: cnt });
  acc += cnt;
}

  // draw는 HSB 쓸 것
  colorMode(HSB, 360, 100, 100);

  
}

function draw() {
  colorMode(HSB, 360, 100, 100);
  background(0, 0, 100);

  currentEra = eraSlider.value();
  if (currentEra !== lastEra) {
    updateEraAssets(currentEra);
    lastEra = currentEra;
  }

  // buildFactor
  let targetBuild = densitySlider.value() / 100;
  buildAnim = lerp(buildAnim, targetBuild, 0.03);
  let buildFactor = buildAnim;

  if (frameCount % 60 === 0) {
    console.log("blocks:", blocks.length, "maskInvert:", maskInvert, "era:", currentEra);
  }

  // 줌
  let baseZoom = 0.85 * zoomFactor;
  let zoom = baseZoom + 0.25 * max(
    abs(cameraRotX) / maxRotX,
    abs(cameraRotY) / maxRotY
  );

  push();
  scale(zoom);
  rotateX(cameraRotX);
  rotateY(cameraRotY);

  // 아파트 이미지
  push();
  texture(img);
  noStroke();
  plane(planeWidths[currentEra], planeHeights[currentEra]);
  pop();


  // 블럭
  if (buildFactor > 0 && blocks.length > 0) {
    textAlign(CENTER, CENTER);
    textSize(fontSize);

    for (let b of blocks) {
      if (buildFactor < b.appearAt) continue;
      if (!b.txt || b.txt.trim() === "") continue;

      let cx2D = b.x + b.w / 2;
      let cy2D = b.y + b.h / 2;

      let cx3D = cx2D - gridW / 2;
      let cy3D = cy2D - gridH / 2;

      // hover는 화면좌표 기반
      let gridOffsetX = (width - gridW) / 2;
      let gridOffsetY = (height - gridH) / 2;
      let screenX = gridOffsetX + cx2D;
      let screenY = gridOffsetY + cy2D;
      let isHover = dist(mouseX, mouseY, screenX, screenY) < 70;

      let t = frameCount * b.blinkSpeed + b.phase;
      let flicker = map(sin(t), -1, 1, -35, 35);

      //<마스크 밝기 3간계>
      let lv = b.depthLevel ?? 0;
      let briMul =
       (lv === 0) ? 1.00 :  // 흰
       (lv === 1) ? 0.70 :  // 연회
       (lv === 2) ? 0.48 :  // 짙은회
                    0.25;   // 검

// 기본은 기존 색
let hue0 = b.baseHue;
let sat0 = b.baseSat;
let bri0 = b.baseBri;

// 그래프 모드면: ratioRank(0..N-1)에 따라 색을 덮어씀
if (showRatioMode && typeof b.ratioRank === "number" && ratioBins.length > 0) {
  let r = b.ratioRank;
  let chosenCat = null;

  for (let bin of ratioBins) {
    if (r >= bin.from && r <= bin.to) { chosenCat = bin.cat; break; }
  }
  if (!chosenCat) chosenCat = ratioOrder[ratioOrder.length - 1];

  let ccol = keywordCategories[chosenCat].color;
  hue0 = ccol[0];
  sat0 = ccol[1];
  bri0 = ccol[2];
}

let hue = isHover ? 0 : hue0;
let satF = isHover ? 0 : sat0;
let brF = isHover ? 0 : constrain((bri0 + flicker) * briMul, 0, 100);

      // 레벨별 '앞면(front)' 거리: 밝을수록 더 앞으로
      let zFront =
        (lv === 0) ? 92 :
        (lv === 1) ? 78 :
        (lv === 2) ? 54 : 32;

      // 뒷면(back)은 항상 이미지 plane에 붙임
      let zBack = 1.5; // 0이면 z-fighting 생길 수 있어서 살짝 띄움

      // 두께 = (앞면 - 뒷면) 즉, 밝은 블럭일수록 더 두꺼워지고 더 앞으로 나옴
      let boxD = max(2, zFront - zBack);

// box()는 중심 기준이므로, (앞면+뒷면)/2 로 중심을 잡아주면
// 뒷면은 zBack, 앞면은 zFront에 정확히 맞춰짐
let zLift = (zFront + zBack) * 0.5;

      // 박스
      push();
      translate(cx3D, cy3D, zLift);
      noStroke();
      fill(hue, satF, brF);
      box(b.w, b.h, boxD);
      pop();

// 텍스트 (화면 앞면에 딱 붙게)
push();
translate(cx3D, cy3D, zFront + 2);
fill(0, 0, isHover && b.altTxt ? 100 : 0);
text(isHover && b.altTxt ? b.altTxt : b.txt, 0, textOffsetY);
pop();
    }
  }

  pop();


//시대별 아파트 명칭
drawEraTitle();
}
function drawEraTitle() {
  push();

  // 텍스트 안 가려짐
  drawingContext.disable(drawingContext.DEPTH_TEST);

  resetMatrix();
  translate(-width / 2, -height / 2);

  // 안전하게 상태 고정
  textFont(fontG);
  textAlign(LEFT, TOP);
  textSize(12);
  noStroke();

  const padL = 68;
  const padT = 65;

  const title = eraAptNames[currentEra] || "";

  // 그림자
  fill(0, 0, 0, 55);
  text(title, padL + 1, padT + 1);

  // 본문
  fill(0, 0, 100, 95);
  text(title, padL, padT);

  // 다시 켜주기(다음 프레임 3D를 위해)
  drawingContext.enable(drawingContext.DEPTH_TEST);

  pop();
}

// 입력/UI
function mouseWheel(event) {
  zoomFactor -= event.delta * 0.0005;
  zoomFactor = constrain(zoomFactor, 0.6, 1.8);
}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function placeUI() {
  let pos = cnv.position();
  let uiX = pos.x - sliderWidth - 40;
  let uiY = pos.y + 40;

  densitySlider.position(uiX, uiY);
  densityLabel.position(uiX, uiY - 16);

  eraSlider.position(uiX, uiY + 50);
  eraLabel.position(uiX, uiY + 34);

  //버튼이랑 글들 아래로 쌓기
  //슬라이더와 버튼 사이의 간격
  let yCursor = uiY + 85;

  if (resetButton) {
    resetButton.position(uiX, yCursor);
    yCursor += (resetButton.elt?.offsetHeight || 24) + 5;
  }

  if (ratioButton) {
    ratioButton.position(uiX, yCursor);
    yCursor += (ratioButton.elt?.offsetHeight || 24) + 24;
  }

  if (descP) {
    descP.position(uiX, yCursor);
    yCursor += (descP.elt?.offsetHeight || 120) + 10;
  }

  //legendDiv(색상 인덱스): 화면 하단으로 이동 (캔버스 기준)
  if (legendDiv) {
    const marginBottom = 50; // 하단 여백
    const legendH = legendDiv.elt?.offsetHeight || 120;

    // 캔버스 아래쪽(브라우저 좌표) = pos.y + height
    let legendY = pos.y + height - legendH - marginBottom;

    legendDiv.position(uiX, legendY);
  }
}

function windowResized() {
  centerCanvas();
  placeUI();
}

function isOverSlider() {
  let mx = winMouseX;
  let my = winMouseY;

  for (let s of [densitySlider, eraSlider]) {
    let p = s.position();
    if (mx > p.x && mx < p.x + sliderWidth &&
        my > p.y && my < p.y + sliderHeight) return true;
  }
  return false;
}

function mousePressed() {
  draggingSlider = isOverSlider();
}

function mouseReleased() {
  draggingSlider = false;
}

function mouseDragged() {
  if (draggingSlider) return;
  if (isOverSlider()) return;

  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

  let sensitivity = 0.005;
  cameraRotY += movedX * sensitivity;
  cameraRotX += -movedY * sensitivity;

  cameraRotX = constrain(cameraRotX, -maxRotX, maxRotX);
  cameraRotY = constrain(cameraRotY, -maxRotY, maxRotY);
}