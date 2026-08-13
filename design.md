# Online Quiz Exam Platform — Design Document

## ১. প্রজেক্ট ওভারভিউ

একটা Online Quiz/Exam Platform যেখানে দুইটা ইউজার রোল থাকবে:

- **Teacher (Admin/Instructor):** কুইজ তৈরি করবে, প্রশ্ন দিবে, একটা ইউনিক কুইজ কোড জেনারেট হবে, শিক্ষার্থীদের সাবমিশন দেখবে, মার্ক দিবে/অটো-মার্কিং দেখবে, রেজাল্ট পাবলিশ করবে।
- **Student:** কোড দিয়ে কুইজে জয়েন করবে, টাইমার-এর মধ্যে পরীক্ষা দিবে, সাবমিট করবে, (টিচার চাইলে) রেজাল্ট দেখতে পারবে।

রেফারেন্স UI (আপলোড করা ছবি) থেকে যে ডিজাইন ল্যাংগুয়েজ নেওয়া হয়েছে তা নিচে বর্ণনা করা হলো।

---

## ২. ডিজাইন সিস্টেম (Reference Image থেকে)

### Color Palette
| Element | Color | Hex (approx) |
|---|---|---|
| Background (outer) | Deep Teal | `#0E7C86` |
| Card Background | White | `#FFFFFF` |
| Primary Accent (icons/buttons) | Sky Blue | `#3EC1E0` |
| Highlight Card 1 (notification - red/pink) | Soft Pink/Red | `#FADBD8` |
| Highlight Card 2 (notification - green) | Soft Green | `#D9F2E6` |
| Highlight Card 3 (notification - blue) | Soft Blue | `#DBEFFA` |
| Text Primary | Dark Slate | `#1E2A32` |
| Text Secondary | Gray | `#8A94A6` |
| Sidebar Active Icon | Sky Blue | `#3EC1E0` |
| Sidebar Inactive Icon | Light Gray | `#B8C0CC` |

### Typography
- Font: **Inter / Poppins / General Sans** (rounded, modern sans-serif)
- Headings: Semi-bold, 18–24px
- Body: Regular, 14–16px
- Labels/small text: 12–13px, Gray

### Layout Style
- Rounded corners সব জায়গায় (`border-radius: 16–20px`)
- Card-based layout, soft shadow (`box-shadow: 0 8px 24px rgba(0,0,0,0.08)`)
- Left sidebar navigation (icon + label): Home, Tests, Profile, Settings
- Top search bar
- Grid-based "Make a new test" section (icon cards)
- Notification cards পাশে রঙিন pastel background দিয়ে category আলাদা করা

---

## ৩. মূল স্ক্রিন / পেইজ লিস্ট

### 🔹 Auth
1. **Login/Signup** — Role select (Teacher / Student), soft toggle animation
2. **Onboarding** — Teacher নাকি Student সেটা প্রথমবার সিলেক্ট করাবে

### 🔹 Teacher Side
3. **Teacher Dashboard** (রেফারেন্স ইমেজের মতো)
   - Notifications panel (submission alert, verification alert ইত্যাদি)
   - "Make a new test" → Blank Test / MCQ Test / Fill in the Blank Test
   - "Currently happening" → live/ongoing quiz card লিস্ট
4. **Create Quiz Page**
   - Quiz title, subject, duration (timer set), instructions
   - Question builder (MCQ / Short answer / Fill in blank / True-False)
   - প্রতি প্রশ্নে marks সেট করা যাবে
   - Randomize question order toggle
   - Negative marking toggle
5. **Quiz Code Generation Page**
   - কুইজ তৈরি শেষে একটা ৬-ডিজিট ইউনিক কোড অটো জেনারেট হবে (যেমন `QZ-3F9K2A`)
   - কোড কপি/শেয়ার বাটন + QR কোড অপশন
   - নির্দিষ্ট স্টুডেন্ট ইমেইল/আইডি দিয়ে whitelist করারও অপশন (শুধু ওই স্টুডেন্টরাই কোড দিয়ে ঢুকতে পারবে)
6. **Submissions/Marking Page**
   - স্টুডেন্ট লিস্ট, কে সাবমিট করেছে/করেনি
   - Auto-graded MCQ score সাথে সাথে দেখাবে
   - Short-answer টাইপ প্রশ্নের জন্য manual marking UI
7. **Result Publish Page**
   - Toggle: "Show result to students" ON/OFF
   - Leaderboard/rank view (optional)
   - Export result CSV/PDF বাটন

### 🔹 Student Side
8. **Join Quiz Page**
   - বড় কোড ইনপুট বক্স (রেফারেন্স ইমেজের "Enter code" এর মতো)
   - কোড ভেরিফাই অ্যানিমেশন
9. **Pre-Quiz Instructions Page**
   - কুইজের নিয়ম, টাইম লিমিট, মোট মার্ক, ফুলস্ক্রিন মোড এ যাওয়ার রিমাইন্ডার
   - "Start Quiz" বাটন → ফুলস্ক্রিন এ যাবে
10. **Quiz Taking Page**
    - উপরে countdown timer (রঙ পরিবর্তন হবে — শেষ ৫ মিনিটে লাল হয়ে পালস অ্যানিমেশন)
    - প্রশ্ন নেভিগেশন প্যানেল (answered/unanswered কালার কোডেড)
    - Auto-save প্রতি উত্তরে
11. **Submission Success Page**
    - Confetti/checkmark অ্যানিমেশন
12. **Result Page** (যদি টিচার allow করে)
    - Score, correct/wrong breakdown, rank

---

## ৪. Anti-Cheating (AI ও Screenshot সুরক্ষা) ফিচার

⚠️ **সততার সাথে জানিয়ে রাখা ভালো:** ব্রাউজার/ওয়েব টেকনোলজি দিয়ে স্ক্রিনশট ১০০% ব্লক করা সম্ভব না (OS-level screenshot টুল বা আরেকটা ডিভাইস দিয়ে ছবি তোলা আটকানো যায় না)। কিন্তু নিচের কম্বিনেশন দিয়ে অনেকটাই deterrence তৈরি করা যায়:

- **Fullscreen Lock:** কুইজ শুরু হলে বাধ্যতামূলক Fullscreen API, exit করলে warning + auto-pause/flag
- **Tab-switch / Window blur Detection:** `visibilitychange` event দিয়ে ট্র্যাক করে টিচারকে flag পাঠানো ("Student X switched tab ৩ বার")
- **Right-click Disable + Text Selection Disable:** `contextmenu`, `user-select: none`
- **Copy/Paste Disable:** প্রশ্নের এরিয়াতে `oncopy`, `oncut` ব্লক
- **DevTools Detection:** কনসোল ওপেন করলে ওয়ার্নিং/অটো সাবমিট
- **Print Screen Key Detection (partial):** `keydown` এ PrintScreen ক্যাচ করে ওয়ার্নিং দেখানো (ব্লক না করলেও লগ রাখা যাবে)
- **CSS Blur on Blur/Tab-out:** ট্যাব থেকে সরে গেলে কন্টেন্ট auto-blur হয়ে যাবে
- **Watermark Overlay:** স্টুডেন্টের নাম/আইডি হালকা watermark হিসেবে প্রশ্নের উপর overlay করে দেওয়া, যাতে স্ক্রিনশট নিলেও ট্রেস থাকে
- **Time-boxed per Question (optional strict mode):** প্রতি প্রশ্নে নির্দিষ্ট সময়, পিছনে ফেরা যাবে না — কপি করে AI তে পেস্ট করার সময় কমিয়ে দেয়
- **Face/Webcam Proctoring (advanced, ভবিষ্যতে যোগ করা যায়):** পিরিয়ডিক webcam snapshot, একাধিক মুখ ডিটেক্ট হলে ফ্ল্যাগ

---

## ৫. টাইমার সিস্টেম

- কুইজ-লেভেল টাইমার (পুরো কুইজের জন্য একটা কাউন্টডাউন) — ডিফল্ট
- অপশনাল: প্রশ্ন-লেভেল টাইমার (প্রতি প্রশ্নে আলাদা সময়)
- সময় শেষ হলে **auto-submit**
- UI: সার্কুলার প্রোগ্রেস রিং + সংখ্যা, শেষ ৫ মিনিটে লাল কালার + হালকা পালস অ্যানিমেশন + সাউন্ড অ্যালার্ট (mute করা যাবে)

---

## ৬. অ্যানিমেশন গাইড (কোথায় কোথায় লাগবে)

| জায়গা | অ্যানিমেশন |
|---|---|
| Login/Role toggle | Smooth slide + fade transition |
| Quiz code input | Digit-by-digit pop-in, wrong code এ shake animation |
| "Make a new test" কার্ড | Hover এ scale-up (1.03x) + shadow বাড়া |
| Notification কার্ড আসা | Slide-in from right + fade |
| Timer শেষ ৫ মিনিট | Pulse/glow animation লাল রঙে |
| প্রশ্ন পরিবর্তন | Slide/fade transition (left-to-right) |
| Answer সিলেক্ট করা | Checkmark bounce animation |
| Submit বাটন | Loading spinner → success checkmark morph |
| Submission Success পেইজ | Confetti burst + checkmark draw animation |
| Result reveal | Score counter animate (0 থেকে actual score পর্যন্ত count-up) |
| Tab-switch warning | Red banner slide-down + shake |
| Sidebar navigation | Active item এ smooth indicator slide |
| Dashboard কার্ড লোড | Staggered fade-in (একটার পর একটা) |

Recommended libraries: **Framer Motion** (React), **GSAP** (কমপ্লেক্স অ্যানিমেশন), **Lottie** (confetti/success animation), **CSS transitions** (হালকা hover effect)

---

## ৭. এক্সট্রা ফিচার আইডিয়া (ভালো লাগতে পারে এমন)

- 📊 **Analytics Dashboard:** টিচারের জন্য — কোন প্রশ্নে সবচেয়ে বেশি ভুল হয়েছে, average score, completion rate
- 🏆 **Leaderboard/Ranking** (optional, টিচার টগল করবে দেখাবে কিনা)
- 📁 **Question Bank:** টিচার প্রশ্ন সেভ করে রাখতে পারবে, পরে আবার রিইউজ করতে পারবে
- 🔀 **Question & Option Shuffle:** প্রতি স্টুডেন্টের জন্য আলাদা অর্ডার
- 📧 **Email/Notification System:** কুইজ শুরুর রিমাইন্ডার, রেজাল্ট পাবলিশ হলে নোটিফিকেশন
- 🌙 **Dark Mode**
- 📱 **Responsive Mobile View**
- 🖨️ **Export Result (PDF/Excel)**
- ⏸️ **Auto-save Draft:** নেট চলে গেলেও উত্তর হারাবে না
- 🔒 **One Device / One Session Lock:** একই কোড দিয়ে দুই জায়গা থেকে লগইন করা যাবে না
- 🗣️ **Multi-language Support** (বাংলা/English toggle)

---

## ৮. প্রস্তাবিত Tech Stack

- **Frontend:** React (Next.js) + Tailwind CSS + Framer Motion
- **Backend:** Node.js (Express) অথবা Django
- **Database:** PostgreSQL / MongoDB
- **Auth:** JWT / Firebase Auth
- **Realtime (submission tracking):** Socket.io / Firebase Realtime DB
- **Hosting:** Vercel (frontend) + Railway/Render (backend)

---

## ৯. পরবর্তী ধাপ (Suggested Roadmap)

1. Auth + Role system (Teacher/Student)
2. Quiz creation + code generation (MVP)
3. Student join + quiz-taking flow + timer
4. Anti-cheat basic layer (fullscreen, tab-switch detect)
5. Marking + result system
6. Analytics + polish + animation pass
