<div align="center">

# 🎯 Quizzy
### Online Quiz & Exam Platform — Design & Product Specification

![Status](https://img.shields.io/badge/status-in%20development-brightgreen)
![Version](https://img.shields.io/badge/version-1.0-blue)
![Roles](https://img.shields.io/badge/roles-Teacher%20%7C%20Student-3EC1E0)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20Tailwind-0E7C86)

*একটা আধুনিক, রঙিন ও ইন্টারঅ্যাক্টিভ Online Quiz Platform — যেখানে টিচাররা সহজে পরীক্ষা তৈরি করবে, আর শিক্ষার্থীরা নির্ঝঞ্ঝাটে পরীক্ষা দিবে।*

</div>

## 📖 সূচিপত্র

1. [প্রজেক্ট ওভারভিউ](#-১-প্রজেক্ট-ওভারভিউ)
2. [ডিজাইন সিস্টেম](#-২-ডিজাইন-সিস্টেম)
3. [মূল স্ক্রিন / পেজ লিস্ট](#-৩-মূল-স্ক্রিন--পেজ-লিস্ট)
4. [Anti-Cheating ফিচার](#-৪-anti-cheating-ai-ও-screenshot-সুরক্ষা)
5. [টাইমার সিস্টেম](#-৫-টাইমার-সিস্টেম)
6. [অ্যানিমেশন গাইড](#-৬-অ্যানিমেশন-গাইড)
7. [এক্সট্রা ফিচার আইডিয়া](#-৭-এক্সট্রা-ফিচার-আইডিয়া)
8. [Tech Stack](#-৮-প্রস্তাবিত-tech-stack)
9. [Roadmap](#-৯-পরবর্তী-ধাপ-roadmap)

---

## 🧩 ১. প্রজেক্ট ওভারভিউ

একটা **Online Quiz/Exam Platform**, যেখানে দুইটা ইউজার রোল থাকবে।

### 👨‍🏫 Teacher (Admin/Instructor)
- ✏️ কুইজ তৈরি করবে, প্রশ্ন যোগ করবে
- 🔑 ইউনিক কুইজ কোড অটো-জেনারেট হবে
- 📥 শিক্ষার্থীদের সাবমিশন দেখবে
- ✅ মার্ক দিবে / অটো-মার্কিং দেখবে
- 📢 রেজাল্ট পাবলিশ করবে

### 🧑‍🎓 Student
- 🔢 কোড দিয়ে কুইজে জয়েন করবে
- ⏳ টাইমারের মধ্যে পরীক্ষা দিবে
- 📤 সাবমিট করবে
- 🏆 *(অনুমতি সাপেক্ষে)* রেজাল্ট দেখবে

> 💬 রেফারেন্স UI (আপলোড করা ছবি) থেকে যে ডিজাইন ল্যাংগুয়েজ নেওয়া হয়েছে, তা নিচে বিস্তারিত বর্ণনা করা হলো।

---

## 🎨 ২. ডিজাইন সিস্টেম

*(Reference Image থেকে সংগৃহীত)*

### 🌈 Color Palette

| Element | Color Name | Hex Code |
|---|---|:---:|
| 🟦 Background *(outer)* | Deep Teal | `#0E7C86` |
| ⬜ Card Background | White | `#FFFFFF` |
| 🔵 Primary Accent *(icons/buttons)* | Sky Blue | `#3EC1E0` |
| 🌸 Notification — Alert | Soft Pink/Red | `#FADBD8` |
| 🟢 Notification — Success | Soft Green | `#D9F2E6` |
| 🔷 Notification — Info | Soft Blue | `#DBEFFA` |
| ⬛ Text Primary | Dark Slate | `#1E2A32` |
| ⬜ Text Secondary | Gray | `#8A94A6` |
| 🔵 Sidebar — Active Icon | Sky Blue | `#3EC1E0` |
| ⬜ Sidebar — Inactive Icon | Light Gray | `#B8C0CC` |

### ✍️ Typography

| Usage | Style |
|---|---|
| 🔤 Font Family | **Inter** / Poppins / General Sans *(rounded, modern sans-serif)* |
| 📌 Headings | Semi-bold · 18–24px |
| 📄 Body Text | Regular · 14–16px |
| 🏷️ Labels / Small Text | 12–13px · Gray |

### 🧱 Layout Style

```
✅ Rounded corners সব জায়গায়     →  border-radius: 16–20px
✅ Card-based layout, soft shadow →  box-shadow: 0 8px 24px rgba(0,0,0,0.08)
✅ Left sidebar (icon + label)    →  Home · Tests · Profile · Settings
✅ Top search bar
✅ Grid-based "Make a new test"   →  icon cards
✅ Notification cards              →  pastel background দিয়ে category আলাদা
```

---

## 🖥️ ৩. মূল স্ক্রিন / পেজ লিস্ট

### 🔐 Auth

| # | Page | বিবরণ |
|:---:|---|---|
| 1 | 🔑 **Login / Signup** | Role select (Teacher / Student), soft toggle animation |
| 2 | 👋 **Onboarding** | প্রথমবার Teacher নাকি Student — সেটা সিলেক্ট করাবে |

### 👨‍🏫 Teacher Side

| # | Page | বিবরণ |
|:---:|---|---|
| 3 | 🏠 **Teacher Dashboard** | Notification panel · "Make a new test" (Blank / MCQ / Fill-in-Blank) · "Currently happening" live quiz cards |
| 4 | 📝 **Create Quiz Page** | Title, subject, duration, instructions · Question builder (MCQ/Short/Fill/T-F) · Marks per question · Randomize & negative-marking toggle |
| 5 | 🔢 **Quiz Code Generation** | ৬-ডিজিট ইউনিক কোড *(যেমন `QZ-3F9K2A`)* · Copy/Share + QR কোড · Email whitelist অপশন |
| 6 | 📊 **Submissions / Marking** | Submit status লিস্ট · Auto-graded MCQ score · Manual marking UI (short-answer) |
| 7 | 📢 **Result Publish** | "Show result" টগল · Leaderboard *(optional)* · Export CSV/PDF |

### 🧑‍🎓 Student Side

| # | Page | বিবরণ |
|:---:|---|---|
| 8 | 🔢 **Join Quiz Page** | বড় কোড ইনপুট বক্স + verify অ্যানিমেশন |
| 9 | 📋 **Pre-Quiz Instructions** | নিয়ম, টাইম লিমিট, মোট মার্ক, ফুলস্ক্রিন রিমাইন্ডার |
| 10 | ✍️ **Quiz Taking Page** | Countdown timer *(শেষ ৫ মিনিটে 🔴)* · Answer navigation প্যানেল · Auto-save |
| 11 | 🎉 **Submission Success** | Confetti / checkmark অ্যানিমেশন |
| 12 | 🏆 **Result Page** | *(অনুমতি সাপেক্ষে)* Score, breakdown, rank |

---

## 🛡️ ৪. Anti-Cheating (AI ও Screenshot সুরক্ষা)

> ⚠️ **সততার সাথে জানিয়ে রাখা ভালো:** ব্রাউজার/ওয়েব প্রযুক্তি দিয়ে স্ক্রিনশট ১০০% ব্লক করা সম্ভব না *(OS-level টুল বা দ্বিতীয় ডিভাইস দিয়ে ছবি তোলা আটকানো যায় না)*। তবে নিচের কম্বিনেশন দিয়ে যথেষ্ট **deterrence** তৈরি করা সম্ভব।

| ফিচার | বর্ণনা |
|---|---|
| 🖥️ **Fullscreen Lock** | কুইজ শুরুতে বাধ্যতামূলক Fullscreen API — exit করলে warning + auto-pause |
| 👁️ **Tab-switch Detection** | `visibilitychange` দিয়ে ট্র্যাক, টিচারকে flag পাঠানো |
| 🚫 **Right-click Disable** | `contextmenu`, `user-select: none` |
| 📋 **Copy/Paste Disable** | প্রশ্নের এরিয়াতে `oncopy`, `oncut` ব্লক |
| 🔍 **DevTools Detection** | কনসোল ওপেন করলে warning/auto-submit |
| 🖨️ **Print Screen Detection** | `keydown` এ ক্যাচ করে লগ রাখা |
| 🌫️ **CSS Blur on Tab-out** | ট্যাব থেকে সরলে কন্টেন্ট auto-blur |
| 🏷️ **Watermark Overlay** | নাম/আইডি হালকা watermark — স্ক্রিনশটেও trace থাকে |
| ⏱️ **Time-boxed Question** *(strict mode)* | প্রতি প্রশ্নে fixed সময়, পিছনে ফেরা যাবে না |
| 📷 **Webcam Proctoring** *(future)* | Periodic snapshot, একাধিক মুখ ডিটেক্ট হলে flag |

---

## ⏱️ ৫. টাইমার সিস্টেম

- ⏳ কুইজ-লেভেল টাইমার *(default)*
- ⏳ প্রশ্ন-লেভেল টাইমার *(optional)*
- ✅ সময় শেষ হলে **auto-submit**

**UI:** সার্কুলার প্রোগ্রেস রিং + সংখ্যা → শেষ ৫ মিনিটে 🔴 লাল + পালস অ্যানিমেশন + সাউন্ড অ্যালার্ট *(mute করা যাবে)*

---

## ✨ ৬. অ্যানিমেশন গাইড

| জায়গা | অ্যানিমেশন |
|---|---|
| 🔐 Login/Role toggle | Smooth slide + fade transition |
| 🔢 Quiz code input | Digit-by-digit pop-in · wrong code → shake |
| 🃏 "Make a new test" কার্ড | Hover → scale-up (1.03x) + shadow বৃদ্ধি |
| 🔔 Notification কার্ড | Slide-in from right + fade |
| ⏱️ Timer — শেষ ৫ মিনিট | লাল পালস/গ্লো অ্যানিমেশন |
| ➡️ প্রশ্ন পরিবর্তন | Slide/fade transition |
| ✔️ Answer সিলেক্ট | Checkmark bounce |
| 📤 Submit বাটন | Spinner → success checkmark morph |
| 🎉 Submission Success | Confetti burst + checkmark draw |
| 🔢 Result reveal | Score counter count-up animation |
| 🚨 Tab-switch warning | Red banner slide-down + shake |
| 📌 Sidebar navigation | Active indicator smooth slide |
| 📊 Dashboard কার্ড লোড | Staggered fade-in |

**Recommended Libraries:** `Framer Motion` (React) · `GSAP` (Complex animation) · `Lottie` (Confetti/Success) · `CSS Transitions` (Hover effects)

---

## 💡 ৭. এক্সট্রা ফিচার আইডিয়া

- 📊 **Analytics Dashboard** — কোন প্রশ্নে সবচেয়ে বেশি ভুল, average score, completion rate
- 🏆 **Leaderboard / Ranking** *(optional toggle)*
- 📁 **Question Bank** — প্রশ্ন সেভ করে রিইউজ
- 🔀 **Question & Option Shuffle** — প্রতি স্টুডেন্টের জন্য আলাদা অর্ডার
- 📧 **Email/Notification System** — রিমাইন্ডার, রেজাল্ট পাবলিশ অ্যালার্ট
- 🌙 **Dark Mode**
- 📱 **Responsive Mobile View**
- 🖨️ **Export Result** (PDF/Excel)
- ⏸️ **Auto-save Draft** — নেট চলে গেলেও উত্তর হারাবে না
- 🔒 **One Device / One Session Lock**
- 🗣️ **Multi-language Support** (বাংলা/English toggle)

---

## ⚙️ ৮. প্রস্তাবিত Tech Stack

| Layer | Technology |
|---|---|
| 🎨 **Frontend** | React (Next.js) · Tailwind CSS · Framer Motion |
| 🔧 **Backend** | Node.js (Express) / Django |
| 🗄️ **Database** | PostgreSQL / MongoDB |
| 🔑 **Auth** | JWT / Firebase Auth |
| ⚡ **Realtime** | Socket.io / Firebase Realtime DB |
| ☁️ **Hosting** | Vercel *(frontend)* + Railway/Render *(backend)* |

---

## 🗺️ ৯. পরবর্তী ধাপ (Roadmap)

- [ ] **Phase 1** — 🔐 Auth + Role system (Teacher/Student)
- [ ] **Phase 2** — 📝 Quiz creation + code generation *(MVP)*
- [ ] **Phase 3** — ✍️ Student join + quiz-taking flow + timer
- [ ] **Phase 4** — 🛡️ Anti-cheat basic layer (fullscreen, tab-switch)
- [ ] **Phase 5** — 📊 Marking + result system
- [ ] **Phase 6** — ✨ Analytics + polish + animation pass

---

<div align="center">
<sub>Made with 💙 for <b>Quizzy</b></sub>
</div>
