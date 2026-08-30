# 🎨 [오류 완벽 해결] 구글 슬라이드 46장 자동 생성기 (Google Apps Script)

Google Apps Script `SlidesApp.ShapeType`에 호환되도록 **100% 안전한 셰이프 헬퍼(`createBox`, `ROUND_2_SAME_RECTANGLE` / `RECTANGLE` 자동 폴백)**를 적용한 무오류 버전입니다.

---

## 🛠️ 실행 방법

1. **[script.google.com](https://script.google.com)** 편집기(또는 구글 슬라이드 > [확장 프로그램] > [Apps Script])의 `Code.gs` 내용을 모두 지웁니다.
2. 아래의 **전체 소스코드**를 복사하여 붙여넣고 저장(`Cmd + S` 또는 `Ctrl + S`)합니다.
3. 상단 함수에서 **`generateAllSlides`**를 선택하고 **[실행]**을 누릅니다.
4. 실행 완료 후 로그창에 출력되는 **새 구글 슬라이드 링크**를 클릭하시면 46개 슬라이드가 즉시 생성됩니다!

---

## 📜 무오류 전체 소스코드 (`Code.gs`)

```javascript
/**
 * =========================================================================
 * [한국AI연구소] AI, 두려움을 넘어 일상으로 - 구글 슬라이드 46장 자동 생성기
 * (100% 호환 안전 셰이프 빌더 적용 무오류 버전)
 * =========================================================================
 */

function generateAllSlides() {
  var title = "AI, 두려움을 넘어 일상으로 (목회자와 사역자를 위한 AI 실전 가이드)";
  var deck = SlidesApp.create(title);
  
  var initialSlides = deck.getSlides();
  var w = deck.getPageWidth();   // 720 pt (16:9 기준)
  var h = deck.getPageHeight();  // 405 pt (16:9 기준)
  
  Logger.log("슬라이드 생성 시작... 총 " + masterSlides.length + "개");

  // 46개 슬라이드 순회 렌더링
  masterSlides.forEach(function(slideData, index) {
    var slide = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    
    if (slideData.type === "cover") {
      renderCoverSlide(slide, slideData, w, h);
    } else if (slideData.type === "compare") {
      renderCompareSlide(slide, slideData, w, h);
    } else if (slideData.type === "split_image") {
      renderSplitSlide(slide, slideData, w, h);
    } else if (slideData.cards) {
      renderCardsSlide(slide, slideData, w, h);
    } else if (slideData.type === "table") {
      renderTableSlide(slide, slideData, w, h);
    } else if (slideData.type === "prompt") {
      renderPromptSlide(slide, slideData, w, h);
    } else if (slideData.type === "slogan") {
      renderSloganSlide(slide, slideData, w, h);
    }
  });

  // 초기 빈 슬라이드 제거
  if (initialSlides.length > 0) {
    initialSlides[0].remove();
  }

  var url = deck.getUrl();
  Logger.log("=================================================");
  Logger.log("✅ 46장 전체 슬라이드 생성 완료!");
  Logger.log("👉 프레젠테이션 바로가기 URL: " + url);
  Logger.log("=================================================");
  return url;
}

// =========================================================================
// 안전 셰이프 & 텍스트 헬퍼 함수
// =========================================================================

function createBox(slide, x, y, width, height, bgColor, borderColor) {
  var shape;
  try {
    shape = slide.insertShape(SlidesApp.ShapeType.ROUND_2_SAME_RECTANGLE, x, y, width, height);
  } catch (e) {
    shape = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, x, y, width, height);
  }
  if (bgColor) {
    shape.getFill().setSolidFill(bgColor);
  }
  if (borderColor) {
    shape.getBorder().getLineFill().setSolidFill(borderColor);
  }
  return shape;
}

function addHeader(slide, slideData, w) {
  var partBox = slide.insertTextBox(slideData.part + "  |  #" + slideData.id, 30, 18, w - 60, 20);
  partBox.getText().getTextStyle().setFontSize(11).setBold(true).setForegroundColor('#2563EB').setFontFamily('Arial');

  var titleBox = slide.insertTextBox(slideData.title, 30, 38, w - 60, 36);
  titleBox.getText().getTextStyle().setFontSize(19).setBold(true).setForegroundColor('#0F172A').setFontFamily('Arial');

  if (slideData.subtitle) {
    var subBox = slide.insertTextBox(slideData.subtitle, 30, 74, w - 60, 22);
    subBox.getText().getTextStyle().setFontSize(11).setForegroundColor('#64748B').setFontFamily('Arial');
  }
}

function addFooterNote(slide, text, w, h) {
  var box = createBox(slide, 30, h - 45, w - 60, 30, '#EFF6FF', '#BFDBFE');
  var t = box.getText();
  t.setText("📌 " + text.replace(/<[^>]*>/g, ''));
  t.getTextStyle().setFontSize(10).setForegroundColor('#1E3A8A').setBold(true).setFontFamily('Arial');
}

// =========================================================================
// 슬라이드 유형별 렌더러
// =========================================================================

function renderCoverSlide(slide, data, w, h) {
  slide.getBackground().setSolidFill('#0F172A'); // 다크 네이비

  var partBox = slide.insertTextBox(data.part, 40, 40, w - 80, 25);
  partBox.getText().getTextStyle().setFontSize(13).setBold(true).setForegroundColor('#93C5FD').setFontFamily('Arial');

  var titleBox = slide.insertTextBox(data.title, 40, 70, w - 80, 70);
  titleBox.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#FFFFFF').setFontFamily('Arial');

  var subBox = slide.insertTextBox(data.subtitle, 40, 140, w - 80, 35);
  subBox.getText().getTextStyle().setFontSize(16).setForegroundColor('#94A3B8').setFontFamily('Arial');

  if (data.badge) {
    var badgeBox = createBox(slide, 40, 200, w - 80, 145, '#1E293B', '#F59E0B');
    var badgeText = badgeBox.getText();
    badgeText.setText(data.badge);
    badgeText.getTextStyle().setFontSize(16).setBold(true).setForegroundColor('#FCD34D').setFontFamily('Arial');
  }
}

function renderCompareSlide(slide, data, w, h) {
  addHeader(slide, data, w);
  var topY = 105;
  var cardW = (w - 75) / 2;
  var cardH = data.footerNote ? 235 : 265;

  // Bad / 현실 박스
  var badBox = createBox(slide, 30, topY, cardW, cardH, '#FEF2F2', '#FECACA');
  var badText = badBox.getText();
  badText.setText(data.bad.title + "\n\n" + data.bad.desc);
  badText.getTextStyle().setFontSize(12).setForegroundColor('#1E293B').setFontFamily('Arial');

  // Good / 본질 박스
  var goodBox = createBox(slide, 30 + cardW + 15, topY, cardW, cardH, '#F0FDF4', '#BBF7D0');
  var goodText = goodBox.getText();
  goodText.setText(data.good.title + "\n\n" + data.good.desc);
  goodText.getTextStyle().setFontSize(12).setForegroundColor('#1E293B').setFontFamily('Arial');

  if (data.footerNote) {
    addFooterNote(slide, data.footerNote, w, h);
  }
}

function renderSplitSlide(slide, data, w, h) {
  addHeader(slide, data, w);
  var topY = 105;
  var cardW = (w - 75) / 2;
  var cardH = data.footerNote ? 235 : 265;

  var box = createBox(slide, 30, topY, cardW, cardH, '#F8FAFC', '#CBD5E1');
  var t = box.getText();
  t.setText(data.contentTitle + "\n\n" + data.content);
  t.getTextStyle().setFontSize(12).setForegroundColor('#1E293B').setFontFamily('Arial');

  if (data.imageUrl) {
    try {
      slide.insertImage(data.imageUrl, 30 + cardW + 15, topY, cardW, cardH);
    } catch(e) {
      var imgPlaceholder = createBox(slide, 30 + cardW + 15, topY, cardW, cardH, '#E2E8F0', '#CBD5E1');
      imgPlaceholder.getText().setText("[사진 예시]\n" + data.imageUrl).getTextStyle().setFontSize(10).setForegroundColor('#64748B');
    }
  }

  if (data.footerNote) {
    addFooterNote(slide, data.footerNote, w, h);
  }
}

function renderCardsSlide(slide, data, w, h) {
  addHeader(slide, data, w);
  var topY = 105;
  var count = data.cards.length;
  var cardH = data.footerNote ? 235 : 265;
  var gap = 12;
  var cardW = (w - 60 - (gap * (count - 1))) / count;

  for (var i = 0; i < count; i++) {
    var cardX = 30 + i * (cardW + gap);
    var box = createBox(slide, cardX, topY, cardW, cardH, '#F8FAFC', '#93C5FD');
    var t = box.getText();
    t.setText(data.cards[i].title + "\n\n" + data.cards[i].desc);
    t.getTextStyle().setFontSize(11).setForegroundColor('#1E293B').setFontFamily('Arial');
  }

  if (data.footerNote) {
    addFooterNote(slide, data.footerNote, w, h);
  }
}

function renderTableSlide(slide, data, w, h) {
  addHeader(slide, data, w);
  var topY = data.table.highlightLabel ? 112 : 105;

  if (data.table.highlightLabel) {
    var badge = createBox(slide, 30, 96, w - 60, 22, '#FEF3C7', '#F59E0B');
    badge.getText().setText("🎯 " + data.table.highlightLabel).getTextStyle().setFontSize(10).setBold(true).setForegroundColor('#92400E').setFontFamily('Arial');
  }

  var rows = data.table.rows.length + 1;
  var cols = data.table.headers.length;
  var table = slide.insertTable(rows, cols, 30, topY + 12, w - 60, data.footerNote ? 210 : 240);

  for (var c = 0; c < cols; c++) {
    var cell = table.getCell(0, c);
    cell.getFill().setSolidFill('#1E3A8A');
    var ct = cell.getText();
    ct.setText(data.table.headers[c]);
    ct.getTextStyle().setFontSize(11).setBold(true).setForegroundColor('#FFFFFF').setFontFamily('Arial');
  }

  var highlightRows = data.table.highlightRows || [];

  for (var r = 0; r < data.table.rows.length; r++) {
    var isHigh = highlightRows.indexOf(r) !== -1;
    for (var c = 0; c < cols; c++) {
      var cell = table.getCell(r + 1, c);
      if (isHigh) {
        cell.getFill().setSolidFill('#FEF3C7');
      } else {
        cell.getFill().setSolidFill(r % 2 === 0 ? '#FFFFFF' : '#F8FAFC');
      }
      var ct = cell.getText();
      var cellVal = data.table.rows[r][c];
      if (isHigh && c === 0) {
        cellVal = "🌟 " + cellVal + " [우리가 사용할 AI]";
      }
      ct.setText(cellVal);
      ct.getTextStyle().setFontSize(10).setForegroundColor(isHigh ? '#78350F' : '#1E293B').setFontFamily('Arial');
      if (isHigh) ct.getTextStyle().setBold(true);
    }
  }

  if (data.footerNote) {
    addFooterNote(slide, data.footerNote, w, h);
  }
}

function renderPromptSlide(slide, data, w, h) {
  addHeader(slide, data, w);
  var topY = 105;

  var termBox = createBox(slide, 30, topY, w - 60, 205, '#0F172A', '#F59E0B');
  var termText = termBox.getText();
  termText.setText("💻 [복사용 프롬프트 입력문]\n\n" + data.promptText);
  termText.getTextStyle().setFontSize(11).setForegroundColor('#F8FAFC').setFontFamily('Courier New');

  if (data.tip) {
    var tipBox = createBox(slide, 30, topY + 215, w - 60, 35, '#EFF6FF', '#BFDBFE');
    var tipText = tipBox.getText();
    tipText.setText(data.tip);
    tipText.getTextStyle().setFontSize(10).setBold(true).setForegroundColor('#1E3A8A').setFontFamily('Arial');
  }
}

function renderSloganSlide(slide, data, w, h) {
  addHeader(slide, data, w);
  var box = createBox(slide, 30, 105, w - 60, 255, '#1E3A8A', '#3B82F6');
  var t = box.getText();
  t.setText('"' + data.slogan + '"\n\n' + data.sub);
  t.getTextStyle().setFontSize(15).setBold(true).setForegroundColor('#FDE68A').setFontFamily('Arial');
}

// =========================================================================
// 46개 전체 마스터 슬라이드 데이터셋
// =========================================================================
var masterSlides = [
  {
    id: 1,
    part: "PART 1. 마인드셋 (Mindset)",
    type: "cover",
    title: "AI, 두려움을 넘어 일상으로",
    subtitle: "사역의 효율을 높이고 본질에 집중하는 아주 쉬운 AI 첫걸음",
    badge: "💡 \"AI는 부지런한 손, 목회자는 뜨거운 심장\"\n\n목회자와 사역자를 위한 맞춤형 실전 AI 가이드",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
  },
  {
    id: 2,
    part: "PART 1. 마인드셋 (Mindset)",
    type: "compare",
    title: "우리는 AI라는 말만 들어도 손사래 친다",
    subtitle: "낯선 기술 앞에서 느끼는 솔직한 마음과 두려움의 진짜 이유",
    bad: {
      title: "😨 손사래 치는 이유 (솔직한 고백)",
      desc: "• \"나는 기계치라 컴퓨터 다루는 게 겁난다\"\n• \"AI라는 말만 들어도 무섭고 부담스럽다\"\n• \"복잡한 영어와 낯선 IT 용어들이 너무 어렵다\"\n• \"잘못 눌러서 망가질까 봐 걱정된다\""
    },
    good: {
      title: "💡 두려움 뒤에 숨겨진 진실",
      desc: "• 막연한 두려움 👉 누구나 겪는 지극히 정상적인 반응입니다!\n• 낯선 용어들 👉 아직 익숙하지 않을 뿐, 원리는 아주 단순합니다.\n• 실패에 대한 걱정 👉 어차피 처음엔 못하는 게 당연합니다. 편하게 눌러보세요!"
    }
  },
  {
    id: 3,
    part: "PART 1. 마인드셋 (Mindset)",
    type: "split_image",
    title: "AI는 사역의 '세탁기'입니다",
    subtitle: "손빨래의 고단함에서 벗어나 가족과 사랑을 나눌 시간을 얻듯이",
    contentTitle: "🧺 세탁기 혁명이 준 교훈",
    content: "• 옛날에는 온종일 차가운 개울가에서 손빨래를 했습니다.\n\n• 세탁기가 나왔을 때 \"정성이 사라진다\"는 비판도 있었지만, 세탁기는 주부에게 '삶의 여유와 사랑의 시간'을 선물했습니다.\n\n• AI는 목회 행정과 자료 정리라는 '손빨래'를 대신해 주는 사역의 세탁기입니다!",
    imageUrl: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&q=80"
  },
  {
    id: 4,
    part: "PART 1. 마인드셋 (Mindset)",
    type: "compare",
    title: "자고 일어나면 바뀌는 메뉴, '기능'이 아닌 '개념과 맥락'의 힘",
    subtitle: "어디를 누르는지 외우지 마세요. 글의 맥락을 읽듯 AI의 원리를 이해해야 합니다.",
    bad: {
      title: "⚡ 매일 겪는 급변과 혼란 (UI의 변화)",
      desc: "• 자고 일어나면 새로운 모델 등장, 메뉴 위치가 바뀜\n• 어제 그림을 안 그려주던 앱이 오늘은 그림을 그려줌\n• 강사가 '여기 보세요' 했는데 버튼이 없거나, 순차 배포(A/B 롤아웃)로 강사와 학생의 화면이 다른 경우 속출"
    },
    good: {
      title: "💡 우리가 잡아야 할 본질 (개념과 맥락)",
      desc: "• 단순 버튼 위치나 작업 하나만 외우면 다음 날 UI가 바뀌면 아무것도 못 하게 됩니다.\n• 글의 맥락을 이해하듯 \"아! AI에게 이런 방식으로 일을 시킬 수 있구나!\"라는 원리를 이해해야 합니다.\n• 개념을 잡으면 어떤 새로운 화면이 나와도 스스로 응용할 수 있습니다."
    }
  },
  {
    id: 5,
    part: "PART 1. 마인드셋 (Mindset)",
    type: "compare",
    title: "AI 광고의 환상 vs 현실: '딸깍'의 거짓말과 비용 폭탄",
    subtitle: "비싼 특화 앱 강의 찾아다니지 마세요. 범용 AI에게 물어보면 광고인지 진짜인지 다 분석해 줍니다.",
    bad: {
      title: "❌ 화려한 광고와 숨겨진 과금",
      desc: "• \"이 앱 하나면 영상/그림 뚝딱 완성! 당장 강의 들으세요\"\n• 막상 써보면 영상 하나 제작에 엄청난 크레딧과 과금 발생\n• \"딸깍 하나로 월 천만 원/부업 완성\"은 100% 사기거나 미끼 상품입니다."
    },
    good: {
      title: "⭕ 현명한 해결책 & 한국인의 힘",
      desc: "• 범용 AI(ChatGPT/Gemini/Claude)에게 광고나 영상을 보여주며 \"이거 내가 당장 쓸 수 있어? 과금 얼마야? 광고야 진짜야?\" 물어보면 상세히 안내해 줍니다.\n• 외주는 돈 들고 수정마다 비용이지만, 내가 AI로 만들면 비용 0원에 내 뜻대로 계속 키워갈 수 있습니다.\n• \"될 것 같은데? 할 수 있을 것 같은데? 해줘!\" 하는 한국인의 뚝심이 최고의 무기입니다!"
    }
  },
  {
    id: 6,
    part: "PART 1. 마인드셋 (Mindset)",
    type: "split_image",
    title: "자전거를 책으로 배우는 사람은 없습니다",
    subtitle: "복잡한 이론을 공부하려 하지 말고, 오늘 직접 페달을 밟아보세요.",
    contentTitle: "🚴 실천이 최고의 공부입니다",
    content: "• 원리를 몰라도 탈 수 있습니다:\n스마트폰 터치만 할 줄 알면 AI 사용 준비 완료!\n\n• 넘어지면서 균형을 잡습니다:\n엉뚱한 답변이 나와도 괜찮습니다. 질문을 던지는 경험 자체가 실력입니다.\n\n• 지금 바로 페달을 밟으십시오:\n책 10권 읽는 것보다 챗GPT에 3번 질문하는 것이 훨씬 빠릅니다.",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80"
  },
  {
    id: 7,
    part: "PART 1. 마인드셋 (Mindset)",
    type: "compare",
    title: "AI의 무눈치 vs 인간의 몰염치",
    subtitle: "미안해하지 말고 원하는 결과가 나올 때까지 당당하게 요구하세요.",
    bad: {
      title: "🤖 AI의 무눈치 (신입사원과 같음)",
      desc: "• AI는 만능 도깨비 방망이나 소원을 들어주는 지니의 램프가 아닙니다.\n• 이제 막 입사한 열정 넘치는 '신입사원(인턴)'과 같아서, 눈치가 전혀 없고 알아서 배려하지 못합니다.\n• 두루뭉술하게 지시하면 엉뚱한 답만 냅니다. 구체적인 배경과 업무 지시를 콕 집어줘야 최고의 능력을 발휘합니다."
    },
    good: {
      title: "🙋 인간의 몰염치 (염치없이 당당하게)",
      desc: "• AI에게 결코 미안해하거나 눈치 볼 필요가 없습니다!\n• 신입사원에게 일을 가르치듯, 지치지 않는 무료 비서에게 10번이든 20번이든 당당하게 수정을 요구하세요.\n• 완벽한 100점짜리가 나올 때까지 뻔뻔하게 계속 지시하십시오."
    }
  },
  {
    id: 8,
    part: "PART 1. 마인드셋 (Mindset)",
    type: "cards2",
    title: "단순 계산기를 넘어 '사역 전담 비서'로의 전환",
    subtitle: "생성형 AI와 AI 에이전트의 차이를 알면 사역의 차원이 달라집니다.",
    cards: [
      {
        title: "생성형 AI (조언자 & 토론 파트너)",
        desc: "• 내가 물어보는 질문에 명쾌하게 답변\n• 설교 아이디어 브레인스토밍 및 본문 분석\n• 설교문 초안 및 나눔 질문 작성 파트너"
      },
      {
        title: "AI 에이전트 (사역 전담 수석 비서)",
        desc: "• 목표만 주면 스스로 계획을 세워 주도적 실행\n• 주보 데이터를 읽고 심방 문자 자동 생성 및 발송\n• 복잡한 다단계 사역 행정을 알아서 처리"
      }
    ]
  },
  {
    id: 9,
    part: "PART 1. 마인드셋 (Mindset)",
    type: "slogan",
    title: "기계는 부지런한 손, 목회자는 뜨거운 심장",
    subtitle: "AI는 일을 덜어주는 도구일 뿐, 사역의 중심은 언제나 목회자의 영성입니다.",
    slogan: "AI의 몫 (부지런한 손): 방대한 자료 조사, 설교 초안, 행정 문서, 다국어 번역\n\n목회자의 몫 (뜨거운 심장): 눈물의 기도, 성도를 향한 깊은 공감, 영적 통찰과 관계",
    sub: "AI로 아낀 소중한 시간과 에너지를 '말씀 묵상과 한 영혼을 돌보는 목회의 본질'에 온전히 쏟으십시오."
  },
  {
    id: 10,
    part: "PART 2. AI 진화 4단계",
    type: "cover",
    title: "인공지능(AI)의 진화 4단계와 에이전트",
    subtitle: "'햄버거 비유'로 한눈에 쉽게 이해하는 AI의 본질과 미래",
    badge: "1단계 인지 AI ➔ 2단계 생성형 AI ➔ 3단계 AI 에이전트 ➔ 4단계 피지컬 AI",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
  },
  {
    id: 11,
    part: "PART 2. AI 진화 4단계",
    type: "cards2",
    title: "1단계 인지 AI & 2단계 생성형 AI",
    subtitle: "데이터를 식별하는 기술에서 새로운 콘텐츠를 만들어내는 기술로의 도약",
    cards: [
      {
        title: "1단계: 인지 AI (\"이건 햄버거야\")",
        desc: "• 핵심: 사진이나 글을 보고 대상이 무엇인지 식별\n• 사역 사례: 스마트폰 안면인식 출석, 교적 관리, 빛바랜 성경 필사본 글자 인식(OCR)"
      },
      {
        title: "2단계: 생성형 AI (\"햄버거 그려줘\")",
        desc: "• 핵심: 학습된 데이터를 조합하여 새로운 글·그림 생성\n• 사역 사례: 설교 감동 예화 생성, 주보 일러스트 포스터 제작, 나눔 질문 생성"
      }
    ]
  },
  {
    id: 12,
    part: "PART 2. AI 진화 4단계",
    type: "cards2",
    title: "3단계 AI 에이전트 & 4단계 피지컬 AI",
    subtitle: "스스로 계획하고 일하는 비서에서 현실 세계를 움직이는 로봇으로의 진화",
    cards: [
      {
        title: "3단계: AI 에이전트 (\"주문하고 결제해줘\")",
        desc: "• 핵심: 목표를 이해하고 지시한 대로 조작해 완수\n• 사역 사례: 등록 교우 분석 후 심방 알림 발송, 주간 사역 일정 자동 조율 및 캘린더 등록"
      },
      {
        title: "4단계: 피지컬 AI (\"직접 요리해서 가져다줘\")",
        desc: "• 핵심: AI 두뇌가 로봇 하드웨어와 결합하여 물리적 행동\n• 사역 사례: 찬양인도 및 반주 지원, 거동 불편 어르신 성도 이동 보조, 교회 시설 무인 자율 방역 및 청소"
      }
    ]
  },
  {
    id: 13,
    part: "PART 2. AI 진화 4단계",
    type: "split_image",
    title: "AI 에이전트의 핵심: 오케스트레이션",
    subtitle: "복잡한 사역 목표를 위해 여러 도구를 하나로 조율(Orchestration)합니다.",
    contentTitle: "🎼 지휘자로서의 목회자",
    content: "• 다중 도구의 완벽한 하모니:\n언어 모델(두뇌) ➔ 웹 검색(정보 수집) ➔ 구글 시트(데이터 정리) ➔ 카카오톡(전송)을 하나로 연결합니다.\n\n• 미래 사역의 핵심 역량:\nAI에게 정답을 묻는 사람보다, AI 도구들을 적재적소에 지휘하는 '사역 기획력'을 가진 목회자가 시대를 이끕니다.",
    imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80"
  },
  {
    id: 14,
    part: "PART 2. AI 진화 4단계",
    type: "table",
    title: "햄버거로 정리하는 AI 4단계와 사역 현장 적용",
    subtitle: "우리가 집중적으로 활용할 AI는 바로 '2단계 생성형 AI'와 '3단계 AI 에이전트'입니다.",
    table: {
      headers: ["단계 및 구분", "핵심 역할", "햄버거 비유", "목회 및 사역 현장 적용"],
      highlightRows: [1, 2],
      highlightLabel: "🎯 우리가 실무·사역에서 집중 활용할 핵심 AI (2단계 & 3단계)",
      rows: [
        ["1. 인지 AI", "식별하고 구별함", "\"이건 햄버거야\"", "안면인식 교적 관리, 성경 필사 스캔"],
        ["2. 생성형 AI", "생성하고 대화함", "\"햄버거 그려줘\"", "설교 예화, 주보 디자인, 성경 퀴즈"],
        ["3. AI 에이전트", "지시받아 대신 실행", "\"주문하고 결제해줘\"", "심방 문자 자동 발송, 사역 일정 자동화"],
        ["4. 피지컬 AI", "현실에서 직접 움직임", "\"요리해서 가져다줘\"", "찬양인도, 거동 불편 성도 케어, 시설 관리"]
      ]
    },
    footerNote: "💡 <strong>집중 영역 안내</strong>: 현재 우리 사역 현장에서 가장 강력한 생산성과 은혜를 낳는 핵심 도구는 <strong>[2단계 생성형 AI]</strong>와 <strong>[3단계 AI 에이전트]</strong>입니다."
  },
  {
    id: 15,
    part: "PART 3. AI 지식 구조 & 신뢰도",
    type: "cover",
    title: "지식 차단일과 올바른 AI 활용법",
    subtitle: "거짓말(환각)을 피하고 100% 신뢰할 수 있는 사역 파트너 만들기",
    badge: "Knowledge Cutoff & Fact Checking\n\nAI의 한계를 명확히 알고 똑똑하게 활용하기",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80"
  },
  {
    id: 16,
    part: "PART 3. AI 지식 구조 & 신뢰도",
    type: "compare",
    title: "검색 엔진 vs 생성형 AI의 본질적 차이",
    subtitle: "AI의 지식 차단일(Knowledge Cutoff)을 알아야 실수가 없습니다.",
    bad: {
      title: "🔍 검색 엔진 (실시간 관찰자)",
      desc: "• 전 세계 웹페이지를 실시간으로 탐색하여 출처 제공\n• 100% 최신성 보장, 명확한 링크 확인 가능\n• 팩트체크, 통계, 최신 뉴스 확인에 적합"
    },
    good: {
      title: "🧠 생성형 AI (과거 데이터 학습자)",
      desc: "• 학습된 과거 지식을 바탕으로 문장을 확률적으로 생성\n• 문맥 파악, 복잡한 신학 텍스트 요약에 탁월\n• 최신 사실 질문 시 '그럴듯한 거짓말' 가능성 주의"
    }
  },
  {
    id: 17,
    part: "PART 3. AI 지식 구조 & 신뢰도",
    type: "cards3",
    title: "환각(Hallucination) 현상과 작업별 신뢰도",
    subtitle: "AI는 모르는 것도 \"모른다\" 하지 않고 그럴듯한 단어를 조합합니다.",
    cards: [
      {
        title: "🔴 주의 (신뢰도 낮음)",
        desc: "• 최신 시사 뉴스, 정확한 통계 수치\n• 특정 인물의 상세 생애/연도\n👉 검색 엔진으로 직접 교차 검증 필수"
      },
      {
        title: "🟡 보통 (신뢰도 중간)",
        desc: "• 일반 교리 설명 및 신학 개념 풀이\n• 역사적 배경 설명\n👉 전통 주석서와 대조 확인 권장"
      },
      {
        title: "🟢 탁월 (신뢰도 매우 높음)",
        desc: "• 내가 작성한 설교 원고 요약\n• 문체 다듬기 및 예화 아이디어 발상\n👉 안심하고 적극적으로 활용"
      }
    ]
  },
  {
    id: 18,
    part: "PART 3. AI 지식 구조 & 신뢰도",
    type: "cards4",
    title: "오류 없는 사역을 위한 하이브리드 워크플로우",
    subtitle: "검색 엔진의 정확성과 AI의 문장력을 결합한 4단계 표준 순서",
    cards: [
      {
        title: "1. 정보 검색",
        desc: "구글/네이버 검색으로 최신 데이터와 정확한 성경 구절 수집"
      },
      {
        title: "2. 자료 주입",
        desc: "수집한 검증된 텍스트 원문을 AI 프롬프트에 직접 복사 입력"
      },
      {
        title: "3. AI 가공",
        desc: "AI에게 요약, 청년 눈높이 문체 변경, 소그룹 나눔 질문 도출 요청"
      },
      {
        title: "4. 목회자 검증",
        desc: "목회자가 최종 신학적 적합성을 검토하고 영적 온기를 보완"
      }
    ]
  },
  {
    id: 19,
    part: "PART 3. AI 지식 구조 & 신뢰도",
    type: "table",
    title: "한눈에 보는 비교 요약 (2026년 8월 기준)",
    subtitle: "내 사역 목적에 가장 알맞은 AI 도구를 스마트하게 선택하십시오.",
    table: {
      headers: ["특징", "ChatGPT (OpenAI)", "Claude (Anthropic)", "Gemini (Google)", "Grok (xAI)"],
      rows: [
        ["현재 라인업", "GPT-5.6 (Sol/Terra/Luna 3단계)", "Sonnet 5, Opus 5", "Gemini 3.1 Pro, 3.7 Flash", "Grok 4 (Heavy 포함)"],
        ["핵심 강점", "폭넓은 통합·생태계, 데스크톱 자동화", "코딩·긴 문서 신뢰도·환각률 최저 수준", "구글 앱 연동, 대용량 컨텍스트·가성비", "실시간 X(트위터) 데이터, 최신 이슈 파악"],
        ["킬러 기능", "GPTs, 컴퓨터 사용(OSWorld 1위권)", "Artifacts, 코딩(SWE-bench 상위권)", "드라이브/유튜브 분석, 대용량 문서 처리", "실시간 트렌드·뉴스 분석, 멀티에이전트"],
        ["문체 특징", "표준적, 정중함", "문학적, 자연스러움", "정보 중심, 명확함", "위트 있음, 직설적"],
        ["추천 용도", "만능 비서, 폭넓은 도구 연동", "개발·글쓰기·문서 분석, 고신뢰 업무", "업무 자동화, 대용량 자료 조사", "실시간 이슈 파악, 소셜 트렌드"]
      ]
    },
    footerNote: "💡 <strong>* NotebookLM (Google)</strong>: 내가 올린 파일(주석/설교) 내에서만 답변; 신학적 오류 없는 안전한 설교 준비 및 스튜디오 기능"
  },
  {
    id: 20,
    part: "PART 4. 선교사를 위한 IT 기술 (API)",
    type: "cover",
    title: "선교사와 목회자를 위한 API 쉽게 이해하기",
    subtitle: "어려운 기술 용어, '식당의 웨이터' 비유로 3분 만에 마스터하기",
    badge: "Application Programming Interface\n\n거대한 AI 시스템과 내 사역을 이어주는 다리",
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80"
  },
  {
    id: 21,
    part: "PART 4. 선교사를 위한 IT 기술 (API)",
    type: "split_image",
    title: "내가 주방에 직접 들어가지 않아도 되는 이유",
    subtitle: "API(Application Programming Interface)는 프로그램 간의 '중간 다리'입니다.",
    contentTitle: "🍽️ 식당 웨이터 비유로 이해하는 API",
    content: "• 손님 (나 / 내 사역 앱):\n메뉴판을 보고 웨이터에게 주문합니다.\n\n• 웨이터 (API):\n주문을 받아 주방에 전달하고, 완성된 요리를 손님에게 안전하게 배달합니다.\n\n• 주방 (거대한 AI 서버):\n복잡한 요리(AI 연산)를 직접 처리하여 결과만 웨이터에게 넘깁니다.",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
  },
  {
    id: 22,
    part: "PART 4. 선교사를 위한 IT 기술 (API)",
    type: "table",
    title: "선교지 환경에 따른 기술 선택: 온라인 vs 오프라인",
    subtitle: "웨이터(API)가 아무리 친절해도 인터넷 문이 닫히면 주문할 수 없습니다.",
    table: {
      headers: ["비교 항목", "API 사용 (온라인 연결)", "API 미사용 (오프라인 독립형)"],
      rows: [
        ["인터넷 환경", "필수 (와이파이 / 데이터 필요)", "불필요 (오프라인 작동 가능)"],
        ["기능 수준", "최첨단 AI 지능 및 거대 데이터", "스마트폰 자체 저장 성능 수준"],
        ["보안 수준", "외부 서버와 통신", "100% 자체 보관 (외부 유출 차단)"],
        ["선교 현장 예시", "실시간 다국어 AI 번역 설교 앱", "오지 정글용 다운로드 성경/찬송가 앱"]
      ]
    }
  },
  {
    id: 23,
    part: "PART 4. 선교사를 위한 IT 기술 (API)",
    type: "cards3",
    title: "선교 사역을 확장하는 3가지 대표 API",
    subtitle: "선교지 소식 전달과 사역 편의를 획기적으로 높여줍니다.",
    cards: [
      {
        title: "1. DeepL / Google 번역 API",
        desc: "선교지 사역 소식을 현지어로 작성 시 다국어로 자동 번역하여 국내외 후원자에게 즉시 발송"
      },
      {
        title: "2. ChatGPT API",
        desc: "현지 선교 센터 웹사이트에 방문자를 위한 24시간 다국어 성경 질문 자동 응답 챗봇 탑재"
      },
      {
        title: "3. Google Maps API",
        desc: "단기선교 팀 이동 경로 안내 및 현지 선교 거점 지도 표시 맞춤형 모바일 안내 앱 제작"
      }
    ]
  },
  {
    id: 24,
    part: "PART 5. 소통의 기술 (프롬프트)",
    type: "cover",
    title: "AI와 깊이 소통하는 질문의 기술",
    subtitle: "좋은 질문의 4가지 원칙(ACTF)부터 목표 제시(Goal-Driven), 핑퐁 대화법까지",
    badge: "ACTF 공식 & Goal-Driven Prompting\n\n질문이 바뀌면 사역의 결과물이 바뀝니다",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80"
  },
  {
    id: 25,
    part: "PART 5. 소통의 기술 (프롬프트)",
    type: "cards4",
    title: "마법의 4단계 질문 공식: A-C-T-F",
    subtitle: "\"알아서 해줘\" 대신 이 4가지만 적어주면 명답이 나옵니다.",
    cards: [
      {
        title: "A (Act as)",
        desc: "역할 부여\n\n\"20년 차 목회 행정 및 사역 기획 전문가로서...\""
      },
      {
        title: "C (Context)",
        desc: "배경 설명\n\n\"우리 교회는 3040 맞벌이 가정이 주축이며...\""
      },
      {
        title: "T (Task)",
        desc: "임무 지시\n\n\"4주 분량의 가정예배 나눔 교안을 작성해줘.\""
      },
      {
        title: "F (Format)",
        desc: "형식 지정\n\n\"월별 표(Table) 형태로 3줄 핵심 요약을 포함해줘.\""
      }
    ],
    footerNote: "📌 <strong>ACTF 공식 배경</strong>: ACTF는 RTF(Role-Task-Format), CO-STAR 등 널리 쓰이는 프롬프트 구조를 참고해 <strong>한국AI연구소</strong>가 목회·실무 현장에 맞게 체계화한 4단계 공식입니다."
  },
  {
    id: 26,
    part: "PART 5. 소통의 기술 (프롬프트)",
    type: "compare",
    title: "정답을 묻지 말고, '최종 목표'를 제시하십시오",
    subtitle: "AI에게 목적지를 알려주면 최적의 사역 경로를 스스로 설계합니다.",
    bad: {
      title: "❌ 단순 질문 방식",
      desc: "\"부활절 설교 본문과 예화 추천해줘.\"\n\n👉 결과: 인터넷에 흔히 떠도는 뻔하고 감동 없는 설교문 출력"
    },
    good: {
      title: "⭕ 목표 제시 방식 (Goal-Driven)",
      desc: "\"이번 부활절에 낙심한 청년들이 다시 소망을 품도록 돕는 것이 나의 최종 목표야. 이를 달성할 3단계 설교 기획안과 토론 프레임을 제안해줘.\"\n\n👉 결과: 가슴을 울리는 맞춤형 기획안 도출!"
    }
  },
  {
    id: 27,
    part: "PART 5. 소통의 기술 (프롬프트)",
    type: "cards3",
    title: "탁구 치듯 대화하는 '핑퐁 대화법' (티키타카)",
    subtitle: "60점짜리 초안을 100점짜리 완성본으로 만드는 3단계 대화법",
    cards: [
      {
        title: "1. 가벼운 첫 질문",
        desc: "완벽을 바라지 말고 부담 없이 큰 틀의 초안(60점)을 신속하게 뽑아냅니다."
      },
      {
        title: "2. 구체적인 피드백",
        desc: "\"문체가 너무 딱딱해, 초신자 눈높이로 바꿔줘\", \"직장인 실제 예시 2개만 추가해줘\""
      },
      {
        title: "3. 점수 매겨 수정",
        desc: "\"지금은 70점이야. 청년들의 공감대를 보강해서 100점으로 업그레이드해줘\""
      }
    ]
  },
  {
    id: 28,
    part: "PART 5. 소통의 기술 (프롬프트)",
    type: "cards4",
    title: "질문 품질을 200% 끌어올리는 4가지 꿀팁",
    subtitle: "프롬프트 작성이 막힐 때 즉시 활용하는 역발상 테크닉",
    cards: [
      {
        title: "1. 대화체 질문",
        desc: "전문 용어 대신 옆 동료에게 말하듯 편안한 일상어로 질문"
      },
      {
        title: "2. 역질문 (메타)",
        desc: "\"최고의 답을 주려면 내가 어떤 정보를 먼저 줘야 할까?\""
      },
      {
        title: "3. 지시문 대행",
        desc: "\"이 작업을 위한 완벽한 지시문을 ACTF 공식으로 네가 써줘.\""
      },
      {
        title: "4. 화면 캡처 질문",
        desc: "말로 설명하기 어려운 오류 화면은 캡처 이미지로 즉시 질문"
      }
    ]
  },
  {
    id: 29,
    part: "PART 6. 목회 실전 프롬프트",
    type: "cover",
    title: "목회자를 위한 실전 프롬프트 라이브러리",
    subtitle: "연간 목회 계획부터 성경공부, 소모임 운영까지 즉시 복사해 쓰는 실전 예시",
    badge: "MINISTRY & AI WORKBOOK\n\n교회 현장에서 바로 검증된 프롬프트 3선",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80"
  },
  {
    id: 30,
    part: "PART 6. 목회 실전 프롬프트",
    type: "prompt",
    title: "[실전 1] 연간 목회 계획서 작성 프롬프트",
    subtitle: "교회의 비전을 12개월의 구체적인 실행 계획으로 도출합니다.",
    promptText: "[역할] 당신은 교회 행정과 사역 기획에 탁월한 20년 차 담임목사입니다.\n[배경] 장년 출석 300명 규모 교회이며, 2025년 표어는 '말씀으로 깊어지는 제자도'입니다.\n[임무] 이 표어를 중심으로 1월부터 12월까지의 연간 목회 계획 초안을 작성해주세요.\n[형식] 월별 표(Table)로 작성하되 [주요 절기/행사], [설교 핵심 주제], [제자훈련 중점], [예산 등급] 열을 포함하세요.",
    tip: "📌 활용 팁: 교회 규모와 표어를 구체적으로 적을수록 실무에 바로 쓰는 계획서가 나옵니다. 반복적인 작업에는 [ ]를 비워두고 변경되는 내용만 수정해서 쓰시면 매우 편리합니다."
  },
  {
    id: 31,
    part: "PART 6. 목회 실전 프롬프트",
    type: "prompt",
    title: "[실전 2] 4주 완성 소그룹 성경공부 교안",
    subtitle: "깊이 있는 말씀 묵상과 삶의 나눔을 이끄는 교안 작성",
    promptText: "[역할] 성경 신학을 전공한 탁월한 기독교 교육 전문가입니다.\n[대상] 바쁜 일상을 살아가는 30대 직장인 청년부 소그룹.\n[임무] 에베소서 4장 1-16절을 본문으로 4주 소그룹 나눔 교안을 작성해주세요.\n[형식] 매주차마다 1. 아이스브레이킹(1개) 2. 본문 관찰 질문(2개) 3. 삶의 적용 질문(2개) 4. 한 줄 기도문을 포함하세요.",
    tip: "📌 활용 팁: 대상(청년, 장년, 새신자)을 명시하면 적용 질문의 깊이가 완전히 달라집니다."
  },
  {
    id: 32,
    part: "PART 6. 목회 실전 프롬프트",
    type: "prompt",
    title: "[실전 3] 새신자 정착 및 소모임 갈등 해결",
    subtitle: "관계의 어려움을 풀고 따뜻한 공동체를 세우는 로드맵",
    promptText: "[역할] 경험 많고 따뜻한 소그룹(구역) 코치입니다.\n[상황] 기존 교우들의 친분이 너무 두터워 새로 등록한 부부가 소외감을 느끼고 있습니다.\n[임무] 3개월(12주) 동안의 '새가족 자연스러운 통합 운영 계획서'를 작성해주세요.\n[요구사항] 1. 주차별 관계 형성 목표 2. 부담 없는 교제 활동 아이디어 3. 구역장이 주의할 점 1가지",
    tip: "📌 활용 팁: 현재 겪고 있는 소그룹의 실제 고민(침묵, 소외 등)을 솔직히 적어주세요."
  },
  {
    id: 33,
    part: "PART 7. 신학 비서 & 세컨드 브레인",
    type: "cover",
    title: "나만의 신학 비서와 세컨드 브레인",
    subtitle: "NotebookLM과 LLM Wiki로 완성하는 '나만의 살아있는 지식체계'",
    badge: "LLM Wiki & Second Brain for Ministry\n\n내 설교와 묵상 노트가 평생의 자산이 되는 법",
    imageUrl: "https://images.unsplash.com/photo-1507842229453-769a91032df5?w=800&q=80"
  },
  {
    id: 34,
    part: "PART 7. 신학 비서 & 세컨드 브레인",
    type: "cards2",
    title: "사역 자료를 유기적으로 연결하는 '세컨드 브레인'",
    subtitle: "수년간 축적된 설교문과 묵상 노트를 살아있는 지식망으로 구축합니다.",
    cards: [
      {
        title: "1. 유기적 지식망 (LLM Wiki)",
        desc: "• 설교문(HWP/PDF)과 메모를 성경 66권 장/절별, 신학 주제별로 AI가 상호 연결\n• '나만의 맞춤형 성경 주석 백과사전' 형성"
      },
      {
        title: "2. 세컨드 브레인 실시간 인출",
        desc: "• \"5년 전 '고난' 설교 예화와 지난주 묵상 노트를 교차 분석해줘\"\n• 과거와 현재를 잇는 깊은 영적 통찰 즉시 도출"
      }
    ]
  },
  {
    id: 35,
    part: "PART 7. 신학 비서 & 세컨드 브레인",
    type: "cards2",
    title: "신학적 오류 없는 안전한 AI: Source Grounding",
    subtitle: "인터넷 바다가 아닌, 목회자가 직접 올린 PDF/주석 안에서만 답변합니다.",
    cards: [
      {
        title: "🛡️ NotebookLM의 안전성 (Source Grounding)",
        desc: "• 내가 올린 주석과 논문 안에서만 답하므로 엉뚱한 내용이나 환각이 크게 줄어듭니다.\n• 항상 출처 번호를 클릭해 원문 내용을 직접 확인하는 습관을 권장합니다."
      },
      {
        title: "🚀 초간단 3단계 시작법",
        desc: "• Step 1 [생성]: 구글 로그인 후 새 노트북 생성\n• Step 2 [업로드]: 신뢰하는 주석/설교 PDF 업로드\n• Step 3 [질문]: \"이 문서들의 핵심 주제와 적용 예화 뽑아줘\""
      }
    ]
  },
  {
    id: 36,
    part: "PART 7. 신학 비서 & 세컨드 브레인",
    type: "cards2",
    title: "NotebookLM의 2대 필살기 기능",
    subtitle: "눈으로 확인하는 출처 인용과 귀로 듣는 오디오 팟캐스트",
    cards: [
      {
        title: "🔍 1초 원문 대조 (Citation)",
        desc: "• 답변 옆 회색 숫자([1], [2])를 클릭하면 해당 PDF 쪽수로 즉시 이동\n• 100% 확실하고 안전하게 원문 팩트체크"
      },
      {
        title: "🎙️ 오디오 팟캐스트 (Audio Overview)",
        desc: "• 방대한 신학 서적을 10분 요약 라디오 대화 음원으로 변환!\n• 심방 가는 차 안에서 들으며 영감을 얻으세요."
      }
    ]
  },
  {
    id: 37,
    part: "PART 7. 신학 비서 & 세컨드 브레인",
    type: "cards4",
    title: "NotebookLM 실전 프롬프트 레시피 4선",
    subtitle: "목적에 맞는 명령어로 내 자료의 가치를 200% 이끌어내세요.",
    cards: [
      {
        title: "[쉬운 요약]",
        desc: "\"초신자가 쉽게 이해할 수 있도록 이 신학 개념을 일상 언어로 3줄 요약해 줘.\""
      },
      {
        title: "[설교 비평]",
        desc: "\"이 설교문의 논리 흐름에서 취약한 부분을 지적하고 보완할 성경 구절을 추천해 줘.\""
      },
      {
        title: "[나눔 질문]",
        desc: "\"이 본문의 핵심 메시지를 바탕으로 청년부가 나눌 아이스브레이킹 질문 2개를 만들어 줘.\""
      },
      {
        title: "[합심 기도]",
        desc: "\"이 설교의 결론에 맞춰 성도들과 다 함께 통성으로 기도할 기도 제목 3가지를 뽑아줘.\""
      }
    ]
  },
  {
    id: 38,
    part: "PART 8. 맞춤 앱 & 랜딩페이지",
    type: "cover",
    title: "나만의 사역 전용 AI 앱 & 모바일 랜딩페이지",
    subtitle: "코딩 없이 5분 만에 만드는 전용 비서와 디지털 선교지 구축",
    badge: "Custom AI Apps (Gems / GPTs) & Landing Page\n\n반복되는 사역을 원클릭으로 자동화하기",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80"
  },
  {
    id: 39,
    part: "PART 8. 맞춤 앱 & 랜딩페이지",
    type: "cards3",
    title: "🛠️ 오늘 직접 만드는 핵심 사역 앱 3종 (실습)",
    subtitle: "지침을 미리 저장해 두고 매주 원클릭으로 사역에 쓰는 전용 AI 비서 (Gems / GPTs)",
    cards: [
      {
        title: "1. 소그룹 나눔 질문지 생성기",
        desc: "성경 본문이나 설교 요약만 넣으면 청년부·장년부·새가족 등 대상별 맞춤 3단계 나눔 질문지를 즉시 자동 생성"
      },
      {
        title: "2. 성경동화·교육자료 생성기",
        desc: "성경 본문을 유초등부·청소년 눈높이 스토리텔링 대본과 4컷 삽화 이미지 프롬프트로 원클릭 변환"
      },
      {
        title: "3. 교인관리 대시보드 (행정 비서)",
        desc: "구글 시트와 연동되어 출석 통계, 심방 기록, 기도제목 관리 및 표준 목회 서식을 단숨에 처리"
      }
    ]
  },
  {
    id: 40,
    part: "PART 8. 맞춤 앱 & 랜딩페이지",
    type: "cards4",
    title: "방문자의 결단을 이끄는 랜딩페이지 4단계 구조",
    subtitle: "방대한 홈페이지 대신 '단 하나의 명확한 행동(참여/신청)'을 유도합니다.",
    cards: [
      {
        title: "1. Hero (첫인상)",
        desc: "3초 만에 사로잡는 강렬한 헤드라인과 즉시 신청 버튼"
      },
      {
        title: "2. 문제 제기",
        desc: "\"카톡 공지가 흩어져 잊어버리시나요?\" 성도들의 갈증에 공감"
      },
      {
        title: "3. 대안 제시",
        desc: "교회가 준비한 은혜로운 해결책과 집회 일정 안내"
      },
      {
        title: "4. 신뢰 & 결단",
        desc: "지난 참여자들의 생생한 후기와 최종 구글폼 접수"
      }
    ]
  },
  {
    id: 41,
    part: "PART 8. 맞춤 앱 & 랜딩페이지",
    type: "cards4",
    title: "랜딩페이지 제작부터 평생 무료 배포까지",
    subtitle: "코딩을 몰라도 무료 도구와 AI로 1~2시간 만에 오픈합니다.",
    cards: [
      {
        title: "1. 디자인 (Canva)",
        desc: "무료 템플릿 선택 후 교회 사진과 안내 문구 배치"
      },
      {
        title: "2. 코드 생성 (AI)",
        desc: "\"깃허브에 올릴 부흥회 홍보용 모바일 반응형 HTML 만들어줘\""
      },
      {
        title: "3. 무료 배포 (GitHub)",
        desc: "index.html 파일을 올려 평생 무료 웹 주소 발행"
      },
      {
        title: "4. 도메인 연결",
        desc: "교회 이름이 들어간 신뢰도 높은 맞춤 주소 연결"
      }
    ]
  },
  {
    id: 42,
    part: "PART 8. 맞춤 앱 & 랜딩페이지",
    type: "cards4",
    title: "AI와 함께하는 실전 5단계 워크플로우: [출판사 만들기 사례]",
    subtitle: "질문 ➔ 나와 연결 ➔ 캡처/분석 ➔ 함께 실행 ➔ 정리 및 카툰화까지 한 번에!",
    cards: [
      {
        title: "1. 절차 질문하기",
        desc: "\"출판사 만들려면 어떻게 해야 하는지 전체 절차를 알려줘.\"\n👉 전체 로드맵 및 필요 서류 파악"
      },
      {
        title: "2. 나와 연결 (브랜딩)",
        desc: "\"커뮤니티 라온(라온동행교회, 카페 라온트리, 라온 아카데미)과 연동할 출판사 이름을 추천해줘.\""
      },
      {
        title: "3. 캡처 & 링크 요청",
        desc: "진행 중 모르는 화면은 캡처해서 \"여기서 어떻게 넘어가? 공식 신청 사이트 링크도 줘.\""
      },
      {
        title: "4. 실행 & 매뉴얼화",
        desc: "등록 완료 후 \"내가 방금 진행한 출판사 등록 절차를 동역자가 따라 할 수 있게 순서 매뉴얼로 정리해줘.\""
      }
    ],
    footerNote: "🎨 <strong>5단계 (시각화 및 공유)</strong>: \"이 모든 등록 과정을 성도 및 동역자들과 은혜롭게 나눌 수 있도록 4컷 카툰 스토리로 구성해줘.\""
  },
  {
    id: 43,
    part: "PART 9. 바이브 코딩 & 사역의 본질",
    type: "cover",
    title: "바이브 코딩과 사역의 본질",
    subtitle: "말로 만드는 맞춤형 프로그램과 결코 변하지 않는 사역의 중심",
    badge: "Vibe Coding & Eternal Ministry\n\n도구를 다스리는 지혜로운 사역자의 길",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
  },
  {
    id: 44,
    part: "PART 9. 바이브 코딩 & 사역의 본질",
    type: "compare",
    title: "가장 쉬운 건 돈 내는 것 & '예수 천당'과 사역의 본질",
    subtitle: "하고 싶은 일을 할 수 있는 일로 만드는 것은 여러분의 몫입니다.",
    bad: {
      title: "⚠️ '하고 싶은 일' vs '할 수 있는 일'",
      desc: "• \"돈 안 내려고 AI 배우는 것입니다. 부업/수익화 미끼 상품에 속지 마세요.\"\n• 내 상황, 환경, 성향을 분석하고 내가 할 수 있는 일부터 시작해야 합니다.\n• 하고 싶은 일이 할 수 있는 일이 되게 만드는 훈련은 나의 몫입니다."
    },
    good: {
      title: "✝️ 신학적 본질: '믿음으로 살아내는 삶'",
      desc: "• \"예수 천당 불신 지옥\"은 입문용 충격요법일 뿐 기독교의 전부가 아닙니다.\n• 기독교의 진짜 본질은 그 다음 스텝인 '믿음으로 치열하게 살아내는 고백과 삶'입니다.\n• AI도 '딸깍' 마법이 아니라, AI와 함께 문제를 고민하고 풀어가는 과정이 진짜 본질입니다."
    }
  },
  {
    id: 45,
    part: "PART 9. 바이브 코딩 & 사역의 본질",
    type: "cards2",
    title: "사역 맞춤형 확장 아이디어와 AI 예산 관리",
    subtitle: "익숙해지면 이런 도구도 만들 수 있습니다 · 매달 나가는 AI 월세 최적화 전략",
    cards: [
      {
        title: "💡 이런 것도 만들 수 있습니다 (사역 확장 아이디어 3선)",
        desc: "• 사역 회의록 정리기: 음성을 올리면 안건과 할 일 자동 요약\n• 심방 예약 시스템: 성도 신청 ➔ 목회자 승인 캘린더 연동\n• 단기선교 모바일 안내장: 현지 날씨, 일정표 안내 웹앱\n(※ 오늘 워크숍 집중 실습: 소그룹 질문기 / 성경동화 / 교인관리)"
      },
      {
        title: "💰 AI 월세 폭탄 줄이기 전략",
        desc: "• 주력 유료 1개만 선택: 구글 환경 ➔ Gemini / 자연스러운 글 ➔ Claude\n• 보조 도구는 무료 활용: ChatGPT 무료 버전 + NotebookLM (완전 무료) 병행"
      }
    ]
  },
  {
    id: 46,
    part: "전체 강의 최종 결론",
    type: "slogan",
    title: "기술은 부지런한 손, 목회자는 뜨거운 심장",
    subtitle: "AI는 일을 덜어주는 도구일 뿐, 사역의 중심은 언제나 목회자의 영성입니다.",
    slogan: "첨단 기술을 지혜로운 도구로 활용하여 시간과 에너지를 아끼십시오.\n\n그리고 그 아낀 소중한 시간으로\n한 영혼을 더 뜨겁게 사랑하고 위로하는 목회의 본질에 헌신하십시오!",
    sub: "두려움을 넘어 은혜의 도구로 승리하시기를 기도합니다."
  }
];
```
