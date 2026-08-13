"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Shuffle, MinusCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useAppStore } from "@/lib/store";
import { isAnswerKeyComplete } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { useRequireRole } from "@/lib/useRequireRole";
import type { Question, QuestionType } from "@/lib/types";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function blankQuestion(type: QuestionType): Question {
  return {
    id: uid(),
    type,
    text: "",
    options: type === "mcq" ? ["", "", "", ""] : type === "true-false" ? ["True", "False"] : undefined,
    correctIndex: undefined,
    correctText: "",
    marks: 1,
  };
}

// A question needs a real answer key before it can auto-grade correctly.
function questionHasKey(q: Question) {
  if (q.type === "mcq" || q.type === "true-false") return q.correctIndex !== undefined;
  if (q.type === "fill-blank") return !!q.correctText && q.correctText.trim().length > 0;
  return true;
}

export default function CreateQuizPage() {
  useRequireRole("teacher");
  const router = useRouter();
  const createQuiz = useAppStore((s) => s.createQuiz);
  const t = useT();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(20);
  const [instructions, setInstructions] = useState(
    "Read every question carefully. Do not switch tabs during the exam. Once submitted, answers cannot be changed."
  );
  const [randomize, setRandomize] = useState(false);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [whitelist, setWhitelist] = useState("");
  const [examStart, setExamStart] = useState(""); // datetime-local string
  const [examEnd, setExamEnd] = useState(""); // datetime-local string
  const [questions, setQuestions] = useState<Question[]>([blankQuestion("mcq")]);
  const [triedPublish, setTriedPublish] = useState(false);

  const updateQuestion = (id: string, patch: Partial<Question>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const addQuestion = (type: QuestionType) =>
    setQuestions((qs) => [...qs, blankQuestion(type)]);

  const removeQuestion = (id: string) =>
    setQuestions((qs) => (qs.length > 1 ? qs.filter((q) => q.id !== id) : qs));

  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  const missingKeyCount = questions.filter((q) => !questionHasKey(q)).length;

  const canPublish =
    !!title.trim() &&
    !!subject.trim() &&
    questions.every((q) => q.text.trim() && q.marks > 0) &&
    isAnswerKeyComplete(questions);

  const handlePublish = () => {
    setTriedPublish(true);
    if (!canPublish) return;
    const quiz = createQuiz({
      title: title.trim(),
      subject: subject.trim(),
      instructions,
      durationMinutes: duration,
      randomizeOrder: randomize,
      negativeMarking,
      whitelist: whitelist
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean),
      questions,
      examStartAt: examStart ? new Date(examStart).getTime() : undefined,
      examEndAt: examEnd ? new Date(examEnd).getTime() : undefined,
    });
    router.push(`/teacher/quiz/${quiz.id}/code`);
  };

  return (
    <div className="flex min-h-screen bg-[#EEF6F6] dark:bg-[#0f171c]">
      <Sidebar />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <Topbar title={t("createQuizTitle")} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="card space-y-4 p-6">
              <h2 className="text-lg font-semibold text-ink">{t("quizDetails")}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">{t("quizTitle")}</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mid-term: Cell Biology"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">{t("subject")}</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Biology"
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">{t("duration")}</label>
                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="input-field sm:w-40"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">{t("instructions")}</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">
                  {t("questions")} <span className="text-ink-soft">({questions.length})</span>
                </h2>
                <span className="text-sm font-medium text-ink-soft">
                  {t("totalMarksLabel")}: {totalMarks} {t("marksLabel").toLowerCase()}
                </span>
              </div>

              <AnimatePresence>
                {questions.map((q, idx) => {
                  const missingKey = triedPublish && !questionHasKey(q);
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`card space-y-4 p-5 ${
                        missingKey ? "ring-2 ring-pastel-pinkText" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky/10 text-xs font-bold text-sky">
                            {idx + 1}
                          </span>
                          <select
                            value={q.type}
                            onChange={(e) =>
                              updateQuestion(q.id, {
                                type: e.target.value as QuestionType,
                                options:
                                  e.target.value === "mcq"
                                    ? ["", "", "", ""]
                                    : e.target.value === "true-false"
                                    ? ["True", "False"]
                                    : undefined,
                                correctIndex: undefined,
                                correctText: "",
                              })
                            }
                            className="rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm dark:bg-[#101A20] dark:text-white dark:border-white/10"
                          >
                            <option value="mcq">MCQ</option>
                            <option value="true-false">True / False</option>
                            <option value="short">Short answer</option>
                            <option value="fill-blank">Fill in the blank</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-ink-soft">{t("marks")}</span>
                            <input
                              type="number"
                              min={1}
                              value={q.marks}
                              onChange={(e) => updateQuestion(q.id, { marks: Number(e.target.value) })}
                              className="w-16 rounded-lg border border-ink/10 px-2 py-1.5 text-sm dark:bg-[#101A20] dark:text-white dark:border-white/10"
                            />
                          </div>
                          <button
                            onClick={() => removeQuestion(q.id)}
                            className="text-ink-faint hover:text-pastel-pinkText"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>

                      <textarea
                        value={q.text}
                        onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                        placeholder="Type the question..."
                        rows={2}
                        className="input-field resize-none"
                      />

                      {(q.type === "mcq" || q.type === "true-false") && (
                        <div className="space-y-2">
                          {q.options?.map((opt, oi) => (
                            <label
                              key={oi}
                              className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${
                                q.correctIndex === oi
                                  ? "border-sky bg-sky/5"
                                  : "border-ink/10"
                              }`}
                            >
                              <input
                                type="radio"
                                checked={q.correctIndex === oi}
                                onChange={() => updateQuestion(q.id, { correctIndex: oi })}
                              />
                              {q.type === "mcq" ? (
                                <input
                                  value={opt}
                                  onChange={(e) => {
                                    const opts = [...(q.options || [])];
                                    opts[oi] = e.target.value;
                                    updateQuestion(q.id, { options: opts });
                                  }}
                                  placeholder={`Option ${oi + 1}`}
                                  className="flex-1 bg-transparent text-sm text-ink focus:outline-none"
                                />
                              ) : (
                                <span className="text-sm text-ink">{opt}</span>
                              )}
                            </label>
                          ))}
                          {missingKey && (
                            <p className="text-xs font-medium text-pastel-pinkText">
                              {t("selectCorrectAnswer")}
                            </p>
                          )}
                        </div>
                      )}

                      {q.type === "fill-blank" && (
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-ink-soft">
                            {t("correctAnswerForGrading")}
                          </label>
                          <input
                            value={q.correctText}
                            onChange={(e) => updateQuestion(q.id, { correctText: e.target.value })}
                            placeholder="Expected answer"
                            className="input-field"
                          />
                          {missingKey && (
                            <p className="mt-1 text-xs font-medium text-pastel-pinkText">
                              {t("enterCorrectAnswer")}
                            </p>
                          )}
                        </div>
                      )}

                      {q.type === "short" && (
                        <p className="rounded-lg bg-pastel-blue px-3 py-2 text-xs text-pastel-blueText">
                          {t("shortAnswerNote")}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <div className="flex flex-wrap gap-2">
                {(["mcq", "true-false", "short", "fill-blank"] as QuestionType[]).map((tp) => (
                  <button
                    key={tp}
                    onClick={() => addQuestion(tp)}
                    className="btn-secondary text-sm"
                  >
                    <Plus size={15} />{" "}
                    {tp === "mcq"
                      ? "MCQ"
                      : tp === "true-false"
                      ? "True/False"
                      : tp === "short"
                      ? "Short answer"
                      : "Fill in blank"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card space-y-5 p-6">
              <h2 className="text-lg font-semibold text-ink">{t("options")}</h2>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-ink">
                  <Shuffle size={16} className="text-sky" /> {t("randomizeOrder")}
                </div>
                <input
                  type="checkbox"
                  checked={randomize}
                  onChange={(e) => setRandomize(e.target.checked)}
                  className="h-5 w-5 accent-sky"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-ink">
                  <MinusCircle size={16} className="text-pastel-pinkText" /> {t("negativeMarking")}
                </div>
                <input
                  type="checkbox"
                  checked={negativeMarking}
                  onChange={(e) => setNegativeMarking(e.target.checked)}
                  className="h-5 w-5 accent-sky"
                />
              </div>

              <div className="space-y-3 border-t border-ink/5 pt-4">
                <p className="text-sm font-medium text-ink">{t("examWindowLabel")}</p>
                <p className="text-xs text-ink-soft">{t("examWindowDesc")}</p>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-soft">
                    {t("examStartLabel")}
                  </label>
                  <input
                    type="datetime-local"
                    value={examStart}
                    onChange={(e) => setExamStart(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-soft">
                    {t("examEndLabel")}
                  </label>
                  <input
                    type="datetime-local"
                    value={examEnd}
                    onChange={(e) => setExamEnd(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div className="border-t border-ink/5 pt-4">
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  {t("whitelistLabel")}
                </label>
                <textarea
                  value={whitelist}
                  onChange={(e) => setWhitelist(e.target.value)}
                  placeholder={t("whitelistPlaceholder")}
                  rows={3}
                  className="input-field resize-none text-sm"
                />
              </div>
            </div>

            <button onClick={handlePublish} className="btn-primary w-full">
              {t("generateCode")}
            </button>
            <p
              className={`text-center text-xs ${
                triedPublish && !canPublish
                  ? "font-medium text-pastel-pinkText"
                  : "text-ink-faint"
              }`}
            >
              {t("publishHint")}
              {triedPublish && missingKeyCount > 0
                ? ` (${missingKeyCount})`
                : ""}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
