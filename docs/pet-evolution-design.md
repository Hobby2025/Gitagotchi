# Gitagotchi Pet Evolution Design

## 목표

Gitagotchi의 펫은 개발 도구에서 태어난 생명체처럼 보이도록 설계한다. 최초 형태는 공통 알 1종이며, 초반 개발 활동 성향에 따라 4개 계열로 분기한다. 이후 성장기까지는 계열 정체성을 강화하고, 최종 진화에서는 5개 개발자 능력치 중 가장 강한 전문성이 외형을 결정한다. 모든 능력치를 기준치 이상 채우면 계열별 궁극 진화가 열린다.

## 전체 수량

```text
공통 알 1종
+ 유년기 4종
+ 성장기 4종
+ 최종 진화 20종
+ 궁극 진화 4종
= 총 33종
```

## 개발자 능력치

| 키 | 표시명 | 의미 |
| --- | --- | --- |
| builder | 기능 출하력 | 기능을 빠르게 만들고 완성하는 힘 |
| cleaner | 리팩터링 숙련도 | 구조를 정리하고 유지보수성을 높이는 힘 |
| debugger | 버그 레이더 | 문제를 탐지하고 해결하는 힘 |
| scholar | 문서 독해력 | 문서, 설계, 맥락을 읽고 축적하는 힘 |
| streak | 커밋 연속성 | 꾸준히 작업을 쌓아가는 힘 |

## 진화 단계

| 단계 | 조건 | 디자인 수 | 설명 |
| --- | --- | ---: | --- |
| Egg | 최초 시작 | 1 | 공통 개발 도구 알 |
| Hatchling | 이름 설정 후 첫 성장 구간 | 4 | 초반 활동 성향으로 계열 분기 |
| Toolkit | 레벨 5 | 4 | 계열별 개발 도구 생명체로 성장 |
| Specialist | 레벨 15 + 최고 능력치 | 20 | 4계열 x 5전문성 최종 진화 |
| Ultimate | 레벨 30 + 5능력치 모두 기준치 이상 | 4 | 계열별 올스펙 마스터 |

## 알에서 4계열 분기 규칙

| 초반 우세 능력치 | 분기 계열 | 설명 |
| --- | --- | --- |
| 기능 출하력 | Buildling Line | 빌드, 패키지, 배포 도구에서 태어난 생명체 |
| 리팩터링 숙련도 | Refact Line | 포매터, 구조화 도구, 코드 정리 습성의 생명체 |
| 버그 레이더 | Debugon Line | 브레이크포인트, 로그, 센서 기반의 탐지 생명체 |
| 문서 독해력 | Archivox Line | 문서, 지식 베이스, 주석에서 성장하는 생명체 |
| 커밋 연속성 | Archivox Line | 기록과 누적을 중시하므로 Archivox 계열로 합류 |

## 공통 알

| ID | 이름 | 단계 | 외형 키워드 |
| --- | --- | --- | --- |
| egg.common | Kernel Egg | Egg | 검은 터미널 껍질, 작은 커서 점, 연한 녹색 회로 무늬 |

## 4개 기본 계열

### Buildling Line

빌드 시스템, 패키지 매니저, 배포 파이프라인에서 태어난 생명체. 몸체는 단단한 박스형이고, 성장할수록 부스터와 공구 실루엣이 붙는다.

| ID | 이름 | 단계 | 외형 키워드 |
| --- | --- | --- | --- |
| buildling.hatchling | Buildling | Hatchling | 작은 패키지 상자, 짧은 다리, 빌드 불꽃 |
| buildling.toolkit | Forgepack | Toolkit | 백팩형 빌드 모듈, 작은 렌치 꼬리 |
| buildling.builder | Shipwright Forgepack | Specialist | 배포 로켓, 컨테이너 갑옷, 빠른 추진기 |
| buildling.cleaner | Refine Forgepack | Specialist | 정돈된 장갑판, 폴리싱 휠, 매끈한 실루엣 |
| buildling.debugger | Probe Forgepack | Specialist | 센서 안테나, 경고등, 로그 스캐너 |
| buildling.scholar | Manual Forgepack | Specialist | 접힌 설명서 날개, 색인 탭, 작은 책등 |
| buildling.streak | Pipeline Forgepack | Specialist | 연속 컨베이어 벨트, 체크 배지, 체인 트랙 |
| buildling.ultimate | Release Colossus | Ultimate | 배포 요새, 다중 파이프라인 코어, 안정적인 거대 실루엣 |

### Refact Line

포매터와 정적 분석기에서 태어난 생명체. 날카롭고 정돈된 선이 특징이며, 성장할수록 코드 블록을 절단하고 재배열하는 느낌을 가진다.

| ID | 이름 | 단계 | 외형 키워드 |
| --- | --- | --- | --- |
| refact.hatchling | Refactail | Hatchling | 꼬리가 중괄호 모양인 작은 생명체 |
| refact.toolkit | Lintfox | Toolkit | 여우형 실루엣, 줄맞춤 무늬, 포매터 귀 |
| refact.builder | Scaffold Lintfox | Specialist | 생성기 발톱, 템플릿 망토, 구조물 꼬리 |
| refact.cleaner | Prism Lintfox | Specialist | 각진 크리스털 갑옷, 대칭형 라인, 절단 날개 |
| refact.debugger | Trace Lintfox | Specialist | 추적선 무늬, 오류 냄새를 맡는 코, 렌즈 눈 |
| refact.scholar | Index Lintfox | Specialist | 인덱스 카드 갈기, 주석 리본, 문맥 지도 |
| refact.streak | Commit Lintfox | Specialist | 반복 체크 무늬, 타임라인 꼬리, 작은 태그 |
| refact.ultimate | Architecture Kitsune | Ultimate | 다중 꼬리 코드 구조체, 설계도 후광, 균형 잡힌 선 |

### Debugon Line

디버거, 로그 콘솔, 브레이크포인트에서 태어난 생명체. 눈과 센서가 크고, 성장할수록 탐지 장치와 신호 패턴이 강해진다.

| ID | 이름 | 단계 | 외형 키워드 |
| --- | --- | --- | --- |
| debugon.hatchling | Debugon | Hatchling | 작은 박쥐형 센서, 붉은 브레이크포인트 눈 |
| debugon.toolkit | Breakbat | Toolkit | 날개형 로그 패널, 꼬리 센서, 경고점 무늬 |
| debugon.builder | Patch Breakbat | Specialist | 빠른 패치 키트, 기능 탐색 레이더, 배포 고글 |
| debugon.cleaner | Cleanroom Breakbat | Specialist | 오염 제거 필터, 정리된 로그 날개, 얇은 실루엣 |
| debugon.debugger | Signal Breakbat | Specialist | 대형 레이더 귀, 다중 렌즈, 강한 경고색 |
| debugon.scholar | Forensic Breakbat | Specialist | 로그 북, 증거 태그, 분석 안경 |
| debugon.streak | Watchloop Breakbat | Specialist | 모니터링 링, 반복 신호, 연속 감시 꼬리 |
| debugon.ultimate | Rootcause Wyvern | Ultimate | 원인 추적 날개, 다층 센서 왕관, 안정화 코어 |

### Archivox Line

문서, 커밋 기록, 지식 저장소에서 태어난 생명체. 조용하고 지적인 실루엣이며, 성장할수록 기록 장치와 시간 축적의 상징이 붙는다.

| ID | 이름 | 단계 | 외형 키워드 |
| --- | --- | --- | --- |
| archivox.hatchling | Archivox | Hatchling | 작은 문서 정령, 종이 귀, 커서 눈 |
| archivox.toolkit | Docowl | Toolkit | 올빼미형 실루엣, 책갈피 날개, 커밋 스탬프 |
| archivox.builder | Blueprint Docowl | Specialist | 설계도 날개, 기능 명세 두루마리, 작은 컴퍼스 |
| archivox.cleaner | Glossary Docowl | Specialist | 정리된 색인 깃털, 리팩터 노트, 얇은 책등 |
| archivox.debugger | Audit Docowl | Specialist | 감사 로그 눈, 분석 태그, 증거 리본 |
| archivox.scholar | Codex Docowl | Specialist | 거대한 책 날개, 문맥 룬, 지식 왕관 |
| archivox.streak | Chronicle Docowl | Specialist | 커밋 달력 망토, 연속 스탬프, 시간 고리 |
| archivox.ultimate | Repository Seraph | Ultimate | 지식 저장소 날개, 커밋 별자리, 모든 기록의 수호자 |

## 최종 진화 판정

Specialist 진화 시점에는 누적 styleScores에서 가장 높은 능력치를 기준으로 전문성을 선택한다.

```text
가장 높은 점수 = 기능 출하력       -> builder Specialist
가장 높은 점수 = 리팩터링 숙련도   -> cleaner Specialist
가장 높은 점수 = 버그 레이더       -> debugger Specialist
가장 높은 점수 = 문서 독해력       -> scholar Specialist
가장 높은 점수 = 커밋 연속성       -> streak Specialist
```

동점이면 다음 순서로 처리한다.

```text
1. 최근 7일 동안 가장 많이 오른 능력치
2. 그래도 동점이면 현재 계열과 가장 가까운 능력치
3. 그래도 동점이면 balanced fallback
```

## 궁극 진화 조건

궁극 진화는 최종 진화 이후에만 가능하다.

```text
레벨 >= 30
기능 출하력 >= 기준치
리팩터링 숙련도 >= 기준치
버그 레이더 >= 기준치
문서 독해력 >= 기준치
커밋 연속성 >= 기준치
생명 상태가 dead가 아님
```

궁극 진화는 전문성 분기를 지우는 것이 아니라, 해당 계열이 모든 개발 능력을 통합한 형태다.

## 픽셀 제작 기준

| 단계 | 권장 캔버스 | 색상 수 | 실루엣 기준 |
| --- | ---: | ---: | --- |
| Egg | 8x8 | 4색 이하 | 공통 알, 커서 점, 회로 무늬 |
| Hatchling | 12x12 | 5색 이하 | 한눈에 계열이 보여야 함 |
| Toolkit | 16x16 | 6색 이하 | 계열 도구 실루엣 강화 |
| Specialist | 24x24 | 7색 이하 | 전문성 장비와 자세가 뚜렷해야 함 |
| Ultimate | 32x32 | 8색 이하 | 계열의 완성형, 가장 큰 실루엣 |

## 구현 메모

현재 코드의 `PetEvolution`은 단계 중심 구조라 33종 브랜치 진화에는 부족하다. 다음 구현 단계에서는 상태를 아래처럼 확장하는 것이 좋다.

```ts
type PetStage = 'egg' | 'hatchling' | 'toolkit' | 'specialist' | 'ultimate';
type PetLineage = 'buildling' | 'refact' | 'debugon' | 'archivox';
type PetAffinity = 'builder' | 'cleaner' | 'debugger' | 'scholar' | 'streak';
```

```ts
type PetState = {
  stage: PetStage;
  lineage?: PetLineage;
  affinity?: PetAffinity;
};
```

이 구조를 사용하면 공통 알에서 시작해 계열, 전문성, 궁극 진화를 명확하게 표현할 수 있다.

## 픽셀아트 디자인 v1

### 공통 팔레트 토큰

문서의 픽셀 매트릭스는 코드에 그대로 옮길 수 있도록 단일 문자 토큰을 사용한다. 각 스프라이트는 단계별 권장 캔버스 크기를 지키고, 투명 영역은 `.`으로 표기한다.

| 토큰 | 색상 | 용도 |
| --- | --- | --- |
| `.` | transparent | 빈 픽셀 |
| `k` | #0f172a | 터미널 블랙, 외곽선 |
| `s` | #334155 | 어두운 금속, 그림자 |
| `w` | #f8fafc | 하이라이트, 눈, 문서 |
| `g` | #86efac | 커널 회로, 활성 상태 |
| `y` | #facc15 | 공통 코어, 알 껍질 |
| `o` | #fb923c | 빌드 열, 배포 추진 |
| `c` | #22d3ee | 리팩터 라인, 정리된 코드 |
| `r` | #f87171 | 브레이크포인트, 경고 센서 |
| `b` | #60a5fa | 문서, 저장소, 커밋 기록 |
| `m` | #c084fc | 궁극 진화 코어 |

### 형태 언어

| 계열 | 기본 실루엣 | 구분 포인트 |
| --- | --- | --- |
| Kernel Egg | 둥근 알 | 검은 터미널 껍질, 녹색 커서 코어 |
| Buildling | 박스형 | 네모난 몸체, 하단 추진 불꽃, 주황 계열 |
| Refact | 날렵한 포매터형 | 중괄호 꼬리, 청록 라인, 대칭적인 귀 |
| Debugon | 센서형 | 붉은 눈, 안테나, 로그 패널 날개 |
| Archivox | 기록형 | 문서 귀, 책갈피 날개, 푸른 기록 코어 |

## 픽셀 매트릭스 초안

### egg.common - Kernel Egg - 8x8

```text
..kkkk..
.kyyyyk.
kyyggyyk
kygkkgyk
kygkkgyk
kyyggyyk
.kyyyyk.
..kkkk..
```

공통 알은 아직 계열성이 보이면 안 된다. 검은 터미널 껍질과 녹색 커서 코어만 보여 주고, 이후 분기에서 색상과 실루엣을 강하게 갈라낸다.

### buildling.hatchling - Buildling - 12x12

```text
....kk......
...koook....
..kooooook..
.kooyyyyook.
.kooyggyook.
.koowwwwook.
.kooooooook.
..kossook...
...kook.....
...o..o.....
..oo..oo....
............
```

Buildling은 패키지 상자에서 막 나온 형태다. 몸은 정사각형에 가깝고, 발 아래에 작은 빌드 불꽃이 붙는다.

### refact.hatchling - Refactail - 12x12

```text
....cc......
...ckkc.....
..ckwwkc....
.ckcccckc...
.cscscckc...
..ckkkkc....
...ckkc.....
..cc..cc....
.cc....cc...
.c......c...
..cc..cc....
............
```

Refactail은 중괄호 꼬리와 정돈된 좌우 라인이 핵심이다. 다른 계열보다 선이 얇고 대칭적으로 보여야 한다.

### debugon.hatchling - Debugon - 12x12

```text
....rr......
...rkkkr....
..rkkkkkr...
.rkrwwrkr...
.rkkrrkkr...
..rkkkkkr...
...rkkkr....
..rr..rr....
.r......r...
..r....r....
...r..r.....
............
```

Debugon은 작은 디버그 센서 생명체다. 붉은 안테나와 브레이크포인트 눈이 가장 먼저 보여야 한다.

### archivox.hatchling - Archivox - 12x12

```text
....bb......
...bwwb.....
..bwwwwb....
.bwkwwkwb...
.bwwbbwwb...
..bwwwwb....
...bwwb.....
..bb..bb....
.b......b...
..b....b....
...bbbb.....
............
```

Archivox는 종이 귀와 책갈피 날개가 붙은 문서 정령 형태다. 흰 문서 면과 푸른 기록 코어가 구분되어야 한다.

### buildling.toolkit - Forgepack - 16x16

```text
......kkkk......
....kkooookk....
...kooooooook...
..kooyyyyyoook..
..kooygggyoook..
.koowwwwwwoook..
.koooooooooook..
..kosssssssok...
..koosssssook...
...kookkkkook...
...oo......oo...
..ooo......ooo..
..oo........oo..
................
................
................
```

Forgepack은 빌드 모듈 백팩이 붙은 형태다. 하단 추진기와 주황 금속 덩어리감이 핵심이다.

### refact.toolkit - Lintfox - 16x16

```text
.....cc..cc.....
....ckkcckkc....
...ckwwccwwkc...
..ckcccccccckc..
..cscsccccscc...
.ckcccccccckc...
.ccckkkkkkccc...
..cckcccckcc....
...ckcccckc.....
..cck....kcc....
.cc........cc...
.c..........c...
..cc......cc....
...cccccccc.....
................
................
```

Lintfox는 포매터 귀와 줄맞춤 무늬가 보이는 여우형 실루엣이다. 꼬리는 코드 블록을 감싸는 중괄호처럼 휘어진다.

### debugon.toolkit - Breakbat - 16x16

```text
....rr....rr....
...rkkrrrrkkr...
..rkkkrrrrkkkr..
.rkkkrwwrkkkr...
.rkkkrrrrkkkr...
..rkkkrrkkkr....
...rkkkkkkr.....
..rrkrrrrkrr....
.r..krrrrk..r...
r...krrrrk...r..
....rkrrkr......
...rr....rr.....
..rr......rr....
................
................
................
```

Breakbat은 로그 패널 날개를 펼친 형태다. 몸체는 작지만 안테나와 날개가 넓어 디버깅 탐지 생명체처럼 읽혀야 한다.

### archivox.toolkit - Docowl - 16x16

```text
.....bb..bb.....
....bwwbbwwb....
...bwwwwwwwwb...
..bwwkwwwwkwwb..
..bwwwbbbbwwwb..
.bwwwwwwwwwwb...
.bbwwwwwwwwbb...
..bbwwbbwwbb....
...bwwbbwwb.....
..bbwwbbwwbb....
.b....bbbb....b.
......bbbb......
.....bb..bb.....
....bb....bb....
................
................
```

Docowl은 책갈피 날개와 커밋 스탬프 몸통을 가진 기록형 생명체다. 흰 문서 면이 넓어 문서 기반 계열이라는 인상이 우선되어야 한다.

## 다음 픽셀 작업 범위

1차 디자인은 공통 알과 4계열의 유년기, 성장기까지 고정한다. 다음 작업에서는 Specialist 20종을 한 번에 그리지 않고, 각 계열마다 공통 베이스 1종과 전문성 장비 5종을 조합하는 방식으로 설계한다. 이렇게 하면 최종 20종의 차이를 유지하면서도 코드 중복과 유지보수 부담을 줄일 수 있다.
