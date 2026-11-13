/**
 * Post-deployment smoke test: checks that a running instance answers correctly.
 *
 * Usage: npm run smoke -- https://football-stats-ghmj.onrender.com
 *        (defaults to http://localhost:3001)
 *
 * Exits with code 1 if any check fails, so it can run in CI.
 */
const baseUrl = (process.argv[2] || process.env.SMOKE_URL || 'http://localhost:3001').replace(
  /\/$/,
  '',
);

// Free Render instances sleep when idle; the first request can take about a minute
const TIMEOUT_MS = 90_000;

const checks = [
  {
    name: 'Health check answers ok',
    path: '/api/health',
    verify: (res, body) => res.status === 200 && body.status === 'ok',
  },
  {
    name: 'Zones endpoint returns 24 zones for passes',
    path: '/api/zones?metric=passes&cols=6&rows=4',
    verify: (res, body) => res.status === 200 && body.zones?.length === 24,
  },
  {
    name: 'Invalid metric is rejected with 400 INVALID_METRIC',
    path: '/api/zones?metric=nope',
    verify: (res, body) => res.status === 400 && body.error?.code === 'INVALID_METRIC',
  },
  {
    name: 'Home page serves the React app',
    path: '/',
    verify: (res, body) => res.status === 200 && String(body).includes('<div id="root">'),
  },
];

let failures = 0;
console.log(`Smoke testing ${baseUrl}\n`);

for (const check of checks) {
  try {
    const res = await fetch(`${baseUrl}${check.path}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    const isJson = res.headers.get('content-type')?.includes('application/json');
    const body = isJson ? await res.json() : await res.text();
    const ok = check.verify(res, body);
    if (!ok) failures += 1;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${check.name} (HTTP ${res.status})`);
  } catch (error) {
    failures += 1;
    console.log(`FAIL  ${check.name} (${error.message})`);
  }
}

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
