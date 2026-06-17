# 🎬 Netflix Clone App

TMDB API를 활용해 영화 데이터를 조회하고, 배너·카테고리별 슬라이더·검색·상세 모달 기능을 구현한 넷플릭스 클론 웹 애플리케이션입니다.

</br>

## 🎞 Preview

<p align="center">
  <img width="800" height="405" alt="Netflix Clone Preview" src="https://github.com/user-attachments/assets/535f6ff1-c142-4b6a-953e-de797a38a7ff" />
</p>

</br>

## ⁘ 주요 기능

### 1. 메인 배너

현재 상영 중인 영화 목록에서 랜덤으로 한 편을 선택해 메인 배너에 표시합니다.
Play 버튼 클릭 시 해당 영화의 YouTube 예고편을 전체 화면으로 재생합니다.

### 2. 카테고리별 영화 슬라이더

영화 데이터를 카테고리별로 분리해 Row 컴포넌트로 렌더링합니다.

* Netflix Originals
* 지금 뜨는 콘텐츠
* 최고 평점
* 액션
* 코미디 등

Swiper 라이브러리를 적용해 터치 슬라이드를 지원하며, 화면 너비에 따라 표시되는 슬라이드 개수가 자동으로 조정됩니다.

### 3. 영화 상세 모달

포스터 클릭 시 영화의 상세 정보를 모달로 표시합니다.

* 제목
* 개봉일
* 평점
* 줄거리

모달 바깥 영역 클릭 또는 닫기 버튼 클릭 시 모달이 닫히도록 구현했습니다.

### 4. 검색

네비게이션 바의 검색 입력창에 키워드를 입력하면 검색 결과가 표시됩니다.
검색 결과를 클릭하면 해당 영화의 상세 페이지로 이동합니다.

### 5. 스크롤 감지 네비게이션

페이지 최상단에서는 투명한 네비게이션 바를 보여주고, 스크롤이 발생하면 불투명한 검정 배경으로 전환되도록 구현했습니다.

</br>

## ⁘ 구현 및 학습 내용

### API 요청 구조 분리

Axios 인스턴스를 `api/axios.js`에 분리하고, API 엔드포인트는 `api/requests.js`에서 상수로 관리했습니다.

컴포넌트 내부에서 URL 문자열을 직접 작성하지 않고 필요한 요청 상수를 import해 사용하도록 구성했습니다.
이를 통해 API 경로가 변경될 경우 요청 관련 파일만 수정하면 되도록 관리 범위를 줄였습니다.

```js
// api/requests.js
const requests = {
  fetchNowPlaying: `/movie/now_playing?api_key=${API_KEY}&language=ko-KR`,
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=ko-KR`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=ko-KR`,
};
```

### Banner 데이터 요청 흐름

메인 배너에서는 영화 목록 조회와 예고편 데이터 조회를 순차적으로 처리했습니다.

1. 현재 상영 중인 영화 목록을 요청합니다.
2. 응답 데이터 중 랜덤으로 한 영화를 선택합니다.
3. 선택된 영화 ID를 기준으로 상세 정보를 다시 요청합니다.
4. `append_to_response=videos` 파라미터를 사용해 영상 데이터를 함께 가져옵니다.

이 과정을 통해 영화 목록 데이터와 개별 영화 상세 데이터를 연결해 사용하는 흐름을 익혔습니다.

### useDebounce 커스텀 훅을 활용한 검색 최적화

검색어가 입력될 때마다 API 요청이 발생하지 않도록 `useDebounce` 커스텀 훅을 구현했습니다.

입력값이 변경된 후 500ms가 지난 시점에만 검색 요청이 실행되도록 처리했으며, 사용자가 빠르게 연속 입력할 경우 이전 타이머를 제거해 마지막 입력값 기준으로만 요청이 발생하도록 구성했습니다.

```js
export const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue;
};
```

### useOnClickOutside 커스텀 훅을 활용한 모달 제어

모달 외부 영역 클릭을 감지하기 위해 `useOnClickOutside` 커스텀 훅을 구현했습니다.

모달 DOM을 `ref`로 참조하고, `mousedown` 및 `touchstart` 이벤트에서 클릭 대상이 모달 내부인지 외부인지 판별합니다.
모달 컴포넌트는 닫기 로직을 직접 관리하지 않고, 훅에 `ref`와 핸들러를 전달하는 방식으로 분리했습니다.

또한 컴포넌트 언마운트 시 이벤트 리스너를 제거해 불필요한 이벤트 누적을 방지했습니다.

### URL 쿼리 파라미터 기반 검색 상태 관리

검색어를 컴포넌트 내부 상태에만 저장하지 않고 URL 쿼리 파라미터로 관리했습니다.

```txt
/search?q=keyword
```

`useLocation`과 `URLSearchParams`를 사용해 현재 URL의 검색어를 읽어오며, 이를 기반으로 검색 결과를 렌더링합니다.

이 방식을 통해 검색 결과 페이지를 새로고침하거나 URL을 공유해도 동일한 검색어 기준의 결과를 유지할 수 있도록 했습니다.

### Swiper 라이브러리를 활용한 슬라이더 적용

초기에는 `useState`를 기반으로 슬라이드 위치를 직접 제어하는 커스텀 슬라이더를 구현했습니다.

이후 모바일 터치 조작과 반응형 슬라이드 개수 조정을 안정적으로 처리하기 위해 Swiper 라이브러리를 적용했습니다.
이를 통해 슬라이더 관련 상태 관리 로직을 줄이고, 다양한 화면 크기에서 더 자연스러운 사용자 경험을 제공할 수 있도록 개선했습니다.

</br>

## ⁘ 트러블슈팅

### 1. 검색 결과에 person 타입과 이미지가 없는 항목이 포함되는 문제

#### 문제

TMDB의 `/search/multi` 엔드포인트는 영화뿐만 아니라 TV 프로그램과 인물 데이터도 함께 반환합니다.
이 중 인물 데이터나 이미지 경로가 없는 데이터가 렌더링될 경우 이미지가 깨지거나 레이아웃이 어긋나는 문제가 발생했습니다.

#### 해결

검색 결과 렌더링 전에 `media_type`과 `backdrop_path`를 기준으로 필터링했습니다.

```js
searchResults.map((movie) => {
  if (movie.backdrop_path !== null && movie.media_type !== "person") {
    // 렌더링
  }
});
```

이를 통해 이미지가 없는 데이터와 인물 데이터를 제외하고, 영화 및 콘텐츠 중심의 검색 결과만 표시되도록 처리했습니다.

---

### 2. 스크롤 이벤트 리스너가 정상적으로 제거되지 않는 문제

#### 문제

네비게이션 배경 전환을 위해 `scroll` 이벤트를 등록했지만, 클린업 함수에서 등록 시 사용한 함수와 다른 함수 참조를 전달하고 있었습니다.

```js
return () => {
  window.removeEventListener("scroll", () => {});
};
```

이 경우 `removeEventListener`가 기존에 등록된 이벤트 리스너를 제거하지 못합니다.

#### 해결

이벤트 핸들러 함수를 변수로 선언한 뒤, 동일한 함수 참조를 `addEventListener`와 `removeEventListener`에 전달했습니다.

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

이를 통해 컴포넌트 언마운트 시 이벤트 리스너가 정상적으로 제거되도록 수정했습니다.

---

### 3. GitHub Pages 배포 후 새로고침 시 404가 발생하는 문제

#### 문제

React Router의 `BrowserRouter`는 클라이언트 사이드 라우팅 방식으로 동작합니다.
하지만 GitHub Pages는 정적 파일 서버이기 때문에 `/movie/123`과 같은 하위 경로로 직접 접근하면 해당 경로의 실제 파일을 찾지 못해 404를 반환합니다.

#### 해결

GitHub Pages가 404 발생 시 `404.html`을 보여준다는 점을 활용해 우회 처리했습니다.

1. `404.html`에서 현재 접근 경로를 쿼리스트링 형태로 변환해 `index.html`로 리다이렉트합니다.
2. `index.html`의 스크립트에서 쿼리스트링으로 전달된 경로를 다시 복원합니다.
3. React Router가 복원된 URL을 기준으로 올바른 페이지를 렌더링합니다.

```txt
/movie/123 직접 접근
→ 404.html
→ /?/movie/123 형태로 리다이렉트
→ index.html에서 경로 복원
→ React Router가 정상 라우팅
```

이를 통해 GitHub Pages 환경에서도 새로고침 및 직접 URL 접근이 가능하도록 처리했습니다.

</br>

## ⁘ 개선 예정

### 예고편 데이터가 없는 경우에 대한 예외 처리

현재 Play 버튼 클릭 시 영화의 `videos` 데이터를 기준으로 YouTube 예고편을 재생합니다.
일부 영화는 TMDB API에서 예고편 데이터를 제공하지 않을 수 있기 때문에, 영상 데이터가 없는 경우를 대비한 방어 로직을 추가할 예정입니다.

예상 처리 방향은 다음과 같습니다.

* `movie.videos?.results?.length > 0` 조건 확인
* 예고편이 없는 경우 Play 버튼 비활성화
* 또는 “제공되는 예고편이 없습니다.”와 같은 fallback UI 표시

</br>

## ⁘ 사용 기술

| 분류         | 기술                     |
| ---------- | ---------------------- |
| 프레임워크      | React 19               |
| 라우팅        | React Router v7        |
| HTTP 클라이언트 | Axios                  |
| 스타일링       | CSS, styled-components |
| 슬라이더       | Swiper                 |
| 외부 API     | TMDB API               |
| 배포         | GitHub Pages           |

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

```env
REACT_APP_TMDB_API_KEY=your_api_key_here
```
