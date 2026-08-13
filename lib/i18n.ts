"use client";

import { useAppStore } from "./store";
import type { Language } from "./types";

// Central dictionary for every UI string the app translates.
// Add new keys here — both "en" and "bn" must be provided together.
export const dictionary = {
  // Landing / auth
  appName: { en: "Quizzy", bn: "কুইজি" },
  appTagline: { en: "Online Quiz & Exam Platform", bn: "অনলাইন কুইজ ও পরীক্ষা প্ল্যাটফর্ম" },
  welcomeQuestion: { en: "Welcome — who are you?", bn: "স্বাগতম — আপনি কে?" },
  pickRole: { en: "Pick a role, then sign in or create an account.", bn: "আপনার ভূমিকা বেছে নিন, তারপর লগইন করুন বা অ্যাকাউন্ট তৈরি করুন।" },
  student: { en: "Student", bn: "শিক্ষার্থী" },
  teacher: { en: "Teacher", bn: "শিক্ষক" },
  login: { en: "Log in", bn: "লগ ইন" },
  register: { en: "Create account", bn: "অ্যাকাউন্ট তৈরি করুন" },
  yourName: { en: "Your name", bn: "আপনার নাম" },
  email: { en: "Username", bn: "ইউজারনেম" },
  username: { en: "Username", bn: "ইউজারনেম" },
  password: { en: "Password", bn: "পাসওয়ার্ড" },
  rememberMe: { en: "Remember my username & password on this device", bn: "এই ডিভাইসে আমার ইউজারনেম ও পাসওয়ার্ড মনে রাখুন" },
  continueAs: { en: "Continue as", bn: "চালিয়ে যান হিসেবে" },
  noAccount: { en: "Don't have an account?", bn: "অ্যাকাউন্ট নেই?" },
  haveAccount: { en: "Already have an account?", bn: "আগে থেকেই অ্যাকাউন্ট আছে?" },
  createOne: { en: "Create one", bn: "তৈরি করুন" },
  logInInstead: { en: "Log in instead", bn: "বরং লগ ইন করুন" },
  demoNote: {
    en: "Your account and data stay in this browser.",
    bn: "আপনার অ্যাকাউন্ট ও ডেটা এই ব্রাউজারেই থাকে।",
  },

  // Sidebar / nav
  navHome: { en: "Home", bn: "হোম" },
  navTests: { en: "Tests", bn: "টেস্ট" },
  navProfile: { en: "Profile", bn: "প্রোফাইল" },
  navSettings: { en: "Settings", bn: "সেটিংস" },
  navExit: { en: "Exit", bn: "প্রস্থান" },

  // Topbar
  welcomeBack: { en: "Welcome back", bn: "আবার স্বাগতম" },
  searchPlaceholder: { en: "Search tests, students...", bn: "টেস্ট, শিক্ষার্থী খুঁজুন..." },

  // Settings
  settingsTitle: { en: "Settings", bn: "সেটিংস" },
  darkMode: { en: "Dark mode", bn: "ডার্ক মোড" },
  darkModeDesc: { en: "Switch the interface to a dark theme.", bn: "ইন্টারফেস ডার্ক থিমে পরিবর্তন করুন।" },
  langToggleLabel: { en: "বাংলা / English", bn: "বাংলা / English" },
  langToggleDesc: { en: "Toggle interface language.", bn: "ইন্টারফেসের ভাষা পরিবর্তন করুন।" },
  timerSound: { en: "Timer sound alerts", bn: "টাইমার শব্দ সতর্কতা" },
  timerSoundDesc: { en: "Play a sound in the last 5 minutes.", bn: "শেষ ৫ মিনিটে একটি শব্দ বাজান।" },
  webcamProctor: { en: "Webcam proctoring (beta)", bn: "ওয়েবক্যাম প্রক্টরিং (বেটা)" },
  webcamProctorDesc: {
    en: "Periodic snapshots during exams — flags multiple faces.",
    bn: "পরীক্ষার সময় পর্যায়ক্রমিক স্ন্যাপশট — একাধিক মুখ শনাক্ত হলে ফ্ল্যাগ করে।",
  },

  // Teacher dashboard
  teacherDashboard: { en: "Teacher Dashboard", bn: "শিক্ষক ড্যাশবোর্ড" },
  makeNewTest: { en: "Make a new test", bn: "নতুন টেস্ট তৈরি করুন" },
  blankTest: { en: "Blank Test", bn: "খালি টেস্ট" },
  blankTestDesc: { en: "Start from scratch", bn: "শুরু থেকে শুরু করুন" },
  mcqTest: { en: "MCQ Test", bn: "এমসিকিউ টেস্ট" },
  mcqTestDesc: { en: "Multiple choice", bn: "বহুনির্বাচনী" },
  fillTest: { en: "Fill in the Blank", bn: "ফাঁকা পূরণ করুন" },
  fillTestDesc: { en: "Text-based answers", bn: "লিখিত উত্তর" },
  currentlyHappening: { en: "Currently happening", bn: "এখন চলছে" },
  noLiveQuizzes: { en: "No live quizzes yet. Create one above to get started.", bn: "এখনো কোনো লাইভ কুইজ নেই। শুরু করতে উপরে একটি তৈরি করুন।" },
  notifications: { en: "Notifications", bn: "নোটিফিকেশন" },
  noNotifications: {
    en: "Nothing new yet — submission and result alerts appear here.",
    bn: "এখনো নতুন কিছু নেই — জমা ও ফলাফলের বার্তা এখানে দেখা যাবে।",
  },

  // Quiz create
  createQuizTitle: { en: "Create Quiz", bn: "কুইজ তৈরি করুন" },
  quizDetails: { en: "Quiz details", bn: "কুইজের বিবরণ" },
  quizTitle: { en: "Quiz title", bn: "কুইজের শিরোনাম" },
  subject: { en: "Subject", bn: "বিষয়" },
  duration: { en: "Duration (minutes)", bn: "সময়কাল (মিনিট)" },
  instructions: { en: "Instructions", bn: "নির্দেশনা" },
  questions: { en: "Questions", bn: "প্রশ্ন" },
  totalMarksLabel: { en: "Total", bn: "মোট" },
  marks: { en: "Marks", bn: "নম্বর" },
  correctAnswerForGrading: { en: "Correct answer (for auto-grading)", bn: "সঠিক উত্তর (স্বয়ংক্রিয় মূল্যায়নের জন্য)" },
  shortAnswerNote: { en: "This question will need manual marking after students submit.", bn: "শিক্ষার্থীরা জমা দেওয়ার পর এই প্রশ্নটি হাতে নম্বর দিতে হবে।" },
  selectCorrectAnswer: { en: "⚠ Select the correct option below before publishing.", bn: "⚠ প্রকাশ করার আগে নিচে সঠিক উত্তরটি নির্বাচন করুন।" },
  enterCorrectAnswer: { en: "⚠ Enter the correct answer before publishing.", bn: "⚠ প্রকাশ করার আগে সঠিক উত্তরটি লিখুন।" },
  options: { en: "Options", bn: "অপশন" },
  randomizeOrder: { en: "Randomize order", bn: "ক্রম এলোমেলো করুন" },
  negativeMarking: { en: "Negative marking", bn: "নেগেটিভ মার্কিং" },
  whitelistLabel: { en: "Whitelist emails/IDs", bn: "অনুমোদিত ইমেইল/আইডি" },
  whitelistPlaceholder: {
    en: "Comma-separated — leave blank to allow anyone with the code",
    bn: "কমা দিয়ে আলাদা করুন — কোড থাকলে সবাইকে দিতে খালি রাখুন",
  },
  generateCode: { en: "Generate quiz code", bn: "কুইজ কোড তৈরি করুন" },
  publishHint: {
    en: "Fill in the title, subject, all question text, and set the correct answer for every auto-graded question.",
    bn: "শিরোনাম, বিষয়, সব প্রশ্নের লেখা পূরণ করুন এবং প্রতিটি স্বয়ংক্রিয়-মূল্যায়ন প্রশ্নের সঠিক উত্তর নির্ধারণ করুন।",
  },

  // Quiz code page
  quizCodeTitle: { en: "Quiz Code", bn: "কুইজ কোড" },
  quizReadyShare: { en: "is ready. Share this code with your students:", bn: "প্রস্তুত। শিক্ষার্থীদের সাথে এই কোডটি শেয়ার করুন:" },
  copyCode: { en: "Copy code", bn: "কোড কপি করুন" },
  copied: { en: "Copied!", bn: "কপি হয়েছে!" },
  scanToJoin: { en: "Scan to join", bn: "যোগ দিতে স্ক্যান করুন" },
  totalMarks: { en: "Total marks", bn: "মোট নম্বর" },
  restrictedTo: { en: "Restricted to", bn: "সীমিত" },
  whitelistedStudents: { en: "whitelisted student(s).", bn: "জন অনুমোদিত শিক্ষার্থীর জন্য।" },
  goToSubmissions: { en: "Go to submissions", bn: "জমাগুলোতে যান" },

  // Submissions
  submissionsTitle: { en: "Submissions", bn: "জমা" },
  studentsSubmitted: { en: "student(s) submitted", bn: "জন শিক্ষার্থী জমা দিয়েছে" },
  goToResults: { en: "Go to results", bn: "ফলাফলে যান" },
  noSubmissionsYet: { en: "No submissions yet. Share the quiz code", bn: "এখনো কোনো জমা নেই। কুইজ কোডটি শেয়ার করুন" },
  submitted: { en: "Submitted", bn: "জমা দেওয়া হয়েছে" },
  tabSwitch: { en: "tab switch", bn: "ট্যাব পরিবর্তন" },
  allAutoGraded: { en: "All questions were auto-graded — MCQ, true/false, and fill-in-the-blank.", bn: "সব প্রশ্ন স্বয়ংক্রিয়ভাবে মূল্যায়ন হয়েছে — এমসিকিউ, সত্য/মিথ্যা এবং ফাঁকা পূরণ।" },
  manualMarking: { en: "Manual marking", bn: "নিজে নম্বর দিন" },
  answerLabel: { en: "Answer", bn: "উত্তর" },
  noAnswer: { en: "No answer", bn: "কোনো উত্তর নেই" },
  marksOutOf: { en: "Marks (out of", bn: "নম্বর (এর মধ্যে" },

  // Results
  resultsTitle: { en: "Results", bn: "ফলাফল" },
  publishResults: { en: "Publish results", bn: "ফলাফল প্রকাশ করুন" },
  resultsPublished: { en: "Results published", bn: "ফলাফল প্রকাশিত হয়েছে" },
  publishResultsDesc: {
    en: "Students can't see their result until you publish.",
    bn: "আপনি প্রকাশ না করা পর্যন্ত শিক্ষার্থীরা তাদের ফলাফল দেখতে পারবে না।",
  },
  exportCsv: { en: "Export CSV", bn: "সিএসভি এক্সপোর্ট করুন" },
  leaderboard: { en: "Leaderboard", bn: "লিডারবোর্ড" },
  noSubmissionsToRank: { en: "No submissions to rank yet.", bn: "র‍্যাঙ্ক করার মতো এখনো কোনো জমা নেই।" },
  rank: { en: "Rank", bn: "র‍্যাঙ্ক" },
  studentLabel: { en: "Student", bn: "শিক্ষার্থী" },
  score: { en: "Score", bn: "স্কোর" },
  tabSwitches: { en: "Tab switches", bn: "ট্যাব পরিবর্তন" },

  // Tests list
  allTests: { en: "All Tests", bn: "সব টেস্ট" },
  testsCount: { en: "test(s)", bn: "টি টেস্ট" },
  newTest: { en: "New test", bn: "নতুন টেস্ট" },
  noTestsYet: { en: "You haven't created any tests yet.", bn: "আপনি এখনো কোনো টেস্ট তৈরি করেননি।" },

  // Profile
  profileTitle: { en: "Profile", bn: "প্রোফাইল" },
  instructorAdmin: { en: "Instructor / Admin", bn: "প্রশিক্ষক / অ্যাডমিন" },
  testsCreated: { en: "Tests created", bn: "তৈরি করা টেস্ট" },
  totalSubmissionsReceived: { en: "Total submissions received", bn: "মোট প্রাপ্ত জমা" },

  // Student join / instructions / take / success / result
  enterQuizCode: { en: "Enter quiz code", bn: "কুইজ কোড লিখুন" },
  askTeacherCode: { en: "ask your teacher for the 6-character code.", bn: "৬ অক্ষরের কোডের জন্য আপনার শিক্ষকের কাছে জিজ্ঞাসা করুন।" },
  codeNotFound: { en: "Code not found. Double-check and try again.", bn: "কোড খুঁজে পাওয়া যায়নি। আবার চেষ্টা করুন।" },
  joinQuiz: { en: "Join quiz", bn: "কুইজে যোগ দিন" },
  verifying: { en: "Verifying...", bn: "যাচাই করা হচ্ছে..." },
  alreadyAttempted: {
    en: "You've already taken this quiz. Each quiz can only be attempted once.",
    bn: "আপনি ইতিমধ্যে এই কুইজটি দিয়েছেন। প্রতিটি কুইজ শুধুমাত্র একবার দেওয়া যায়।",
  },
  viewMyResult: { en: "View my result", bn: "আমার ফলাফল দেখুন" },
  durationLabel: { en: "Duration", bn: "সময়কাল" },
  questionsLabel: { en: "Questions", bn: "প্রশ্ন" },
  marksLabel: { en: "Marks", bn: "নম্বর" },
  fullscreenWarning: {
    en: "This exam will open in fullscreen mode. Switching tabs or exiting fullscreen will be flagged and reported to your teacher. Copy/paste and right-click are disabled during the test.",
    bn: "এই পরীক্ষাটি ফুলস্ক্রিন মোডে খুলবে। ট্যাব পরিবর্তন বা ফুলস্ক্রিন থেকে বের হলে তা চিহ্নিত হয়ে আপনার শিক্ষককে জানানো হবে। পরীক্ষার সময় কপি/পেস্ট এবং রাইট-ক্লিক নিষ্ক্রিয় থাকবে।",
  },
  startQuizFullscreen: { en: "Start quiz (fullscreen)", bn: "কুইজ শুরু করুন (ফুলস্ক্রিন)" },
  submittedSuccess: { en: "Submitted successfully!", bn: "সফলভাবে জমা দেওয়া হয়েছে!" },
  answersRecorded: { en: "have been recorded.", bn: "রেকর্ড করা হয়েছে।" },
  joinAnotherQuiz: { en: "Join another quiz", bn: "আরেকটি কুইজে যোগ দিন" },
  resultNotPublished: { en: "Result not published yet", bn: "ফলাফল এখনো প্রকাশিত হয়নি" },
  resultNotPublishedDesc: {
    en: "Your teacher hasn't published results yet. Check back later.",
    bn: "আপনার শিক্ষক এখনো ফলাফল প্রকাশ করেননি। পরে আবার দেখুন।",
  },
  yourScore: { en: "Your score", bn: "আপনার স্কোর" },
  stillGrading: {
    en: "Some short-answer questions are still being graded — this score may update.",
    bn: "কিছু সংক্ষিপ্ত উত্তরের প্রশ্ন এখনো মূল্যায়ন হচ্ছে — এই স্কোর পরিবর্তিত হতে পারে।",
  },
  manuallyGraded: { en: "Manually graded", bn: "হাতে মূল্যায়িত" },
  question: { en: "Question", bn: "প্রশ্ন" },
  of: { en: "of", bn: "এর মধ্যে" },
  answered: { en: "answered", bn: "উত্তর দেওয়া হয়েছে" },
  previous: { en: "Previous", bn: "পূর্ববর্তী" },
  next: { en: "Next", bn: "পরবর্তী" },
  submitQuiz: { en: "Submit quiz", bn: "কুইজ জমা দিন" },
  yourAnswer: { en: "Your answer...", bn: "আপনার উত্তর..." },
  writeAnswer: { en: "Write your answer...", bn: "আপনার উত্তর লিখুন..." },
  quizNotFound: { en: "Quiz not found.", bn: "কুইজ খুঁজে পাওয়া যায়নি।" },
  noResultYet: { en: "No result available yet.", bn: "এখনো কোনো ফলাফল নেই।" },

  // Notification messages
  notifSubmission: { en: "submitted", bn: "জমা দিয়েছে" },
  notifResultPublished: {
    en: "Your result for",
    bn: "আপনার ফলাফল",
  },
  notifResultPublishedTail: { en: "has been published.", bn: "প্রকাশিত হয়েছে।" },

  // Student sidebar
  navJoinExam: { en: "Join Exam", bn: "পরীক্ষায় যোগ দিন" },
  navMyResults: { en: "My Results", bn: "আমার ফলাফল" },

  // Profile photo
  profilePhoto: { en: "Profile photo", bn: "প্রোফাইল ছবি" },
  addPhoto: { en: "Add photo", bn: "ছবি যোগ করুন" },
  changePhoto: { en: "Change photo", bn: "ছবি পরিবর্তন করুন" },
  photoUpdated: { en: "Photo updated", bn: "ছবি পরিবর্তন হয়েছে" },

  // Exam window
  examWindowLabel: { en: "Exam window", bn: "পরীক্ষার সময়সীমা" },
  examWindowDesc: {
    en: "Students can only join and attempt during this window. Leave blank for no restriction.",
    bn: "শিক্ষার্থীরা শুধুমাত্র এই সময়সীমার মধ্যেই যোগ দিয়ে পরীক্ষা দিতে পারবে। কোনো সীমা না চাইলে খালি রাখুন।",
  },
  examStartLabel: { en: "Opens at", bn: "শুরু হবে" },
  examEndLabel: { en: "Closes at", bn: "শেষ হবে" },
  noExamWindow: { en: "No time restriction — open anytime", bn: "কোনো সময় সীমা নেই — যেকোনো সময় দেওয়া যাবে" },
  extendTime: { en: "Extend time", bn: "সময় বাড়ান" },
  extendTimeDesc: { en: "Push the closing time later so students can still join.", bn: "শেষ সময় পিছিয়ে দিন যাতে শিক্ষার্থীরা আরও সময় পায়।" },
  newClosingTime: { en: "New closing time", bn: "নতুন শেষ সময়" },
  extendAction: { en: "Extend", bn: "বাড়ান" },
  extended: { en: "Extended!", bn: "বাড়ানো হয়েছে!" },
  examNotStartedYet: { en: "This exam hasn't opened yet.", bn: "এই পরীক্ষাটি এখনো শুরু হয়নি।" },
  examWindowEndedMsg: { en: "This exam's time window has ended.", bn: "এই পরীক্ষার সময়সীমা শেষ হয়ে গেছে।" },
  opensAtLabel: { en: "Opens", bn: "শুরু" },
  closesAtLabel: { en: "Closes", bn: "শেষ" },
  examOpenBadge: { en: "Open now", bn: "এখন চলছে" },

  // Search
  searchStudentsPlaceholder: { en: "Search by name or username...", bn: "নাম বা ইউজারনেম দিয়ে খুঁজুন..." },
  searchTestsPlaceholder: { en: "Search tests...", bn: "টেস্ট খুঁজুন..." },
  searchResultsPlaceholder: { en: "Search your results...", bn: "আপনার ফলাফল খুঁজুন..." },
  noMatchingResults: { en: "Nothing matches your search.", bn: "আপনার অনুসন্ধানের সাথে কিছু মেলেনি।" },

  // Teacher quiz overview / khata (answer sheet)
  quizOverviewTitle: { en: "Test overview", bn: "টেস্টের বিবরণ" },
  viewDetails: { en: "Details", bn: "বিস্তারিত" },
  backToTests: { en: "Back to all tests", bn: "সব টেস্টে ফিরুন" },
  answerKeyLabel: { en: "Answer key", bn: "উত্তরমালা" },
  manuallyMarked: { en: "Manually marked", bn: "হাতে মূল্যায়িত" },
  viewAnswerSheet: { en: "View answer sheet", bn: "উত্তরপত্র দেখুন" },
  closeAnswerSheet: { en: "Close", bn: "বন্ধ করুন" },
  fullAnswerSheetTitle: { en: "Answer sheet", bn: "উত্তরপত্র" },
  correctBadge: { en: "Correct", bn: "সঠিক" },
  incorrectBadge: { en: "Incorrect", bn: "ভুল" },
  ungradedBadge: { en: "Not graded yet", bn: "এখনো মূল্যায়ন হয়নি" },

  // Student results section
  myResultsTitle: { en: "My Results", bn: "আমার ফলাফল" },
  attemptedOn: { en: "Attempted on", bn: "দেওয়া হয়েছে" },
  awaitingPublish: { en: "Awaiting publish", bn: "প্রকাশের অপেক্ষায়" },
  noAttemptsYet: {
    en: "You haven't taken any quiz yet — join one from the Join Exam section.",
    bn: "আপনি এখনো কোনো কুইজ দেননি — \"পরীক্ষায় যোগ দিন\" থেকে একটি কুইজে যোগ দিন।",
  },
  joinNewExam: { en: "Join a new exam", bn: "নতুন পরীক্ষায় যোগ দিন" },

  // Student profile
  studentProfileTitle: { en: "Profile", bn: "প্রোফাইল" },
  quizzesTaken: { en: "Quizzes taken", bn: "দেওয়া কুইজ" },
  averageScorePct: { en: "Average score", bn: "গড় স্কোর" },
} as const;

export type DictionaryKey = keyof typeof dictionary;

export function translate(key: DictionaryKey, lang: Language): string {
  const entry = dictionary[key];
  return entry ? entry[lang] : String(key);
}

// Subscribes to the store's language so components re-render on toggle.
export function useT() {
  const lang = useAppStore((s) => s.language);
  return (key: DictionaryKey) => translate(key, lang);
}
