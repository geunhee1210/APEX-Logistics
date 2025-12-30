// APEX Logistics Blog Posts Data
export const blogPosts = [
  {
    id: 1,
    slug: 'freight-index-guide',
    category: 'scm',
    categoryName: '공급망 관리',
    title: '세계 경제 흐름을 읽는 4대 운임지수',
    excerpt: 'CCFI, SCFI, BDI, HRCI - 세계 경제를 읽는 핵심 지표. 운임지수를 통해 글로벌 경기 흐름, 공급망 리스크, 물류비 변동을 한눈에 파악하세요.',
    date: '2025.11.05',
    readTime: '10분',
    featured: true,
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200',
    tableOfContents: [
      { id: 'intro', title: '글로벌 물류 시장의 체온계' },
      { id: 'ccfi-scfi', title: 'CCFI & SCFI - 컨테이너 운송 지표' },
      { id: 'bdi', title: 'BDI - 원자재 경제의 선행지표' },
      { id: 'hrci', title: 'HRCI - 선박 대여 비용' },
      { id: 'tips', title: '실무 활용 팁' }
    ],
    content: `
## 글로벌 물류 시장의 체온계

물류 실무자라면 반드시 알아야 할 지표, 운임지수입니다. 주식시장에 코스피가 있다면 물류엔 운임지수가 있습니다.

## CCFI & SCFI - 컨테이너 운송 지표

중국 상하이 발표 지수로, **CCFI는 월간 평균**을, **SCFI는 주간 스팟 운임**을 반영합니다. SCFI는 매주 금요일 발표되어 시장 변화를 즉각 포착할 수 있습니다.

> 코로나19 때 SCFI가 300% 급등하며 공급망 대란을 예고했습니다.

## BDI - 원자재 경제의 선행지표

철광석, 석탄 등 벌크 화물 운임을 나타냅니다. 투기 요소가 없어 **'거짓말하지 않는 지수'**로 불리며, 2008년 금융위기 직전 급락하며 경기 침체를 예견했습니다.

## HRCI - 선박 대여 비용

컨테이너선 용선료 지수입니다. 선박 수급 상황을 직접 보여주며, HRCI 급등은 곧 운임 상승으로 이어집니다.

## 실무 활용 팁

4대 지수를 함께 보세요. **SCFI는 오르는데 BDI는 내린다면** 완제품 수요만 높고 원자재는 둔화된다는 신호입니다.

| 지수 | 주기 | 특징 |
|------|------|------|
| CCFI | 월간 | 계약 운임 평균 |
| SCFI | 주간 | 스팟 운임 반영 |
| BDI | 일간 | 벌크화물, 경기선행 |
| HRCI | 주간 | 선박 용선료 |
    `
  },
  {
    id: 2,
    slug: 'what-is-forwarder',
    category: 'scm',
    categoryName: '공급망 관리',
    title: '포워더(Forwarder)란? 글로벌 물류의 핵심',
    excerpt: '포워더(Forwarder)란 무엇일까요? 정의부터 3PL·4PL과의 차이, 글로벌 이커머스에서 포워더의 중요성까지 정리했습니다.',
    date: '2025.10.31',
    readTime: '7분',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200',
    tableOfContents: [
      { id: 'definition', title: '정의' },
      { id: 'difference', title: '선사와의 차이' },
      { id: 'evolution', title: '진화하는 역할' },
      { id: 'criteria', title: '포워더 선택 기준' }
    ],
    content: `
## 배도 비행기도 없지만 모든 걸 움직이는 사람들

## 정의

화주를 대신해 운송, 통관, 보관 등 국제물류 전 과정을 기획·중개하는 기업입니다. **'물류계의 여행사'**라고 보면 쉽습니다.

## 선사와의 차이

선사는 직접 배·비행기를 소유하지만, 포워더는 최적 경로를 설계하는 서비스에 집중합니다. 화주 입장에선 여러 선사를 일일이 비교할 필요 없이 포워더 한 곳과 소통하면 됩니다.

**선사**
- 선박/항공기를 직접 보유
- 운송 실행에 집중
- 고객과 간접적 접점

**포워더**
- 운송 수단 미보유
- 물류 설계 및 중개
- 고객과 직접 소통

## 진화하는 역할

단순 운송 중개를 넘어 **3PL(물류 대행), 4PL(물류 컨설팅)**로 발전하며 이커머스 셀러의 글로벌 진출 파트너가 되고 있습니다.

## 포워더 선택 기준

1. **취급 화물 전문성** - 내 상품 카테고리 경험
2. **네트워크 범위** - 목적지 국가 커버리지
3. **디지털 시스템** - 실시간 트래킹 보유 여부
4. **가격 경쟁력** - 볼륨 디스카운트 협상력
    `
  },
  {
    id: 3,
    slug: 'cbm-calculation',
    category: 'scm',
    categoryName: '공급망 관리',
    title: '물류비 청구서가 복잡한 이유, CBM 하나로 끝내기',
    excerpt: '국제 운임 산출의 핵심 지표, CBM(Cubic Meter)에 대해 이해하며, 해상/항공 운송 모드별 체적 중량 환산 계수 차이를 확인하세요.',
    date: '2025.10.29',
    readTime: '6분',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200',
    tableOfContents: [
      { id: 'what-is-cbm', title: 'CBM(Cubic Meter)이란?' },
      { id: 'volume-weight', title: '부피 무게 계산' },
      { id: 'conversion', title: '운송 모드별 환산 계수' },
      { id: 'tips', title: '실무 팁' }
    ],
    content: `
## 부피가 곧 돈이다

## CBM(Cubic Meter)이란?

가로×세로×높이 1m씩인 부피 단위입니다. **해상·항공 운송비는 이 CBM 기준**으로 책정됩니다.

## 부피 무게 계산

무게만 가벼워선 안 됩니다. **부피 무게(가로×세로×높이÷6000)**와 실제 무게 중 큰 값으로 운임이 결정됩니다.

\`\`\`
부피 무게 = 가로(cm) × 세로(cm) × 높이(cm) ÷ 6000
\`\`\`

> 솜이불처럼 가볍지만 부피가 크면 비용이 급증합니다.

## 운송 모드별 환산 계수

운송 방법에 따라 부피 무게를 계산하는 환산 계수가 다릅니다.

**항공 운송**: 6,000으로 나눔 (부피 무게에 민감)

**해상 운송**: 1,000으로 나눔 (실제 무게 중심)

**택배/육상**: 5,000~6,000으로 나눔 (업체마다 상이)

## 실무 팁

- **박스 크기를 최소화**하세요
- 여러 박스를 **팔레타이징**하면 공간 효율이 올라갑니다
- 포워더 견적서의 **'RT(Revenue Ton)'** 항목이 바로 이 계산의 결과입니다

> CBM 계산만 정확히 해도 불필요한 물류비 지출을 **20~30% 줄일 수 있습니다.**
    `
  },
  {
    id: 4,
    slug: 'sku-management',
    category: 'fulfillment',
    categoryName: '풀필먼트',
    title: 'SKU가 바뀌면, 물류가 달라진다',
    excerpt: 'SKU는 창고 관리의 언어이자 자동화의 출발점입니다. SKU의 정의부터 복잡도가 초래하는 문제, 그리고 WMS와 자동화 설비에 최적화된 포맷팅 전략까지 살펴봅니다.',
    date: '2025.11.06',
    readTime: '8분',
    featured: true,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200',
    tableOfContents: [
      { id: 'what-is-sku', title: 'SKU(Stock Keeping Unit)란?' },
      { id: 'impact', title: '물류에 미치는 영향' },
      { id: 'strategy', title: 'SKU 관리 전략' },
      { id: 'code-design', title: 'SKU 코드 설계 팁' }
    ],
    content: `
## 재고 관리의 최소 단위

## SKU(Stock Keeping Unit)란?

색상, 사이즈 등 속성이 하나만 달라도 별도로 관리하는 품목 코드입니다. **빨간 티셔츠 M사이즈와 L사이즈는 다른 SKU**입니다.

## 물류에 미치는 영향

SKU 수가 증가하면 물류 복잡도가 기하급수적으로 늘어납니다.

**SKU 10개 이하**
- 피킹 복잡도: 낮음
- 재고 관리: 수동 가능

**SKU 100개 수준**
- 피킹 복잡도: 중간
- 재고 관리: 시스템 필요

**SKU 1,000개 이상**
- 피킹 복잡도: 높음
- 재고 관리: 자동화 필수

SKU 10개에서 100개로 늘면 피킹 난이도는 **10배 이상** 증가합니다. 재고 회전율 분석, 데드스톡 파악이 **SKU 단위**로 이뤄지며, WMS(창고관리시스템) 도입 시 **SKU 구조가 효율의 핵심**입니다.

## SKU 관리 전략

무분별한 SKU 확장은 재고 부담을 키웁니다.

> 데이터 기반으로 **판매량 하위 20% SKU는 과감히 정리**하는 것도 방법입니다.

## SKU 코드 설계 팁

\`\`\`
[카테고리]-[브랜드]-[색상]-[사이즈]
예: TS-NK-RD-M (티셔츠-나이키-레드-M)
\`\`\`
    `
  },
  {
    id: 5,
    slug: 'oms-checklist',
    category: 'fulfillment',
    categoryName: '풀필먼트',
    title: 'OMS(주문 관리 시스템) 도입 체크리스트',
    excerpt: 'OMS란 다양한 판매 채널에서 발생하는 주문을 통합적으로 관리하는 시스템입니다. 주문부터 배송, 반품까지 모든 과정을 한눈에.',
    date: '2025.09.11',
    readTime: '8분',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
    tableOfContents: [
      { id: 'role', title: 'OMS 역할' },
      { id: 'features', title: '핵심 기능' },
      { id: 'checklist', title: '도입 전 체크포인트' },
      { id: 'benefits', title: '기대 효과' },
      { id: 'timing', title: '추천 도입 시점' }
    ],
    content: `
## 다채널 시대의 필수 솔루션

## OMS 역할

네이버, 쿠팡, 자사몰 등 **여러 판매 채널의 주문을 한곳에서 통합 관리**합니다.

## 핵심 기능

**실시간 재고 동기화**
- 품절 방지
- 채널 간 재고 불일치 해소

**송장 자동 업로드**
- 인력 절감
- 휴먼 에러 방지

**반품·교환 자동화**
- CS 비용 감소
- 처리 속도 향상

## 도입 전 체크포인트

1. **ERP/WMS 연동** - 현재 사용 중인 시스템과 연동 가능한가?
2. **주문량 기준** - 월 1,000건 이상인가? (그 이하면 수동 처리가 더 효율적일 수 있음)
3. **UI 직관성** - 교육 비용이 적은가?
4. **확장성** - 채널 추가 시 유연하게 대응 가능한가?

## 기대 효과

> OMS 도입으로 주문 처리 시간을 **50% 단축**하고 오류율을 **1% 이하**로 낮출 수 있습니다.

## 추천 도입 시점

- 판매 채널 3개 이상
- 월 주문량 1,000건 초과
- 재고 불일치 문제 발생
- CS 문의 중 배송 관련 비율 30% 이상
    `
  },
  {
    id: 6,
    slug: 'last-mile-quick-commerce',
    category: 'trend',
    categoryName: '트렌드',
    title: '왜 라스트 마일이 퀵커머스의 승패를 가를까?',
    excerpt: '퀵커머스 5조 원 시대, 왜 라스트마일이 승부처일까요? MFC·다크스토어·즉시배송 전략이 고객 경험을 어떻게 바꾸는지 살펴봤습니다.',
    date: '2025.09.10',
    readTime: '7분',
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=1200',
    tableOfContents: [
      { id: 'what-is', title: '라스트 마일이란?' },
      { id: 'market', title: '퀵커머스 시장 현황' },
      { id: 'strategy', title: '핵심 전략' },
      { id: 'conclusion', title: '결론' }
    ],
    content: `
## 고객과의 마지막 1km

## 라스트 마일이란?

물류센터에서 고객 문앞까지 **최종 배송 구간**입니다. 전체 물류비의 **40~50%**가 여기서 발생합니다.

## 퀵커머스 시장 현황

**10분 배송**이 기본이 된 시대입니다. 이 싸움의 핵심은 라스트 마일 경쟁력입니다.

- 2022년: 2.5조 원
- 2023년: 3.8조 원 (전년 대비 52% 성장)
- 2024년: 5조 원 (전년 대비 32% 성장)

## 핵심 전략

### MFC(Micro Fulfillment Center)
도심 내 소형 물류센터로 배송 거리 단축

### 다크스토어
소비자 접근 불가, 배송 전용 매장

### AI 배차 최적화
실시간 교통 상황 반영, 배송 효율 극대화

## 결론

> 라스트 마일 만족도가 곧 재구매율로 직결됩니다. **배송 경험이 브랜드가 되는 시대**입니다.
    `
  },
  {
    id: 7,
    slug: 'sla-logistics',
    category: 'warehouse',
    categoryName: '웨어하우스',
    title: '숫자로 말하는 물류의 신뢰, SLA',
    excerpt: 'SLA는 물류회사에 단순한 서비스 약속이 아니라, 운영 표준·신뢰 증명·비용 통제·경쟁력 확보를 동시에 가능하게 하는 핵심 장치입니다.',
    date: '2025.09.11',
    readTime: '6분',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200',
    tableOfContents: [
      { id: 'what-is-sla', title: 'SLA란?' },
      { id: 'indicators', title: '주요 지표' },
      { id: 'benefits', title: 'SLA의 효과' },
      { id: 'tips', title: '실무 적용 팁' }
    ],
    content: `
## 약속의 수치화

## SLA란?

SLA(Service Level Agreement)는 물류 서비스 품질을 **구체적 수치로 명시**한 계약서입니다.

## 주요 지표

**당일 출고율**
- 기준: 오후 2시 이전 주문 당일 출고 99%

**정확도**
- 기준: 오배송률 0.1% 미만

**재고 정확도**
- 기준: 실사 대비 99.5% 이상

**클레임 처리**
- 기준: 24시간 내 1차 응대

## SLA의 효과

1. **분쟁 예방** - 명확한 기준으로 책임 소재 명확
2. **성과 평가** - 파트너사 평가 근거 확보
3. **지속적 개선** - 측정 가능한 개선 목표

## 실무 적용 팁

> SLA 없이 물류 대행 계약하는 건 **지도 없이 항해하는 것**과 같습니다.

반드시 다음 항목을 수치로 약속받으세요:
- 출고 리드타임
- 오배송/파손율
- 재고 정확도
- 클레임 처리 시간
- 패널티 조건
    `
  },
  {
    id: 8,
    slug: 'lead-time-importance',
    category: 'scm',
    categoryName: '공급망 관리',
    title: '리드 타임(Lead Time)의 뜻과 중요한 이유',
    excerpt: '리드 타임은 고객이 주문을 시작한 시점부터 상품이 도착할 때까지의 총 시간입니다. 기업의 신뢰도와 수익성에 큰 영향을 미치는 핵심 지표입니다.',
    date: '2025.10.28',
    readTime: '5분',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200',
    tableOfContents: [
      { id: 'definition', title: '정의' },
      { id: 'importance', title: '왜 중요한가?' },
      { id: 'strategy', title: '리드 타임 단축 전략' },
      { id: 'benchmark', title: '벤치마크' }
    ],
    content: `
## 시간이 곧 경쟁력이다

## 정의

주문 시점부터 고객이 상품을 받는 시점까지의 **총 소요 시간**입니다. 생산, 입고, 피킹, 포장, 배송 등 모든 단계가 포함됩니다.

## 왜 중요한가?

**고객 만족도**
- 빠른 배송은 구매 전환율 30% 상승

**재고 효율**
- 리드 타임 단축 = 안전재고 감소

**시장 대응력**
- 트렌드 변화에 빠른 대응 가능

## 리드 타임 단축 전략

1. **병목 구간 파악** - 각 단계별 소요 시간 측정
2. **재고 전진 배치** - 주요 소비지 인근 물류센터 활용
3. **공급업체 다변화** - 리스크 분산 + 조달 시간 단축
4. **프로세스 자동화** - WMS/TMS 연동

## 벤치마크

> 아마존은 Prime 회원에게 **1~2일 배송**을 약속하며 리드 타임 단축으로 시장을 장악했습니다.

이커머스에서 리드 타임은 더 이상 선택이 아닌 **필수**입니다.
    `
  },
  {
    id: 9,
    slug: 'fulfillment-guide-2025',
    category: 'fulfillment',
    categoryName: '풀필먼트',
    title: '풀필먼트(Fulfillment) 도입 가이드 2025',
    excerpt: 'Fulfillment(풀필먼트)는 단순 배송을 넘어 재고·포장·CS까지 아우르는 이커머스 핵심 물류 서비스입니다.',
    date: '2025.09.15',
    readTime: '12분',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200',
    tableOfContents: [
      { id: 'what-is', title: '풀필먼트란?' },
      { id: 'checklist', title: '도입 시점 체크리스트' },
      { id: 'criteria', title: '풀필먼트 선택 기준' },
      { id: 'trends', title: '2025년 트렌드' },
      { id: 'conclusion', title: '결론' }
    ],
    content: `
## 물류 아웃소싱의 모든 것

## 풀필먼트란?

주문 접수부터 피킹, 패킹, 배송, 재고 관리, 반품까지 **물류 전 과정을 대행**하는 서비스입니다.

## 도입 시점 체크리스트

- 월 주문량 500건 이상
- 물류 공간 부족 또는 인력 채용 어려움
- 성수기 물량 변동이 큰 경우
- 해외 진출 계획

## 풀필먼트 선택 기준

**상품 특성**
- 상온/냉장/냉동 보관 가능 여부 확인

**입지**
- 주요 고객층과의 거리, 택배사 집하 시간

**시스템**
- WMS 자동화 수준, API 연동 가능성

**비용 구조**
- 보관료(㎡당) + 출고료(건당) 명확히

## 2025년 트렌드

1. **AI 기반 수요 예측**으로 재고 최적화
2. **옴니채널 풀필먼트** (온·오프라인 통합 재고)
3. **마이크로 풀필먼트**로 도심 배송 강화

## 결론

> 초기 비용보다 **장기적 효율성**을 보고 판단하세요. 적절한 풀필먼트 파트너는 매출 성장의 발판이 됩니다.
    `
  },
  {
    id: 10,
    slug: 'success-stories',
    category: 'case',
    categoryName: '성공사례',
    title: '물류 혁신을 통한 기업 성장 스토리',
    excerpt: '물류는 비용 부서가 아닌 성장 엔진입니다. 실제 기업들의 혁신 사례를 통해 데이터로 증명된 변화를 확인해보세요.',
    date: '2025.08.20',
    readTime: '9분',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200',
    tableOfContents: [
      { id: 'case1', title: 'Case 1: 중소 이커머스 A사' },
      { id: 'case2', title: 'Case 2: 식품 유통 B사' },
      { id: 'case3', title: 'Case 3: 패션 브랜드 C사' },
      { id: 'success-factors', title: '공통 성공 요인' }
    ],
    content: `
## 데이터로 증명된 변화

물류는 비용 부서가 아닌 **성장 엔진**입니다.

## Case 1: 중소 이커머스 A사

**Before → After**
- 오배송률: 5% → 0.3%
- CS 비용: 100% → 30%

**솔루션**: 바코드 시스템 도입, WMS 연동

## Case 2: 식품 유통 B사

**Before → After**
- 폐기율: 15% → 3%
- 재고 회전율: 40% 상승

**솔루션**: AI 수요 예측, 안전재고 자동 계산

## Case 3: 패션 브랜드 C사

**Before → After**
- 평균 배송일: 5일 → 2일
- 재구매율: 25% 상승

**솔루션**: 풀필먼트 아웃소싱, 권역별 센터 분산

## 공통 성공 요인

1. **데이터 기반 의사결정**
2. **시스템 자동화 투자**
3. **전문 파트너와의 협업**
    `
  },
  {
    id: 11,
    slug: 'logistics-trends-2025',
    category: 'news',
    categoryName: '뉴스',
    title: '2025년 주목해야 할 물류 및 유통 트렌드',
    excerpt: '탄소 배출 규제, AI 배차 최적화, 자율주행 배송 로봇까지. 2025년 물류 산업의 핵심 트렌드와 대응 전략을 정리했습니다.',
    date: '2025.01.05',
    readTime: '8분',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200',
    tableOfContents: [
      { id: 'policy', title: '정책 변화' },
      { id: 'tech', title: '기술 혁신' },
      { id: 'market', title: '시장 동향' },
      { id: 'strategy', title: '대응 전략' }
    ],
    content: `
## 변화의 흐름을 읽어라

## 정책 변화

**탄소국경세**
- EU 본격 시행
- 영향: 수출 비용 증가

**친환경 포장**
- 의무화 확대
- 영향: 패키징 재설계

**전기차 보조금**
- 확대 추세
- 영향: 라스트마일 전동화

## 기술 혁신

1. **AI 배차 최적화** - 배송 경로 실시간 조정, 비용 20% 절감
2. **자율주행 배송 로봇** - 아파트 단지 내 시범 운영 확대
3. **드론 배송** - 도서·산간 지역 상용화 시작

## 시장 동향

- 퀵커머스 시장 **연 30% 성장** 전망
- 쿠팡·네이버 물류망 투자 지속
- 중소 셀러의 **크로스보더 이커머스** 진출 활발

## 대응 전략

1. 탄소발자국 측정 시스템 도입 검토
2. 디지털 물류 플랫폼 활용도 높이기
3. 동남아 등 신시장 물류 네트워크 확보

> 트렌드는 기회이자 위협입니다. **선제적으로 움직이는 기업**이 시장을 선점합니다.
    `
  },
  {
    id: 12,
    slug: 'logistics-knowledge-guide',
    category: 'all',
    categoryName: '가이드',
    title: 'SCM부터 라스트 마일까지, 통합 물류 지식 가이드',
    excerpt: '물류는 복잡하지만, 체계적으로 접근하면 누구나 마스터할 수 있습니다. 레벨별 학습 경로를 제안합니다.',
    date: '2025.01.10',
    readTime: '5분',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200',
    tableOfContents: [
      { id: 'beginner', title: '입문자 추천 경로' },
      { id: 'practitioner', title: '실무자 추천 경로' },
      { id: 'expert', title: '전문가 추천 경로' },
      { id: 'category', title: '카테고리별 핵심 콘텐츠' }
    ],
    content: `
## 당신의 물류 레벨은?

물류는 복잡하지만, 체계적으로 접근하면 누구나 마스터할 수 있습니다.

## 입문자 추천 경로

1. **포워더란?** → 물류의 기본 이해
2. **CBM 계산법** → 비용 구조 파악
3. **리드 타임** → 프로세스 흐름 이해

## 실무자 추천 경로

1. **4대 운임지수** → 시장 분석 능력
2. **OMS/WMS 도입 가이드** → 시스템화
3. **SLA 설계** → 품질 관리

## 전문가 추천 경로

1. **성공사례 분석** → 벤치마킹
2. **최신 트렌드** → 전략 수립
3. **라스트 마일 최적화** → 경쟁력 강화

## 카테고리별 핵심 콘텐츠

**공급망 관리**
- 운임지수, 포워더, 리드 타임

**풀필먼트**
- SKU, OMS, 풀필먼트 도입

**웨어하우스**
- SLA, 자동화, 데이터 분석

**트렌드**
- 퀵커머스, 라스트 마일, 산업 동향

> 이 가이드를 통해 물류를 '비용'이 아닌 '투자'로 바라보는 시각을 갖추시길 바랍니다. **물류 경쟁력이 곧 기업 경쟁력**입니다.
    `
  }
];

export const getPostBySlug = (slug) => {
  return blogPosts.find(post => post.slug === slug);
};

export const getPostsByCategory = (category) => {
  if (category === 'all') return blogPosts;
  return blogPosts.filter(post => post.category === category);
};

export const getFeaturedPosts = () => {
  return blogPosts.filter(post => post.featured);
};

export default blogPosts;
