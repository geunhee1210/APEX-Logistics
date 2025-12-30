# OTT Share Hub 🎬

프리미엄 OTT 구독 공유 플랫폼 - Netflix 스타일 UI

## 🚀 Features

- **OTT 서비스 카탈로그** - Netflix, Disney+, Spotify 등 다양한 OTT 서비스
- **구독 공유** - 파티 매칭으로 구독료 절감
- **커뮤니티** - 게시판 및 댓글 기능
- **관리자 패널** - 사용자/게시물/댓글 관리
- **반응형 디자인** - 모바일/태블릿/데스크톱 지원

## 🛠 Tech Stack

**Frontend:**
- React 19 + Vite
- React Router DOM
- Framer Motion
- Lucide React Icons
- CSS3 (Netflix-style theming)

**Backend:**
- Node.js + Express
- JWT Authentication
- bcrypt.js
- In-memory Database

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

```bash
# 1. 저장소 클론
git clone <repository-url>
cd ott-share-hub

# 2. 의존성 설치
npm run install:all

# 3. 프론트엔드 개발 서버 시작 (터미널 1)
cd frontend && npm run dev

# 4. 백엔드 서버 시작 (터미널 2)
cd backend && npm run dev
```

### Production Build

```bash
# 프론트엔드 빌드
npm run build

# 서버 시작 (프론트엔드 + 백엔드)
npm start
```

## 🌐 Deployment

### Railway (추천) 🚂

**장점:** 슬립 모드 없음, PostgreSQL 무료, 월 $5 크레딧

1. GitHub에 저장소 생성 및 코드 푸시
2. [Railway Dashboard](https://railway.app/) 접속 및 GitHub 로그인
3. **"New Project"** → **"Deploy from GitHub repo"** 선택
4. 저장소 선택 후 **"Deploy Now"** 클릭
5. 배포 완료 후 **Settings** → **Networking** → **"Generate Domain"** 클릭
6. 환경 변수 설정 (Variables 탭):
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = (랜덤 문자열)

#### PostgreSQL 추가 (선택사항 - 영구 데이터 저장)
1. 프로젝트에서 **"+ New"** → **"Database"** → **"PostgreSQL"**
2. 자동으로 `DATABASE_URL` 환경변수가 추가됨

### Render (대안)

1. [Render Dashboard](https://dashboard.render.com/) 접속
2. **"New"** → **"Web Service"** 선택
3. GitHub 저장소 연결
4. 설정:
   - **Build Command:** `npm run render-build`
   - **Start Command:** `npm start`
5. 환경 변수: `NODE_ENV`=production, `JWT_SECRET`=(랜덤)

## 💳 결제 시스템 (토스페이먼츠)

### 테스트 모드 설정

1. **토스페이먼츠 개발자 계정 생성**
   - [토스페이먼츠 개발자센터](https://developers.tosspayments.com/) 접속
   - 회원가입 및 로그인
   - "내 애플리케이션" → "애플리케이션 추가"

2. **테스트 키 발급**
   - 클라이언트 키 (Client Key): 프론트엔드에서 사용
   - 시크릿 키 (Secret Key): 백엔드에서 사용

3. **환경 변수 설정**

   **프론트엔드** (`frontend/.env`):
   ```env
   VITE_TOSS_CLIENT_KEY=test_ck_발급받은키
   ```

   **백엔드** (`backend/.env`):
   ```env
   TOSS_SECRET_KEY=test_sk_발급받은키
   ```

4. **테스트 카드 정보**
   - 카드번호: `4242 4242 4242 4242`
   - 유효기간: `12/34`
   - CVC: `123`
   - 비밀번호: `12` (간편결제)

### 실제 운영 모드

1. [토스페이먼츠 대시보드](https://dashboard.tosspayments.com/) 접속
2. 사업자등록증 등록 및 심사 완료
3. 운영 키 발급 및 환경 변수 업데이트

## 🔐 Demo Account

- **관리자:** admin@ottshare.com / password
- **일반 사용자:** 회원가입으로 생성

## 📁 Project Structure

```
ott-share-hub/
├── frontend/           # React 프론트엔드
│   ├── src/
│   │   ├── components/ # 재사용 컴포넌트
│   │   ├── pages/      # 페이지 컴포넌트
│   │   ├── context/    # React Context
│   │   ├── services/   # API 서비스
│   │   └── ...
│   └── package.json
├── backend/            # Express 백엔드
│   ├── server.js       # 메인 서버 파일
│   └── package.json
├── package.json        # 루트 패키지 (빌드 스크립트)
├── render.yaml         # Render 배포 설정
└── README.md
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### OTT Services
- `GET /api/ott` - OTT 서비스 목록
- `GET /api/ott/:id` - OTT 서비스 상세

### Posts
- `GET /api/posts` - 게시물 목록
- `GET /api/posts/:id` - 게시물 상세
- `POST /api/posts` - 게시물 작성
- `PUT /api/posts/:id` - 게시물 수정
- `DELETE /api/posts/:id` - 게시물 삭제

### Comments
- `POST /api/posts/:postId/comments` - 댓글 작성
- `PUT /api/comments/:id` - 댓글 수정
- `DELETE /api/comments/:id` - 댓글 삭제

### Admin
- `GET /api/admin/stats` - 대시보드 통계
- `GET /api/admin/users` - 사용자 목록
- `PUT /api/admin/users/:id` - 사용자 수정
- `DELETE /api/admin/users/:id` - 사용자 삭제

## 📄 License

MIT License
