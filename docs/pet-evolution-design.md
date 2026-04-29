# Gitagotchi Pet Evolution Design

## 목표

Gitagotchi의 펫은 인기 있는 동물 실루엣에 개발 도구 장비를 결합한 귀여운 생명체처럼 보이도록 설계한다. 최초 형태는 공통 알 1종이며, 초반 개발 활동 성향에 따라 4개 동물 계열로 분기한다. 이후 성장기까지는 동물 정체성과 계열 색을 강화하고, 최종 진화에서는 5개 개발자 능력치 중 가장 강한 전문성이 장비와 장식으로 외형에 반영된다. 모든 능력치를 기준치 이상 채우면 계열별 궁극 진화가 열린다.

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

동물 기반 리디자인에서는 기존 저장 상태와 스프라이트 ID를 유지하되, 계열의 외형 기준을 아래 동물군으로 바꾼다. 각 계열은 동물 실루엣이 먼저 읽히고, 개발 장비는 보조 장식으로 붙는다.

| 계열 | 동물 기준 | 핵심 인상 | 개발 장비 방향 |
| --- | --- | --- | --- |
| Buildling Line | 강아지 | 활발함, 추진력, 튼튼함 | 공구 하네스, 빌드 헬멧, 배포 백팩, 추진기 |
| Refact Line | 고양이 | 날렵함, 정돈됨, 균형감 | 리본, 정렬 라인, 커서 블레이드, 대칭 무늬 |
| Debugon Line | 토끼 | 큰 귀, 탐지력, 민첩함 | 귀 센서, 렌즈, 경고등, 로그 패널 |
| Archivox Line | 올빼미 | 지식, 기록, 관찰력 | 책갈피 날개, 문서 망토, 안경, 기록 룬 |

### Buildling Line

빌드 시스템, 패키지 매니저, 배포 파이프라인에서 태어난 강아지 계열 생명체. 몸체는 둥글고 튼튼하며, 성장할수록 공구 하네스, 빌드 헬멧, 배포 백팩, 작은 추진기가 붙는다. 귀와 꼬리, 발바닥 실루엣이 먼저 보여야 하며 주황/노랑 계열로 활발한 인상을 준다.

| ID | 이름 | 단계 | 외형 키워드 |
| --- | --- | --- | --- |
| buildling.hatchling | Buildpup | Hatchling | 둥근 강아지 얼굴, 작은 귀, 짧은 꼬리, 발밑 빌드 불꽃 |
| buildling.toolkit | Forgepup | Toolkit | 공구 하네스를 찬 강아지, 작은 렌치 꼬리, 빌드 헬멧 |
| buildling.builder | Shipwright Forgepup | Specialist | 배포 로켓 백팩, 컨테이너 목줄, 추진기 발 |
| buildling.cleaner | Refine Forgepup | Specialist | 빗질된 털, 정돈된 장갑 하네스, 폴리싱 휠 장난감 |
| buildling.debugger | Probe Forgepup | Specialist | 코 위 센서 렌즈, 경고등 목걸이, 로그 스캐너 백팩 |
| buildling.scholar | Manual Forgepup | Specialist | 접힌 설명서 귀 장식, 색인 탭 목도리, 작은 책가방 |
| buildling.streak | Pipeline Forgepup | Specialist | 체크 배지 목줄, 컨베이어 꼬리 무늬, 연속 발자국 |
| buildling.ultimate | Release Hound | Ultimate | 대형 배포 하운드, 다중 파이프라인 하네스, 안정적인 추진 코어 |

### Refact Line

포매터와 정적 분석기에서 태어난 고양이 계열 생명체. 날렵한 귀, 긴 꼬리, 정돈된 자세가 핵심이며, 성장할수록 리본, 정렬 라인, 커서 블레이드가 붙는다. 청록/시안 계열로 차분하고 깔끔한 인상을 준다.

| ID | 이름 | 단계 | 외형 키워드 |
| --- | --- | --- | --- |
| refact.hatchling | Refactkit | Hatchling | 작은 고양이 얼굴, 뾰족한 귀, 중괄호처럼 말린 꼬리 |
| refact.toolkit | Lintcat | Toolkit | 줄맞춤 무늬를 가진 고양이, 포매터 리본, 정돈된 앞발 |
| refact.builder | Scaffold Lintcat | Specialist | 생성기 발톱, 템플릿 망토, 구조물 꼬리 장식 |
| refact.cleaner | Prism Lintcat | Specialist | 대칭 리본, 빗질된 털 라인, 커서 블레이드 장식 |
| refact.debugger | Trace Lintcat | Specialist | 오류를 추적하는 렌즈 눈, 발자국 추적선, 얇은 센서 수염 |
| refact.scholar | Index Lintcat | Specialist | 인덱스 카드 목도리, 주석 리본, 문맥 지도 꼬리 |
| refact.streak | Commit Lintcat | Specialist | 반복 체크 무늬, 타임라인 꼬리, 작은 커밋 태그 |
| refact.ultimate | Architecture Lynx | Ultimate | 다중 코드 꼬리, 설계도 후광, 균형 잡힌 고양이형 실루엣 |

### Debugon Line

디버거, 로그 콘솔, 브레이크포인트에서 태어난 토끼 계열 생명체. 큰 귀가 센서처럼 작동하고, 둥근 몸과 빠른 발이 민첩한 탐지 이미지를 만든다. 성장할수록 렌즈, 경고등, 로그 패널, 안테나가 붙으며 빨강/마젠타 계열로 강한 신호감을 준다.

| ID | 이름 | 단계 | 외형 키워드 |
| --- | --- | --- | --- |
| debugon.hatchling | Debugbun | Hatchling | 큰 토끼 귀, 붉은 브레이크포인트 눈, 작은 점프 발 |
| debugon.toolkit | Breakbunny | Toolkit | 귀 센서, 꼬리 경고등, 작은 로그 패널 백팩 |
| debugon.builder | Patch Breakbunny | Specialist | 빠른 패치 키트, 기능 탐색 고글, 배포 스캐너 |
| debugon.cleaner | Cleanroom Breakbunny | Specialist | 정리된 로그 리본, 오염 제거 필터, 얇은 귀 안테나 |
| debugon.debugger | Signal Breakbunny | Specialist | 대형 레이더 귀, 다중 렌즈, 강한 경고색 코어 |
| debugon.scholar | Forensic Breakbunny | Specialist | 로그 북 가방, 증거 태그, 분석 안경 |
| debugon.streak | Watchloop Breakbunny | Specialist | 모니터링 링, 반복 신호 귀 무늬, 연속 감시 꼬리 |
| debugon.ultimate | Rootcause Jackrabbit | Ultimate | 거대 레이더 귀, 다층 센서 왕관, 안정화 코어 |

### Archivox Line

문서, 커밋 기록, 지식 저장소에서 태어난 올빼미 계열 생명체. 둥근 눈, 짧은 부리, 책갈피 날개가 핵심이며 조용하고 지적인 실루엣을 가진다. 성장할수록 문서 망토, 안경, 기록 룬, 커밋 스탬프가 붙으며 파랑/보라 계열로 지식 저장소의 인상을 준다.

| ID | 이름 | 단계 | 외형 키워드 |
| --- | --- | --- | --- |
| archivox.hatchling | Archive Owlet | Hatchling | 둥근 올빼미 눈, 작은 부리, 종이 귀 같은 솜털 |
| archivox.toolkit | Docowl | Toolkit | 책갈피 날개, 커밋 스탬프 가슴 무늬, 문서 망토 |
| archivox.builder | Blueprint Docowl | Specialist | 설계도 날개, 기능 명세 두루마리, 작은 컴퍼스 |
| archivox.cleaner | Glossary Docowl | Specialist | 정리된 색인 깃털, 리팩터 노트, 얇은 책등 장식 |
| archivox.debugger | Audit Docowl | Specialist | 감사 로그 눈, 분석 태그, 증거 리본 |
| archivox.scholar | Codex Docowl | Specialist | 거대한 책 날개, 문맥 룬, 지식 왕관 |
| archivox.streak | Chronicle Docowl | Specialist | 커밋 달력 망토, 연속 스탬프, 시간 고리 |
| archivox.ultimate | Repository Owlbear | Ultimate | 지식 저장소 날개, 커밋 별자리, 모든 기록의 수호자 |

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
| Buildling | 강아지형 | 둥근 얼굴, 짧은 귀, 꼬리, 발바닥, 주황 계열 공구 하네스 |
| Refact | 고양이형 | 뾰족한 귀, 긴 꼬리, 정돈된 자세, 청록 라인과 대칭 리본 |
| Debugon | 토끼형 | 큰 귀 센서, 둥근 몸, 빠른 발, 붉은 렌즈와 경고등 |
| Archivox | 올빼미형 | 둥근 눈, 짧은 부리, 책갈피 날개, 푸른 기록 코어 |

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

Buildling은 강아지처럼 읽히는 첫 형태다. 둥근 얼굴, 짧은 귀, 작은 꼬리와 발바닥을 우선하고, 발 아래에 작은 빌드 불꽃을 붙인다.

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

Refactail은 고양이처럼 읽히는 첫 형태다. 뾰족한 귀, 긴 꼬리, 정돈된 좌우 라인이 핵심이다. 다른 계열보다 선이 얇고 대칭적으로 보여야 한다.

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

Debugon은 토끼처럼 읽히는 첫 형태다. 큰 귀가 센서 역할을 하며, 붉은 브레이크포인트 눈과 작은 점프 발이 가장 먼저 보여야 한다.

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

Archivox는 올빼미처럼 읽히는 첫 형태다. 둥근 눈, 짧은 부리, 책갈피 날개가 붙어야 하며, 흰 문서 면과 푸른 기록 코어가 구분되어야 한다.

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

Forgepack은 공구 하네스와 빌드 모듈 백팩을 찬 강아지 형태다. 하단 추진기와 주황 장비가 핵심이지만, 귀와 꼬리 실루엣은 유지해야 한다.

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

Lintfox는 포매터 리본과 줄맞춤 무늬가 보이는 고양이형 실루엣이다. 꼬리는 코드 블록을 감싸는 중괄호처럼 휘어진다.

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

Breakbat은 귀 센서와 로그 패널 백팩을 가진 토끼형 실루엣이다. 몸체는 둥글지만 큰 귀와 렌즈가 넓어 디버깅 탐지 생명체처럼 읽혀야 한다.

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

Docowl은 책갈피 날개와 커밋 스탬프 몸통을 가진 올빼미형 생명체다. 둥근 눈과 흰 문서 면이 넓어 문서 기반 계열이라는 인상이 우선되어야 한다.

## 다음 픽셀 작업 범위

1차 디자인은 공통 알과 4계열의 유년기, 성장기까지 고정한다. 다음 작업에서는 Specialist 20종을 한 번에 그리지 않고, 각 계열마다 공통 베이스 1종과 전문성 장비 5종을 조합하는 방식으로 설계한다. 이렇게 하면 최종 20종의 차이를 유지하면서도 코드 중복과 유지보수 부담을 줄일 수 있다.
