// Client API leger pour parler au backend Spring Boot.
// En dev, les requetes vers /api/* sont proxyfees vers http://localhost:8090 (cf. vite.config.ts).

const STORAGE_KEY = 'skillforge.tokens';

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export function saveTokens(tokens: TokenPair) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function loadTokens(): TokenPair | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TokenPair;
  } catch {
    return null;
  }
}

export function clearTokens() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getRoleFromAccessToken(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role ?? null;
  } catch {
    return null;
  }
}

type FetchInit = Omit<RequestInit, 'body'> & { body?: unknown; auth?: boolean };

async function request<T>(path: string, init: FetchInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (init.auth !== false) {
    const tokens = loadTokens();
    if (tokens?.accessToken) {
      headers.set('Authorization', `Bearer ${tokens.accessToken}`);
    }
  }

  const res = await fetch(`/api${path}`, {
    ...init,
    headers,
    body:
      init.body instanceof FormData
        ? init.body
        : init.body
          ? JSON.stringify(init.body)
          : undefined,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const json = await res.json();
      detail = json.message ?? JSON.stringify(json);
    } catch {
      /* pas de body JSON */
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// ---- Endpoints ----

export const api = {
  login: (email: string, password: string) =>
    request<TokenPair>('/auth/login', { method: 'POST', body: { email, password }, auth: false }),

  register: (email: string, password: string, role: string) =>
    request<{ id: string; email: string; role: string }>('/auth/register', {
      method: 'POST',
      body: { email, password, role },
      auth: false,
    }),

  uploadCv: (file: File, candidateEmail: string, candidateDisplayName: string, profileCode: string) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('candidateEmail', candidateEmail);
    fd.append('candidateDisplayName', candidateDisplayName);
    fd.append('profileCode', profileCode);
    return request<CvUploadResponse>('/cv/upload', { method: 'POST', body: fd });
  },

  generateQuestions: (req: GenerateRequest) =>
    request<GenerateResponse>('/tests/generate', { method: 'POST', body: req }),

  reviewByCandidate: () =>
    request<CandidateGroup[]>('/review/by-candidate'),

  updateQuestion: (id: string, body: QuestionUpdate) =>
    request<Question>(`/questions/${id}`, { method: 'PUT', body }),

  deleteQuestion: (id: string) =>
    request<void>(`/questions/${id}`, { method: 'DELETE' }),

  composeTest: (name: string, durationMinutes: number, orderedQuestionIds: string[]) =>
    request<{ id: string; name: string; durationMinutes: number }>('/tests', {
      method: 'POST',
      body: { name, durationMinutes, orderedQuestionIds },
    }),

  inviteCandidate: (testId: string) =>
    request<{ id: string; token: string; expiresAt: string }>(`/tests/${testId}/invite`, {
      method: 'POST',
    }),

  listPassations: () =>
    request<PassationSummary[]>('/passations'),

  getPassationDetail: (passationId: string) =>
    request<PassationDetail>(`/passations/${passationId}`),

  getReport: (passationId: string) =>
    request<ReportView | null>(`/passations/${passationId}/report`).catch((err) => {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }),

  regenerateReport: (passationId: string) =>
    request<ReportView>(`/passations/${passationId}/report/regenerate`, { method: 'POST' }),

  // ---------- Candidat (endpoints publics) ----------

  candidateResolveInvitation: (token: string) =>
    request<CandidateInvitation>(`/invitations/${token}`, { auth: false }),

  candidateStartPassation: (
    token: string,
    candidateEmail: string,
    candidateDisplayName: string,
  ) =>
    request<CandidatePassation>('/candidate/passations/start', {
      method: 'POST',
      auth: false,
      body: { token, candidateEmail, candidateDisplayName },
    }),

  candidateSaveTextAnswer: (passationId: string, questionId: string, answerText: string) =>
    request<void>(`/candidate/passations/${passationId}/answer-text`, {
      method: 'POST',
      auth: false,
      body: { questionId, answerText },
    }),

  candidateRunCode: (
    passationId: string,
    questionId: string,
    language: 'PHP' | 'JS',
    userCode: string,
  ) =>
    request<RunCodeResult>(`/candidate/passations/${passationId}/run-code`, {
      method: 'POST',
      auth: false,
      body: { questionId, language, userCode },
    }),

  candidateSubmit: (passationId: string) =>
    request<CandidatePassation>(`/candidate/passations/${passationId}/submit`, {
      method: 'POST',
      auth: false,
    }),

  candidateGetState: (passationId: string) =>
    request<CandidatePassationState>(`/candidate/passations/${passationId}/state`, {
      auth: false,
    }),

  reportFraudEvent: (
    passationId: string,
    eventType: FraudEventType,
    metadata: Record<string, unknown> = {},
  ) =>
    request<void>(`/candidate/passations/${passationId}/fraud-event`, {
      method: 'POST',
      auth: false,
      body: { eventType, metadata: JSON.stringify(metadata) },
    }).catch(() => {
      /* silent : ne jamais bloquer la passation candidat */
    }),

  getAnalyticsKpis: () =>
    request<AnalyticsKpis>('/analytics/kpis'),

  getScoresDistribution: () =>
    request<ScoreBucket[]>('/analytics/scores-distribution'),

  getQuestionsStats: () =>
    request<QuestionStats[]>('/analytics/questions-stats'),

  getSkillsAvg: () =>
    request<SkillAverage[]>('/analytics/skills-avg'),

  getRecentCandidates: () =>
    request<RecentCandidate[]>('/analytics/recent-candidates'),

  fetchCandidatesCsv: () => fetchBlob('/analytics/export/candidates.csv'),

  fetchQuestionsStatsCsv: () => fetchBlob('/analytics/export/questions-stats.csv'),
};

async function fetchBlob(path: string): Promise<Blob> {
  const tokens = loadTokens();
  const headers = new Headers();
  if (tokens?.accessToken) {
    headers.set('Authorization', `Bearer ${tokens.accessToken}`);
  }
  const res = await fetch(`/api${path}`, { headers });
  if (!res.ok) {
    throw new ApiError(res.status, res.statusText);
  }
  return res.blob();
}

// ---------- Types candidat ----------

export type CandidateQuestionView = {
  id: string;
  type: QuestionType;
  statement: string;
  difficulty: number;
  publicPayload: string;
};

export type CandidateInvitation = {
  testId: string;
  questions: CandidateQuestionView[];
};

export type ScoreBreakdownView = {
  qcmPassed: number;
  qcmTotal: number;
  codePassed: number;
  codeTotal: number;
  casPassed: number;
  casTotal: number;
};

export type CandidatePassation = {
  id: string;
  invitationId: string;
  candidateId: string;
  startedAt: string;
  submittedAt: string | null;
  globalScore: number | string | null;
  fraudRiskScore: number;
  scoreBreakdown: ScoreBreakdownView | null;
};

export type CandidateAnswerSnapshot = {
  questionId: string;
  answerText: string | null;
  submittedCode: string | null;
  qcmSelectedIndex: number | null;
  lastTestsPassed: number | null;
  lastTestsTotal: number | null;
  lastStdout: string | null;
  lastStderr: string | null;
  score: number | string | null;
};

export type CandidatePassationState = {
  id: string;
  startedAt: string;
  submittedAt: string | null;
  answers: CandidateAnswerSnapshot[];
};

export type RunCodeResult = {
  status: 'OK' | 'TIMEOUT' | 'OOM' | 'ERROR' | 'SECURITY_VIOLATION';
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  testsPassed: number;
  testsTotal: number;
  score: number;
};

// ---- Types partages avec le backend ----

export type ExtractedSkill = {
  skillCode: string;
  displayName: string;
  level: 'JUNIOR' | 'CONFIRME' | 'SENIOR' | 'UNKNOWN';
  yearsOfExperience: number | null;
};

export type CvUploadResponse = {
  candidateId: string;
  cvId: string;
  analysisId: string;
  skills: ExtractedSkill[];
  llmProvider: string;
  tokensUsed: number;
  costEur: string;
  ocrFallbackRecommended: boolean;
};

export type QuestionType = 'QCM' | 'CODE' | 'CAS_PRATIQUE';
export type QuestionStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';

export type Question = {
  id: string;
  type: QuestionType;
  statement: string;
  difficulty: number;
  status: QuestionStatus;
  version?: number;
  jsonPayload: string;
};

export type QuestionUpdate = {
  type: QuestionType;
  statement: string;
  difficulty: number;
  jsonPayload: string;
  status?: QuestionStatus;
};

export type GenerateRequest = {
  candidateId?: string;
  profileCode: string;
  skillCodes: string[];
  types: { type: QuestionType; count: number }[];
  difficulty: number;
};

export type GenerateResponse = {
  questions: Question[];
  testId: string | null;
  llmProvider: string;
  llmModel: string;
  tokensUsed: number;
  costEur: string;
};

export type ReviewQuestion = {
  id: string;
  type: QuestionType;
  statement: string;
  difficulty: number;
  status: QuestionStatus;
  version: number;
  jsonPayload: string;
  position: number;
};

export type CandidateGroup = {
  testId: string;
  testName: string;
  profileCode: string;
  testCreatedAt: string;
  candidateId: string;
  candidateEmail: string;
  candidateName: string | null;
  questions: ReviewQuestion[];
};

export type PassationSummary = {
  passationId: string;
  startedAt: string;
  submittedAt: string | null;
  globalScore: number | string | null;
  fraudRiskScore: number;
  candidateId: string;
  candidateEmail: string;
  candidateName: string | null;
  testId: string;
  testName: string;
  profileCode: string;
  testCreatedAt: string;
};

export type AnswerDetail = {
  id: string | null;
  questionId: string;
  type: QuestionType;
  statement: string;
  difficulty: number;
  jsonPayload: string;
  position: number;
  answerText: string | null;
  submittedCode: string | null;
  score: number | string | null;
  qcmSelectedIndex: number | null;
  lastTestsPassed: number | null;
  lastTestsTotal: number | null;
  lastStdout: string | null;
  lastStderr: string | null;
  gradingExplanation: string | null;
};

export type FraudEventType =
  | 'FOCUS_LOSS'
  | 'PASTE_SUSPICIOUS'
  | 'FAST_ANSWER'
  | 'DEVTOOLS_OPEN';

export type FraudEventView = {
  id: string;
  eventType: FraudEventType;
  occurredAt: string;
  /** JSON serialise en string : { durationMs?, pastedLength?, questionId?, elapsedMs?, answerLength? } */
  metadata: string | null;
};

export type PassationDetail = {
  passationId: string;
  startedAt: string;
  submittedAt: string | null;
  globalScore: number | string | null;
  fraudRiskScore: number;
  candidateId: string;
  candidateEmail: string;
  candidateName: string | null;
  testId: string;
  testName: string;
  profileCode: string;
  testCreatedAt: string;
  answers: AnswerDetail[];
  fraudEvents: FraudEventView[];
};

export type Recommendation = 'HIRE' | 'INTERVIEW' | 'REJECT';

export type ReportView = {
  id: string;
  passationId: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: Recommendation;
  generatedAt: string;
  llmProvider: string | null;
  llmModel: string | null;
  tokensUsed: number;
  costEur: number | string;
};

// ============ Analytics (Tache 5 Sprint 6) ============

export type AnalyticsKpis = {
  totalCandidates: number;
  submittedPassations: number;
  totalPassations: number;
  avgGlobalScore: number | string | null;
  approvedQuestions: number;
  reportsGenerated: number;
  avgFraudScore: number | string | null;
  highFraudCount: number;
};

export type ScoreBucket = {
  min: number;
  max: number;
  count: number;
};

export type QuestionQualityLabel =
  | 'GOOD'
  | 'TOO_EASY'
  | 'TOO_HARD'
  | 'POOR_DISCRIMINANT'
  | 'INSUFFICIENT_DATA';

export type QuestionStats = {
  id: string;
  type: QuestionType;
  statement: string;
  difficulty: number;
  usages: number;
  difficultyIndex: number | string | null;
  avgScore: number | string | null;
  discriminantPower: number | string | null;
  qualityLabel: QuestionQualityLabel;
};

export type SkillAverage = {
  code: string;
  displayName: string;
  category: string;
  avgScore: number | string | null;
  candidateCount: number;
};

export type RecentCandidate = {
  passationId: string;
  submittedAt: string | null;
  candidateName: string | null;
  candidateEmail: string;
  profileCode: string;
  globalScore: number | string | null;
  recommendation: Recommendation | null;
  fraudRiskScore: number;
};
