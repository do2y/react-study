
# 🎬 Netflix Clone App

> TMDB API를 활용해 실제 영화 데이터를 기반으로 만든 넷플릭스 클론 웹 애플리케이션입니다.

</br>

### 🎞 Preview

<p align="center">
  <img width="800" height="405" alt="2026-06-10170448-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/535f6ff1-c142-4b6a-953e-de797a38a7ff" />
</p>

</br>

## ⁘ 기능 소개

### 1. 메인 배너

현재 상영 중인 영화 목록에서 랜덤으로 한 편을 골라 히어로 배너로 표시합니다.
Play 버튼을 누르면 해당 영화의 YouTube 예고편이 전체 화면으로 재생됩니다.

### 2. 카테고리별 영화 슬라이더

장르와 주제별로 분류된 여러 개의 Row 컴포넌트가 렌더링됩니다.

- Netflix Originals, 지금 뜨는 콘텐츠, 최고 평점, 액션, 코미디 등 카테고리 제공
- Swiper 라이브러리를 활용한 터치 슬라이드 지원
- 화면 너비에 따라 슬라이드 개수가 자동으로 조정됩니다 (3~6개)

### 3. 영화 상세 모달

포스터를 클릭하면 해당 영화의 상세 정보(제목, 개봉일, 평점, 줄거리)가 모달로 표시됩니다.
모달 바깥 영역을 클릭하거나 X 버튼을 눌러 닫을 수 있습니다.

### 4. 검색

네비게이션 바의 검색 입력창에 키워드를 입력하면 실시간으로 검색 결과가 표시됩니다.
검색 결과를 클릭하면 해당 영화의 상세 페이지로 이동합니다.

### 5. 스크롤 감지 네비게이션

페이지 최상단에서는 투명한 네비게이션 바가, 스크롤을 내리면 불투명한 검정 배경으로 전환됩니다.

</br>

## ⁘ 기술적 구현 특징

### API 요청 구조 분리

axios 인스턴스를 별도 파일(`api/axios.js`)에 생성하고, API 엔드포인트 상수는 `api/requests.js`에 모아두었습니다.
컴포넌트에서는 URL 문자열을 직접 작성하지 않고 상수를 import해서 사용하므로, 엔드포인트 변경 시 한 곳만 수정하면 됩니다.

### Banner의 2단계 API 호출

배너에서 예고편을 재생하기 위해 두 번의 API를 순차적으로 호출합니다.
첫 번째 요청으로 현재 상영 중인 영화 목록을 받아 랜덤으로 영화 ID를 선택하고,
두 번째 요청에서 `append_to_response=videos` 파라미터를 붙여 영상 데이터까지 한 번에 가져옵니다.
별도 영상 전용 엔드포인트를 추가로 호출하지 않고 단일 요청으로 처리한 점이 포인트입니다.

### useDebounce 커스텀 훅으로 검색 최적화

검색어 입력 시 매 키 입력마다 API를 호출하면 불필요한 요청이 과다하게 발생합니다.
`useDebounce` 훅을 통해 검색어가 변경된 후 500ms가 지나야 실제 API 요청이 나가도록 딜레이를 두었습니다.
`useEffect` 클린업으로 이전 타이머를 취소해, 빠르게 연속 입력하면 마지막 입력 기준으로만 요청이 발생합니다.

```js
export const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // 이전 타이머 취소
    };
  }, [value, delay]);

  return debounceValue;
};
```

### useOnClickOutside 커스텀 훅으로 모달 외부 클릭 감지

모달을 `ref`로 참조하고, `mousedown`/`touchstart` 이벤트에서 클릭된 요소가 모달 내부인지 외부인지를 판별합니다.
모달 컴포넌트 자체는 닫기 로직을 알 필요 없이 훅에 `ref`와 핸들러만 넘기면 되므로, 관심사가 명확하게 분리됩니다.
`useEffect` 클린업으로 컴포넌트 언마운트 시 이벤트 리스너를 제거해 메모리 누수를 방지했습니다.

### URL 기반 검색 상태 관리

검색어를 컴포넌트 상태가 아닌 URL 쿼리 파라미터(`?q=`)에 저장합니다.
덕분에 검색 결과 페이지를 북마크하거나, 뒤로 가기 버튼으로 이전 검색어로 돌아가는 것이 자연스럽게 동작합니다.
`useLocation`으로 현재 URL을 읽고 `URLSearchParams`로 파라미터를 파싱하는 방식을 사용했습니다.

### 커스텀 화살표 슬라이더 → Swiper로 교체

초기에는 `useState`로 스크롤 위치를 직접 제어하는 커스텀 슬라이더를 구현했습니다.
이후 터치 스와이프, 반응형 슬라이드 수, 무한 루프 등 추가 기능을 위해 Swiper 라이브러리로 교체했습니다.
직접 구현 대비 코드 복잡도가 낮아졌고, 모바일 터치 경험도 개선되었습니다.

</br>

## ⁘ 트러블슈팅

### 1. 검색 결과에 인물(person) 타입과 포스터 없는 항목이 섞이는 문제

**문제**

TMDB `/search/multi` 엔드포인트는 영화, TV, 인물을 모두 반환합니다.
인물 데이터는 `backdrop_path`가 없어 이미지 렌더링에 실패하고, `null` 이미지로 레이아웃이 깨지는 경우가 있었습니다.

**해결**

`media_type !== "person"` 조건과 `backdrop_path !== null` 조건을 함께 적용해 필터링했습니다.

```js
{
  searchResults.map((movie) => {
    if (movie.backdrop_path !== null && movie.media_type !== "person") {
      // 렌더링
    }
  });
}
```

### 2. Nav 스크롤 이벤트 리스너 클린업이 제대로 동작하지 않는 문제

**문제**

`useEffect`의 클린업 함수에서 `removeEventListener`에 인라인 화살표 함수를 새로 넘기고 있어, 실제로는 리스너가 제거되지 않는 구조였습니다.
등록할 때와 해제할 때 함수 참조가 달라 `removeEventListener`가 아무것도 제거하지 못합니다.

```js
// 잘못된 클린업 — 등록한 함수와 다른 참조
return () => {
  window.removeEventListener("scroll", () => {});
};
```

**해결 방향**

리스너 함수를 변수에 저장한 뒤 동일한 참조로 등록/해제합니다.

```js
useEffect(() => {
  const handleScroll = () => {
    setShow(window.scrollY > 50);
  };
  window.addEventListener("scroll", handleScroll);
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);
```

### 3. GitHub Pages 배포 후 새로고침 또는 URL 직접 접근 시 404 발생

**문제**

GitHub Pages는 정적 파일 서버라, `/react-study/123` 같은 경로로 직접 접근하면 해당 경로의 실제 파일이 없어 404를 반환합니다.
React Router(BrowserRouter)는 클라이언트 사이드 라우팅이므로, 서버 입장에서는 `index.html` 하나만 알고 하위 경로는 모릅니다.
배포 후 새로고침하거나 링크를 직접 열면 흰 화면이 뜨는 문제가 발생했습니다.

**해결**

GitHub Pages가 404 시 `404.html`을 보여준다는 점을 이용해, 두 파일이 협력하는 우회 방식을 적용했습니다.

1. `404.html` — 현재 URL 경로를 쿼리스트링(`?/경로`) 형태로 변환해 `index.html`로 리다이렉트합니다.
2. `index.html` 상단 스크립트 — 쿼리스트링으로 들어온 경로를 실제 URL로 복원해 React Router가 올바르게 라우팅하도록 합니다.

```
직접 접근: /react-study/123
    → 404.html이 받아서 → /?/123 으로 리다이렉트
    → index.html 스크립트가 복원 → /react-study/123
    → React Router가 정상 처리
```

### 4. Banner Play 버튼 클릭 시 videos 데이터가 없으면 런타임 에러 발생

**문제**

`movie.videos.results[0].key`에 접근할 때, TMDB API가 해당 영화의 영상 데이터를 제공하지 않으면 `results`가 빈 배열이 되어 `undefined`에서 `.key`를 읽으려다 에러가 발생합니다.

**해결 방향**

Play 버튼을 렌더링하기 전에 `movie.videos?.results?.length > 0` 조건을 확인하거나,
`isClicked`가 `true`일 때도 videos 데이터 유무를 먼저 검사해 fallback UI를 보여주는 방어 코드가 필요합니다.

</br>

## ⁘ 사용 기술

| 분류            | 기술                          |
| --------------- | ----------------------------- |
| 프레임워크      | React 19                      |
| 라우팅          | React Router v7               |
| HTTP 클라이언트 | Axios                         |
| 스타일링        | CSS, styled-components        |
| 슬라이더        | Swiper                        |
| 외부 API        | TMDB (The Movie Database) API |
| 배포            | GitHub Pages                  |

</br>

## ⁘ 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build

# GitHub Pages 배포
npm run deploy
```

`.env` 파일에 TMDB API 키를 설정해야 합니다.

```
REACT_APP_TMDB_API_KEY=your_api_key_here
```
