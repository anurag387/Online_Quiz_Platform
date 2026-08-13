<div align="center">

# 🎯 Quizzy
### Online Quiz & Exam Platform

![Frontend MVP](https://img.shields.io/badge/type-frontend%20MVP-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-0E7C86)
![License](https://img.shields.io/badge/license-MIT-3EC1E0)

*A full-featured Online Quiz/Exam Platform for **Teachers** and **Students** — built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion, matching the design system in [`design.md`](./design.md) (deep teal + sky blue palette, rounded cards, pastel notification tags).*

</div>

---

## 📖 About

This is a **frontend MVP**: all data (quizzes, submissions, notifications) is stored in the browser via `localStorage` (through Zustand's `persist` middleware) — so there's no backend/DB to set up. Clone it, `npm install`, `npm run dev`, and it just works.

Swapping the store for a real API (Node/Express or Django + PostgreSQL/MongoDB, as suggested in `design.md`) later is simply a matter of replacing the functions in `lib/store.ts` with API calls.

## 📖 Table of Contents

1. [Features Implemented](#-features-implemented)
2. [Tech Stack](#-tech-stack)
3. [Getting Started](#-getting-started)
4. [Project Structure](#-project-structure)
5. [Suggested Next Steps](#️-suggested-next-steps)
6. [License](#-license)

---

## ✨ Features Implemented

### 🔐 Auth / Onboarding
- Role select (Teacher / Student) with animated toggle

### 👨‍🏫 Teacher Side

| Page | What it does |
|---|---|
| **Dashboard** | Notifications feed · "Make a new test" grid · "Currently happening" live quiz list |
| **Create Quiz** | Title/subject/duration/instructions · question builder (MCQ, True/False, Short answer, Fill in the blank) · per-question marks · randomize order & negative marking toggles · student whitelist |
| **Quiz Code** | Animated 6-character code reveal · copy-to-clipboard · QR code · quiz summary |
| **Submissions** | List of student submissions · auto-graded scores · manual marking UI for short-answer questions · tab-switch flags |
| **Results** | Show/hide result toggle · leaderboard · CSV export |
| **Extras** | Tests list, Profile, Settings *(dark mode / language / webcam proctoring toggles — UI only)* |

### 🧑‍🎓 Student Side

| Page | What it does |
|---|---|
| **Join Quiz** | Large code input with digit pop-in animation and shake-on-error |
| **Pre-Quiz Instructions** | Duration/questions/marks summary, anti-cheat notice, fullscreen start |
| **Quiz Taking** | Circular countdown timer *(turns red + pulses in the last 5 minutes)* · question navigation panel *(answered/unanswered color-coded)* · auto-save per answer · watermark overlay |
| **Submission Success** | Confetti + checkmark animation |
| **Result** | Animated score count-up, correct/wrong breakdown *(respects the teacher's show/hide toggle)* |

### 🛡️ Anti-Cheating Layer

`lib/useAntiCheat.ts` — honest about its limits, same as `design.md`:

- Fullscreen lock on quiz start
- Tab-switch / window-blur detection → flags shown to the teacher, content blurs while away
- Right-click and copy/paste disabled during the quiz
- Basic DevTools-shortcut / PrintScreen deterrence
- Per-student watermark overlaid on the question card

### 🎬 Animations

Role toggle slide · code digit pop-in + shake · hover scale on cards · staggered dashboard fade-ins · notification slide-in · timer pulse · question slide transitions · answer checkmark bounce · confetti burst · score count-up · tab-switch warning banner.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion |
| **State / Storage** | Zustand with `localStorage` persistence *(acts as the mock backend)* |
| **Icons** | lucide-react |
| **Confetti** | canvas-confetti |

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**.

### Try it end-to-end in two browser tabs/windows:

1. **Tab A** → continue as **Teacher** → Create Quiz → fill it in → Generate quiz code.
2. **Tab B** → continue as **Student** → enter the generated code *(e.g. `QZ-3F9K2A`)* → take the quiz.
3. **Back in Tab A** → Submissions *(mark any short-answer questions)* → Results → publish.

---

## 📁 Project Structure

```
app/
  page.tsx                        Landing / role select
  teacher/
    dashboard/                    Teacher dashboard
    tests/                        All tests list
    profile/, settings/
    create-quiz/                  Quiz + question builder
    quiz/[id]/code/                Quiz code generation
    quiz/[id]/submissions/         Submissions + manual marking
    quiz/[id]/results/             Publish results / leaderboard / CSV export
  student/
    join/                         Enter quiz code
    quiz/[code]/instructions/      Pre-quiz instructions
    quiz/[code]/take/              Quiz-taking flow (timer, anti-cheat, nav panel)
    quiz/[code]/success/           Submission success (confetti)
    quiz/[code]/result/            Score + breakdown
components/                       Sidebar, Topbar, QuizCard, NotificationCard, Timer
lib/
  types.ts                        Shared TypeScript types
  store.ts                        Zustand store (quizzes, submissions, notifications)
  useAntiCheat.ts                 Anti-cheat hook
```

---

## 🗺️ Suggested Next Steps

*(from the original design doc)*

- [ ] Swap the Zustand/localStorage store for a real backend (Node/Express or Django) + PostgreSQL/MongoDB, with JWT or Firebase Auth
- [ ] Add Socket.io / Firebase Realtime DB for live submission tracking on the teacher dashboard
- [ ] Add a Question Bank so teachers can reuse questions across quizzes
- [ ] Add per-question timers *(strict mode)* and webcam proctoring
- [ ] Add dark mode and বাংলা/English language toggle *(settings UI is already stubbed in)*
- [ ] Deploy: Vercel *(frontend)* + Railway/Render *(backend)*, as noted in `design.md`

---

## 📄 License

**MIT** — do whatever you like with it.

---

<div align="center">
<sub>Made with 💙 for <b>Quizzy</b></sub>
</div>
