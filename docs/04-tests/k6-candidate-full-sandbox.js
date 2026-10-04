import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '60s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<6000'],
    checks: ['rate>0.99'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:8090';
const RUN_ID = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
const PASSWORD = 'PasswordK6Full123!';

const jsonHeaders = { 'Content-Type': 'application/json', Accept: 'application/json' };

function postJson(url, body, headers = jsonHeaders) {
  return http.post(url, JSON.stringify(body), { headers });
}

export function setup() {
  const recruiterEmail = `k6.full.${RUN_ID}@skillforge.local`;

  postJson(`${BASE_URL}/auth/register`, {
    email: recruiterEmail,
    password: PASSWORD,
    role: 'RECRUTEUR',
  });

  const login = postJson(`${BASE_URL}/auth/login`, {
    email: recruiterEmail,
    password: PASSWORD,
  });

  check(login, {
    'setup login recruteur ok': (r) => r.status === 200 && Boolean(r.json('accessToken')),
  });

  const token = login.json('accessToken');
  const authHeaders = {
    ...jsonHeaders,
    Authorization: `Bearer ${token}`,
  };

  const qcmPayload = {
    options: [
      'Fusionner directement sans revue',
      'Ouvrir une pull request avec revue et checks automatiques',
      'Copier les fichiers a la main',
      'Desactiver les tests',
    ],
    correctIndex: 1,
    explanation: 'La pull request avec checks automatiques limite les regressions.',
  };

  const codePayload = {
    language: 'PHP',
    starterCode:
      "<?php\nfunction solve(int $n): int {\n    // TODO\n    return 0;\n}\n",
    hiddenTests:
      "<?php\nuse PHPUnit\\Framework\\TestCase;\nrequire_once __DIR__ . '/solution.php';\n\nfinal class HiddenTest extends TestCase {\n    public function testPositiveNumber(): void { $this->assertSame(42, solve(21)); }\n    public function testZero(): void { $this->assertSame(0, solve(0)); }\n    public function testNegativeNumber(): void { $this->assertSame(-10, solve(-5)); }\n}\n",
    explanation: 'Retourner $n * 2.',
  };

  const qcm = postJson(
    `${BASE_URL}/questions`,
    {
      type: 'QCM',
      statement: `[k6 ${RUN_ID}] Quelle pratique limite les regressions avant fusion ?`,
      difficulty: 3,
      status: 'APPROVED',
      jsonPayload: JSON.stringify(qcmPayload),
    },
    authHeaders
  );

  const code = postJson(
    `${BASE_URL}/questions`,
    {
      type: 'CODE',
      statement: `[k6 ${RUN_ID}] Implementer solve(int $n): int qui retourne le double.`,
      difficulty: 3,
      status: 'APPROVED',
      jsonPayload: JSON.stringify(codePayload),
    },
    authHeaders
  );

  check(qcm, { 'setup creation QCM ok': (r) => r.status === 201 && Boolean(r.json('id')) });
  check(code, { 'setup creation CODE ok': (r) => r.status === 201 && Boolean(r.json('id')) });

  const test = postJson(
    `${BASE_URL}/tests`,
    {
      name: `k6 full candidate sandbox ${RUN_ID}`,
      durationMinutes: 30,
      orderedQuestionIds: [qcm.json('id'), code.json('id')],
    },
    authHeaders
  );

  check(test, { 'setup creation test ok': (r) => r.status === 201 && Boolean(r.json('id')) });

  return {
    recruiterToken: token,
    testId: test.json('id'),
    qcmQuestionId: qcm.json('id'),
    codeQuestionId: code.json('id'),
  };
}

export default function (data) {
  const authHeaders = {
    ...jsonHeaders,
    Authorization: `Bearer ${data.recruiterToken}`,
  };

  const invite = http.post(`${BASE_URL}/tests/${data.testId}/invite`, null, {
    headers: authHeaders,
  });
  const token = invite.json('token');
  const accessCode = invite.json('accessCode');

  check(invite, {
    'invitation creee': (r) => r.status === 201 && Boolean(token) && Boolean(accessCode),
  });

  const publicInvitation = http.get(`${BASE_URL}/invitations/${token}`, {
    headers: { Accept: 'application/json' },
  });
  check(publicInvitation, {
    'invitation publique resolue': (r) => r.status === 200 && r.json('questions').length === 2,
  });

  const candidateEmail = `candidate.${__VU}.${__ITER}.${RUN_ID}@skillforge.local`;
  const start = postJson(`${BASE_URL}/candidate/passations/start`, {
    token,
    candidateEmail,
    candidateDisplayName: `Candidat k6 ${__VU}-${__ITER}`,
    accessCode,
  });
  const passationId = start.json('id');

  check(start, {
    'passation demarree': (r) => r.status === 200 && Boolean(passationId),
  });

  const qcmAnswer = postJson(`${BASE_URL}/candidate/passations/${passationId}/answer-text`, {
    questionId: data.qcmQuestionId,
    answerText: '1',
  });
  check(qcmAnswer, { 'qcm sauvegarde': (r) => r.status === 204 });

  const runCode = postJson(`${BASE_URL}/candidate/passations/${passationId}/run-code`, {
    questionId: data.codeQuestionId,
    language: 'PHP',
    userCode: "<?php\nfunction solve(int $n): int {\n    return $n * 2;\n}\n",
  });

  check(runCode, {
    'sandbox execute ok': (r) => r.status === 200 && r.json('status') === 'OK',
    'sandbox score 100': (r) => r.status === 200 && Number(r.json('score')) === 1,
  });

  const submit = http.post(`${BASE_URL}/candidate/passations/${passationId}/submit`, null, {
    headers: jsonHeaders,
  });

  check(submit, {
    'passation soumise': (r) => r.status === 200 && Number(r.json('globalScore')) >= 99,
  });

  sleep(1);
}
