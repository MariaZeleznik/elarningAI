'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Question = { id: string; text: string; optionA: string; optionB: string; optionC: string; optionD: string };

interface Props {
  courseId: string;
  courseTitle: string;
  initialAttemptId: string | null;
  initialQuestions: Question[];
  initialAnswers: Record<string, string>;
}

const EXAM_DURATION_MS = 90 * 60 * 1000;

export function ExamRunner({ courseId, courseTitle, initialAttemptId, initialQuestions, initialAnswers }: Props) {
  const router = useRouter();
  const [attemptId, setAttemptId] = useState(initialAttemptId);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(!initialAttemptId);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_MS);
  const [started, setStarted] = useState(!!initialAttemptId);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const left = Math.max(0, EXAM_DURATION_MS - elapsed);
      setTimeLeft(left);
      if (left === 0) handleSubmit();
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  async function startExam() {
    setLoading(true);
    try {
      const res = await fetch('/api/exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Błąd startu egzaminu');
      setAttemptId(data.attemptId);

      // Pobierz pytania po stronie klienta (endpoint niezalogowany nie istnieje — przekieruj przez SSR)
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Błąd startu egzaminu');
    } finally {
      setLoading(false);
    }
  }

  const handleAnswer = useCallback(
    async (option: string) => {
      if (!attemptId) return;
      const q = questions[current];
      const newAnswers = { ...answers, [q.id]: option };
      setAnswers(newAnswers);
      // Autozapis — fire and forget
      fetch('/api/exam/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, questionId: q.id, answer: option }),
      }).catch(() => {});
    },
    [attemptId, questions, current, answers],
  );

  async function handleSubmit() {
    if (submitting || !attemptId) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Błąd wysyłania');
      router.push(
        data.passed
          ? `/certyfikat/${data.certificateId}?new=1`
          : `/egzamin/${courseId}/wynik?score=${data.score}&passed=0`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Błąd wysyłania egzaminu');
      setSubmitting(false);
    }
  }

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const timeWarning = timeLeft < 5 * 60 * 1000;

  // Ekran powitalny
  if (!started || !attemptId) {
    return (
      <div className="min-h-screen bg-brand-gray flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 max-w-lg w-full shadow-lg text-center">
          <h1 className="font-heading font-bold text-2xl text-brand-navy mb-2">Egzamin certyfikacyjny</h1>
          <p className="text-brand-muted mb-6">{courseTitle}</p>
          <ul className="text-left text-sm text-brand-dark space-y-2 mb-8 bg-brand-gray rounded-xl p-4">
            <li className="flex items-start gap-2"><span>📋</span><span>60 pytań jednokrotnego wyboru</span></li>
            <li className="flex items-start gap-2"><span>⏱️</span><span>90 minut czasu</span></li>
            <li className="flex items-start gap-2"><span>✅</span><span>Wymagane 70% poprawnych odpowiedzi (42/60)</span></li>
            <li className="flex items-start gap-2"><span>💾</span><span>Odpowiedzi zapisywane automatycznie</span></li>
            <li className="flex items-start gap-2"><span>📜</span><span>Certyfikat wystawiany natychmiast po zdaniu</span></li>
          </ul>
          <Button
            onClick={async () => { await startExam(); setStarted(true); startRef.current = Date.now(); }}
            loading={loading}
            className="w-full py-3 text-base"
          >
            Rozpocznij egzamin →
          </Button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  if (!q) return null;
  const answered = Object.keys(answers).length;
  const options = [
    { key: 'A', text: q.optionA },
    { key: 'B', text: q.optionB },
    { key: 'C', text: q.optionC },
    { key: 'D', text: q.optionD },
  ] as const;

  return (
    <div className="min-h-screen bg-brand-gray flex flex-col">
      {/* Header z timerem */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-brand-muted">
            Pytanie <span className="font-bold text-brand-navy">{current + 1}</span> / {questions.length}
          </div>
          <div className={`flex items-center gap-1.5 font-mono text-base font-bold ${timeWarning ? 'text-red-600' : 'text-brand-navy'}`}>
            <Clock size={16} />
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-sm text-brand-muted">
            Odpowiedziano: <span className="font-bold text-brand-navy">{answered}</span>/{questions.length}
          </div>
        </div>
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-brand-teal transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Pytanie */}
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-8">
        <p className="font-heading font-semibold text-lg text-brand-navy mb-6 leading-relaxed">{q.text}</p>

        <div className="space-y-3 mb-8">
          {options.map(({ key, text }) => {
            const selected = answers[q.id] === key;
            return (
              <button
                key={key}
                onClick={() => handleAnswer(key)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all min-h-[44px] font-medium ${
                  selected
                    ? 'border-brand-teal bg-brand-teal/10 text-brand-navy'
                    : 'border-gray-200 bg-white hover:border-brand-teal/50 text-brand-dark'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold mr-3 ${selected ? 'bg-brand-teal text-white' : 'bg-gray-100 text-brand-muted'}`}>
                  {key}
                </span>
                {text}
              </button>
            );
          })}
        </div>

        {/* Nawigacja */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            <ChevronLeft size={16} className="mr-1" /> Poprzednie
          </Button>

          {current < questions.length - 1 ? (
            <Button onClick={() => setCurrent((c) => c + 1)}>
              Następne <ChevronRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                const unanswered = questions.length - answered;
                if (unanswered > 0 && !confirm(`${unanswered} pytań bez odpowiedzi. Zakończyć egzamin?`)) return;
                handleSubmit();
              }}
              loading={submitting}
              className="bg-brand-gold hover:bg-amber-600 text-brand-navy"
            >
              <Send size={16} className="mr-2" /> Zakończ egzamin
            </Button>
          )}
        </div>

        {/* Siatka pytań do nawigacji */}
        <div className="mt-10">
          <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-3 flex items-center gap-2">
            <AlertTriangle size={12} />
            Przegląd odpowiedzi
          </h3>
          <div className="grid grid-cols-10 gap-1.5">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-8 rounded text-xs font-bold transition-colors ${
                  idx === current
                    ? 'bg-brand-navy text-white'
                    : answers[questions[idx].id]
                    ? 'bg-brand-teal/20 text-brand-teal'
                    : 'bg-white border border-gray-200 text-brand-muted hover:border-brand-teal/50'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
