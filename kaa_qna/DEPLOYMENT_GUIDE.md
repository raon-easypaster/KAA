# The Seer 프로젝트 Vercel 배포 가이드

이 문서는 The Seer Next.js 프로젝트를 Vercel에 배포하고 Postgres 데이터베이스를 설정하는 전체 과정을 설명합니다.

---

## 📋 목차

1. [사전 준비](#사전-준비)
2. [Vercel 계정 및 프로젝트 설정](#vercel-계정-및-프로젝트-설정)
3. [GitHub 연결](#github-연결)
4. [Vercel Postgres 데이터베이스 생성](#vercel-postgres-데이터베이스-생성)
5. [환경 변수 설정](#환경-변수-설정)
6. [데이터베이스 초기화](#데이터베이스-초기화)
7. [배포하기](#배포하기)
8. [배포 확인 및 문제 해결](#배포-확인-및-문제-해결)

---

## 사전 준비

배포를 시작하기 전에 다음 항목들이 준비되어 있어야 합니다:

### 필수 요구사항
- ✅ GitHub 계정
- ✅ Vercel 계정 (없다면 https://vercel.com 에서 GitHub 계정으로 가입)
- ✅ 프로젝트 코드가 GitHub 저장소에 업로드되어 있어야 함
- ✅ Node.js 설치 (로컬 테스트용)

### 프로젝트 구조 확인
```
the_seer-main/
├── src/
│   └── app/
│       ├── page.tsx          # 메인 페이지
│       ├── lib/
│       │   ├── actions.ts    # 서버 액션
│       │   └── definitions.ts # 타입 정의
│       └── qa/               # Q&A 페이지
├── scripts/
│   └── seed.js               # 데이터베이스 초기화 스크립트
├── package.json
└── next.config.ts
```

---

## Vercel 계정 및 프로젝트 설정

### 1단계: Vercel 로그인
1. [Vercel 웹사이트](https://vercel.com)에 접속
2. **Sign Up** 또는 **Log In** 클릭
3. **Continue with GitHub** 선택하여 GitHub 계정으로 로그인

### 2단계: 새 프로젝트 생성
1. Vercel 대시보드에서 **Add New...** 버튼 클릭
2. **Project** 선택

---

## GitHub 연결

### 3단계: 저장소 선택
1. **Import Git Repository** 섹션에서 GitHub 저장소 목록 확인
2. `the_seer` 또는 프로젝트가 업로드된 저장소를 찾아 **Import** 클릭
   - 저장소가 보이지 않으면 **Adjust GitHub App Permissions** 클릭하여 권한 부여

### 4단계: 프로젝트 설정
**Configure Project** 화면에서:
- **Project Name**: `the-seer` (자동으로 URL이 됨: `the-seer.vercel.app`)
- **Framework Preset**: Next.js (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build and Output Settings**: 기본값 유지

> ⚠️ **주의**: 아직 **Deploy** 버튼을 누르지 마세요! 먼저 데이터베이스를 설정해야 합니다.

---

## Vercel Postgres 데이터베이스 생성

### 5단계: Storage 추가
1. Vercel 프로젝트 대시보드 상단의 **Storage** 탭 클릭
2. **Create Database** 버튼 클릭
3. **Postgres** 선택
4. 다음 정보 입력:
   - **Database Name**: `the-seer-db` (원하는 이름)
   - **Region**: **iad1 (Washington, D.C., USA)** 선택 (가장 가까운 지역)
5. **Create** 버튼 클릭

### 6단계: 데이터베이스 연결
1. 생성된 데이터베이스를 클릭
2. **Connect Project** 버튼 클릭
3. 연결할 프로젝트 선택 (방금 생성한 `the-seer`)
4. **Environment**: **Production**, **Preview**, **Development** 모두 체크
5. **Connect** 클릭

---

## 환경 변수 설정

### 7단계: 환경 변수 자동 설정 확인
데이터베이스를 프로젝트에 연결하면 다음 환경 변수들이 **자동으로** 추가됩니다:

```
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
```

확인 방법:
1. 프로젝트 대시보드에서 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Environment Variables** 선택
3. 위 변수들이 자동으로 추가되어 있는지 확인

> 💡 **팁**: 이 변수들은 자동으로 설정되므로 직접 입력할 필요가 없습니다.

---

## 데이터베이스 초기화

### 8단계: 데이터베이스 테이블 생성

프로젝트의 `scripts/seed.js` 파일이 다음 테이블을 생성합니다:

**`posts` 테이블 구조:**
```sql
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 방법 1: Vercel CLI로 초기화 (권장)
1. 터미널에서 프로젝트 폴더로 이동:
   ```bash
   cd /Users/galeb76/Downloads/the_seer-main
   ```

2. Vercel CLI 설치 (처음 한 번만):
   ```bash
   npm i -g vercel
   ```

3. Vercel에 로그인:
   ```bash
   vercel login
   ```

4. 프로젝트 연결:
   ```bash
   vercel link
   ```
   - 질문에 답변:
     - Link to existing project? **Yes**
     - Project name: **the-seer** 선택

5. 환경 변수 다운로드:
   ```bash
   vercel env pull .env.local
   ```

6. 데이터베이스 초기화:
   ```bash
   node scripts/seed.js
   ```

7. 성공 메시지 확인:
   ```
   Created "posts" table
   ```

### 방법 2: Vercel 대시보드에서 SQL 직접 실행
1. Vercel 대시보드 → **Storage** → 생성한 데이터베이스 클릭
2. **Data** 탭에서 **Query** 클릭
3. 다음 SQL 쿼리 입력 및 실행:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   
   CREATE TABLE IF NOT EXISTS posts (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     content TEXT NOT NULL,
     author VARCHAR(255) NOT NULL,
     password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   ```
4. **Run Query** 클릭

---

## 배포하기

### 9단계: 첫 배포 실행
1. Vercel 프로젝트 대시보드로 돌아가기
2. **Deployments** 탭 클릭
3. **Deploy** 버튼 클릭 (또는 GitHub에 새로운 커밋 푸시)

### 10단계: 배포 진행 상황 확인
- **Building**: 프로젝트 빌드 중
- **Deploying**: 배포 중
- **Ready**: 배포 완료 ✅

배포 시간: 약 1-3분

---

## 배포 확인 및 문제 해결

### 11단계: 배포 확인
1. 배포 완료 후 **Visit** 버튼 클릭
2. 또는 브라우저에서 `https://the-seer.vercel.app` 접속
3. 페이지가 정상적으로 로드되는지 확인
4. Q&A 게시판으로 이동 (메뉴에서)
5. 게시글 작성/조회 기능 테스트

### 자주 발생하는 문제 및 해결

#### 문제 1: 빌드 실패
**증상**: Build failed 메시지  
**해결**:
1. **Logs** 탭에서 에러 메시지 확인
2. 주로 타입스크립트 에러나 의존성 문제:
   ```bash
   # 로컬에서 테스트
   npm run build
   ```
3. 에러 수정 후 다시 커밋 & 푸시

#### 문제 2: 데이터베이스 연결 실패
**증상**: Database connection error  
**해결**:
1. **Settings** → **Environment Variables**에서 `POSTGRES_URL` 확인
2. 데이터베이스가 프로젝트에 올바르게 연결되었는지 확인
3. **Redeploy** 버튼으로 재배포

#### 문제 3: 페이지는 보이지만 기능 작동 안 함
**증상**: Q&A 게시판에서 글 작성/조회 실패  
**해결**:
1. 데이터베이스 테이블이 생성되었는지 확인:
   - **Storage** → **Data** → **Browse**에서 `posts` 테이블 확인
2. 없다면 [8단계](#데이터베이스-초기화) 다시 실행

#### 문제 4: 404 Not Found
**증상**: 특정 페이지 접근 시 404  
**해결**:
1. 파일 경로 확인 (`src/app` 구조)
2. 동적 라우트 문법 확인
3. **Redeploy**

---

## 추가 설정 (선택사항)

### 커스텀 도메인 연결
1. **Settings** → **Domains**
2. **Add** 버튼 클릭
3. 소유한 도메인 입력 (예: `theseer.co.kr`)
4. DNS 설정 안내에 따라 도메인 제공업체에서 설정

### 자동 배포 설정
- GitHub의 `main` 브랜치에 푸시하면 자동으로 배포됨
- PR(Pull Request)을 생성하면 Preview 배포가 자동 생성됨

### 프로덕션 환경 분리
- **Production**: `main` 브랜치
- **Preview**: 다른 브랜치 (자동 생성)
- **Development**: 로컬 환경

---

## 체크리스트

배포 완료 전 최종 확인:

- [ ] Vercel 계정 생성 및 GitHub 연동
- [ ] 프로젝트를 Vercel에 Import
- [ ] Postgres 데이터베이스 생성
- [ ] 데이터베이스를 프로젝트에 연결
- [ ] 환경 변수 자동 설정 확인
- [ ] `posts` 테이블 생성 (seed.js 실행 또는 SQL 직접 실행)
- [ ] 첫 배포 실행
- [ ] 배포된 사이트 접속 확인
- [ ] Q&A 게시판 기능 테스트

---

## 유용한 명령어

```bash
# 로컬 개발 서버 실행
npm run dev

# 빌드 테스트 (배포 전 확인)
npm run build

# Vercel에 배포 (CLI)
vercel

# 프로덕션 배포 (CLI)
vercel --prod

# 환경 변수 가져오기
vercel env pull .env.local

# 데이터베이스 초기화
node scripts/seed.js
```

---

## 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel Postgres 문서](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel CLI 문서](https://vercel.com/docs/cli)

---

## 버전 정보

- **Next.js**: 16.1.6
- **React**: 19.2.3
- **Node.js**: 20.x 이상 권장
- **Database**: Vercel Postgres

---

**작성일**: 2026-02-04  
**마지막 수정**: 2026-02-04

이 가이드를 따라 배포에 문제가 있다면 Vercel 로그를 확인하거나 개발팀에 문의하세요.
