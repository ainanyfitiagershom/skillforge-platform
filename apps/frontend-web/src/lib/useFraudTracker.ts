import { useCallback, useEffect, useRef, useState } from 'react';
import { api, FraudEventType } from '@/lib/api';

const PASTE_THRESHOLD = 200;
const FAST_ANSWER_MS = 5000;
const FAST_ANSWER_MIN_LENGTH = 300;
const FOCUS_DEDUP_MS = 500;
const TYPE_THROTTLE_MS = 3000;
const DEVTOOLS_HEIGHT_DIFF = 160;

export type FraudSignal = {
  type: FraudEventType;
  at: number;
};

export type FraudTracker = {
  lastSignal: FraudSignal | null;
  signalFastAnswer: (questionId: string, elapsedMs: number, answerLength: number) => void;
};

/** Installe les listeners anti-fraude cote candidat, envoie les events au backend, expose signaux. */
export function useFraudTracker(passationId: string | null, enabled: boolean): FraudTracker {
  const [lastSignal, setLastSignal] = useState<FraudSignal | null>(null);

  const lastByType = useRef<Partial<Record<FraudEventType, number>>>({});
  const focusLostAt = useRef<number | null>(null);
  const focusEventPendingUntil = useRef<number>(0);
  const devtoolsFired = useRef(false);

  const emit = useCallback(
    (type: FraudEventType, metadata: Record<string, unknown> = {}) => {
      if (!passationId) return;
      const now = Date.now();
      const previous = lastByType.current[type] ?? 0;
      if (now - previous < TYPE_THROTTLE_MS) return;
      lastByType.current[type] = now;

      void api.reportFraudEvent(passationId, type, metadata);
      setLastSignal({ type, at: now });
    },
    [passationId],
  );

  const signalFastAnswer = useCallback(
    (questionId: string, elapsedMs: number, answerLength: number) => {
      if (elapsedMs < FAST_ANSWER_MS && answerLength >= FAST_ANSWER_MIN_LENGTH) {
        emit('FAST_ANSWER', { questionId, elapsedMs, answerLength });
      }
    },
    [emit],
  );

  useEffect(() => {
    if (!enabled || !passationId) return;

    const handleVisibility = () => {
      const now = Date.now();
      if (document.hidden) {
        focusLostAt.current = now;
      } else if (focusLostAt.current != null) {
        const durationMs = now - focusLostAt.current;
        focusLostAt.current = null;
        focusEventPendingUntil.current = now + FOCUS_DEDUP_MS;
        if (durationMs > 1000) {
          emit('FOCUS_LOSS', { durationMs });
        }
      }
    };

    const handleWindowBlur = () => {
      if (!document.hidden) focusLostAt.current = Date.now();
    };

    const handleWindowFocus = () => {
      const now = Date.now();
      if (now < focusEventPendingUntil.current) return;
      if (focusLostAt.current == null) return;
      const durationMs = now - focusLostAt.current;
      focusLostAt.current = null;
      if (durationMs > 1000) {
        emit('FOCUS_LOSS', { durationMs });
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text') ?? '';
      if (text.length > PASTE_THRESHOLD) {
        emit('PASTE_SUSPICIOUS', { pastedLength: text.length });
      }
    };

    const checkDevtools = () => {
      if (devtoolsFired.current) return;
      const heightDiff = window.outerHeight - window.innerHeight;
      const widthDiff = window.outerWidth - window.innerWidth;
      if (heightDiff > DEVTOOLS_HEIGHT_DIFF || widthDiff > DEVTOOLS_HEIGHT_DIFF) {
        devtoolsFired.current = true;
        emit('DEVTOOLS_OPEN', { heightDiff, widthDiff });
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('paste', handlePaste, true);
    const devtoolsInterval = window.setInterval(checkDevtools, 2000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('paste', handlePaste, true);
      window.clearInterval(devtoolsInterval);
    };
  }, [enabled, passationId, emit]);

  return { lastSignal, signalFastAnswer };
}
