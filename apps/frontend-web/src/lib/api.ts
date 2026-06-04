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
  profileCode: string;
  skillCodes: string[];
  types: { type: QuestionType; count: number }[];
  difficulty: number;
};

export type GenerateResponse = {
  questions: Question[];
  llmProvider: string;
  llmModel: string;
  tokensUsed: number;
  costEur: string;
};
