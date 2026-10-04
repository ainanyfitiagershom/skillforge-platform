import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '60s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:8090';
const EMAIL = __ENV.K6_EMAIL || 'k6.recruteur@skillforge.local';
const PASSWORD = __ENV.K6_PASSWORD || 'PasswordK6Demo123!';

export function setup() {
  const headers = { 'Content-Type': 'application/json' };

  http.post(
    `${BASE_URL}/auth/register`,
    JSON.stringify({ email: EMAIL, password: PASSWORD, role: 'RECRUTEUR' }),
    { headers }
  );

  const login = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: EMAIL, password: PASSWORD }),
    { headers }
  );

  check(login, {
    'login ok': (r) => r.status === 200 && Boolean(r.json('accessToken')),
  });

  return { token: login.json('accessToken') };
}

export default function (data) {
  const authHeaders = {
    Authorization: `Bearer ${data.token}`,
    Accept: 'application/json',
  };

  const responses = http.batch([
    ['GET', `${BASE_URL}/actuator/health`, null, { headers: { Accept: 'application/json' } }],
    ['GET', `${BASE_URL}/analytics/kpis`, null, { headers: authHeaders }],
    ['GET', `${BASE_URL}/analytics/scores-distribution`, null, { headers: authHeaders }],
    ['GET', `${BASE_URL}/analytics/questions-stats`, null, { headers: authHeaders }],
    ['GET', `${BASE_URL}/analytics/skills-avg`, null, { headers: authHeaders }],
    ['GET', `${BASE_URL}/analytics/recent-candidates`, null, { headers: authHeaders }],
  ]);

  check(responses[0], { 'health 200': (r) => r.status === 200 });
  for (let i = 1; i < responses.length; i += 1) {
    check(responses[i], { 'analytics 200': (r) => r.status === 200 });
  }

  sleep(1);
}
