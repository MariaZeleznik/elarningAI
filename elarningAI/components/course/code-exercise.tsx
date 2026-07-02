'use client';
import { useState } from 'react';
import { CheckCircle, XCircle, Code, Eye } from 'lucide-react';

interface Props {
  prompt: string;
  expected: string;
  hint?: string;
  language?: string;
}

function normalize(code: string): string {
  return code
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n')
    .replace(/ {2,}/g, ' ');
}

export function CodeExercise({ prompt, expected, hint, language = 'python' }: Props) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  function check() {
    const isCorrect = normalize(value) === normalize(expected);
    setResult(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) setAttempts((a) => a + 1);
  }

  function reset() {
    setValue('');
    setResult('idle');
    setShowAnswer(false);
  }

  const borderClass =
    result === 'correct'
      ? 'border-green-500 ring-1 ring-green-400'
      : result === 'wrong'
      ? 'border-red-400 ring-1 ring-red-300'
      : 'border-gray-700 focus-within:border-brand-teal focus-within:ring-1 focus-within:ring-brand-teal';

  return (
    <div className="not-prose my-8 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 bg-[#161b22] border-b border-gray-700 px-4 py-2.5">
        <Code size={14} className="text-brand-teal" />
        <span className="text-sm font-semibold text-gray-200">Ćwiczenie</span>
        <span className="ml-auto text-xs text-gray-500 font-mono">{language}</span>
      </div>

      <div className="bg-white p-5">
        <p className="text-sm text-brand-dark leading-relaxed mb-4">{prompt}</p>

        <div className={`rounded-lg border transition-all ${borderClass}`}>
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setResult('idle');
            }}
            disabled={result === 'correct'}
            rows={Math.max(3, expected.split('\n').length + 1)}
            className="w-full font-mono text-sm p-4 rounded-lg bg-[#0d1117] text-[#e2e8f0] resize-y focus:outline-none placeholder-gray-600 border-0"
            placeholder={`# Wpisz kod ${language} tutaj...`}
            spellCheck={false}
          />
        </div>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <button
            onClick={check}
            disabled={!value.trim() || result === 'correct'}
            className="bg-brand-teal hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Sprawdź →
          </button>

          {result !== 'idle' && (
            <button
              onClick={reset}
              className="text-sm text-brand-muted hover:text-brand-dark transition-colors"
            >
              Resetuj
            </button>
          )}

          {attempts >= 2 && result === 'wrong' && !showAnswer && (
            <button
              onClick={() => setShowAnswer(true)}
              className="ml-auto flex items-center gap-1.5 text-sm text-amber-500 hover:text-amber-600 transition-colors"
            >
              <Eye size={14} /> Pokaż odpowiedź
            </button>
          )}
        </div>

        {result === 'correct' && (
          <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-semibold bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
            <CheckCircle size={16} />
            Poprawnie! Świetna robota.
          </div>
        )}

        {result === 'wrong' && (
          <div className="mt-4 flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            <XCircle size={16} className="mt-0.5 shrink-0" />
            <span>
              Nie całkiem — spróbuj jeszcze raz.
              {hint && <span className="text-brand-muted ml-1">Wskazówka: {hint}</span>}
            </span>
          </div>
        )}

        {showAnswer && (
          <div className="mt-4 rounded-lg bg-[#0d1117] border border-gray-700 p-4">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Poprawna odpowiedź</p>
            <pre className="text-sm text-[#e2e8f0] font-mono whitespace-pre-wrap leading-relaxed">{expected}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
