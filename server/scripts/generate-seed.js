/**
 * Seed data generator (US-2 / FSB-6).
 *
 * Builds a demo dataset for the 20 clubs of the 2026 Brasileirão Série A:
 * teams, fictional players, a 5-round fixture list and every on-ball event
 * (pass, shot, tackle, touch) with pitch coordinates.
 *
 * The clubs are real; the PLAYERS AND ALL NUMBERS ARE SIMULATED. Each player's
 * actions are scattered around a position-based "home area" (a left-back's
 * passes cluster on the left flank, a striker's shots inside the box), so the
 * zone maps look realistic without claiming to be real statistics.
 *
 * The random generator uses a fixed seed, so running this script always writes
 * byte-for-byte identical files. Tests rely on that.
 *
 * Usage: npm run seed -w server
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SEED = 20260128;
export const ROUNDS = 5;
const FIRST_MATCH_DATE = Date.UTC(2026, 0, 28); // Round 1 of the 2026 season (approximate)

/** The 20 Série A clubs of 2026, with colours used to draw their badges. */
export const TEAMS = [
  {
    id: 'atletico-mg',
    name: 'Atlético Mineiro',
    shortName: 'Atlético-MG',
    code: 'CAM',
    primary: '#000000',
    secondary: '#ffffff',
  },
  {
    id: 'athletico-pr',
    name: 'Athletico Paranaense',
    shortName: 'Athletico-PR',
    code: 'CAP',
    primary: '#c8102e',
    secondary: '#000000',
  },
  {
    id: 'bahia',
    name: 'Bahia',
    shortName: 'Bahia',
    code: 'BAH',
    primary: '#0050a0',
    secondary: '#ffffff',
  },
  {
    id: 'botafogo',
    name: 'Botafogo',
    shortName: 'Botafogo',
    code: 'BOT',
    primary: '#1a1a1a',
    secondary: '#ffffff',
  },
  {
    id: 'bragantino',
    name: 'Red Bull Bragantino',
    shortName: 'Bragantino',
    code: 'RBB',
    primary: '#ffffff',
    secondary: '#d2001f',
  },
  {
    id: 'chapecoense',
    name: 'Chapecoense',
    shortName: 'Chapecoense',
    code: 'CHA',
    primary: '#00843d',
    secondary: '#ffffff',
  },
  {
    id: 'corinthians',
    name: 'Corinthians',
    shortName: 'Corinthians',
    code: 'COR',
    primary: '#ffffff',
    secondary: '#000000',
  },
  {
    id: 'coritiba',
    name: 'Coritiba',
    shortName: 'Coritiba',
    code: 'CFC',
    primary: '#006837',
    secondary: '#ffffff',
  },
  {
    id: 'cruzeiro',
    name: 'Cruzeiro',
    shortName: 'Cruzeiro',
    code: 'CRU',
    primary: '#0033a0',
    secondary: '#ffffff',
  },
  {
    id: 'flamengo',
    name: 'Flamengo',
    shortName: 'Flamengo',
    code: 'FLA',
    primary: '#c8102e',
    secondary: '#000000',
  },
  {
    id: 'fluminense',
    name: 'Fluminense',
    shortName: 'Fluminense',
    code: 'FLU',
    primary: '#7a1e3b',
    secondary: '#ffffff',
  },
  {
    id: 'gremio',
    name: 'Grêmio',
    shortName: 'Grêmio',
    code: 'GRE',
    primary: '#0d80bf',
    secondary: '#000000',
  },
  {
    id: 'internacional',
    name: 'Internacional',
    shortName: 'Internacional',
    code: 'INT',
    primary: '#e30613',
    secondary: '#ffffff',
  },
  {
    id: 'mirassol',
    name: 'Mirassol',
    shortName: 'Mirassol',
    code: 'MIR',
    primary: '#ffd200',
    secondary: '#00843d',
  },
  {
    id: 'palmeiras',
    name: 'Palmeiras',
    shortName: 'Palmeiras',
    code: 'PAL',
    primary: '#006437',
    secondary: '#ffffff',
  },
  {
    id: 'remo',
    name: 'Remo',
    shortName: 'Remo',
    code: 'REM',
    primary: '#0b1f4b',
    secondary: '#ffffff',
  },
  {
    id: 'santos',
    name: 'Santos',
    shortName: 'Santos',
    code: 'SAN',
    primary: '#ffffff',
    secondary: '#000000',
  },
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    shortName: 'São Paulo',
    code: 'SAO',
    primary: '#e30613',
    secondary: '#ffffff',
  },
  {
    id: 'vasco',
    name: 'Vasco da Gama',
    shortName: 'Vasco',
    code: 'VAS',
    primary: '#000000',
    secondary: '#ffffff',
  },
  {
    id: 'vitoria',
    name: 'Vitória',
    shortName: 'Vitória',
    code: 'VIT',
    primary: '#d50000',
    secondary: '#000000',
  },
];

const FIRST_NAMES = [
  'Lucas',
  'Gabriel',
  'Matheus',
  'Pedro',
  'Rafael',
  'Thiago',
  'Felipe',
  'Bruno',
  'Caio',
  'Vitor',
  'João',
  'Diego',
  'Rodrigo',
  'Gustavo',
  'Leonardo',
  'André',
  'Henrique',
  'Igor',
  'Kaio',
  'Wesley',
  'Renan',
  'Marcos',
  'Paulo',
  'Daniel',
  'Ruan',
  'Davi',
  'Arthur',
  'Enzo',
  'Murilo',
  'Yuri',
  'Breno',
  'Luan',
  'Alan',
  'Emerson',
  'Fábio',
  'Hugo',
  'Ítalo',
  'Jean',
  'Kauã',
  'Otávio',
];
const SURNAMES = [
  'Silva',
  'Souza',
  'Oliveira',
  'Santos',
  'Pereira',
  'Costa',
  'Rodrigues',
  'Almeida',
  'Nascimento',
  'Lima',
  'Araújo',
  'Fernandes',
  'Carvalho',
  'Gomes',
  'Martins',
  'Rocha',
  'Ribeiro',
  'Alves',
  'Monteiro',
  'Mendes',
  'Barros',
  'Freitas',
  'Barbosa',
  'Pinto',
  'Moura',
  'Cavalcanti',
  'Dias',
  'Castro',
  'Campos',
  'Cardoso',
  'Teixeira',
  'Moreira',
  'Vieira',
  'Correia',
  'Nunes',
  'Machado',
  'Batista',
  'Lopes',
  'Ramos',
  'Farias',
];

/**
 * Squad template: 11 starters + 3 substitutes. Each role has
 *  - position: the broad group used by filters (GK/DEF/MID/FWD)
 *  - x, y: centre of the player's home area (0-100, attacking left to right; y = 0 is the left touchline)
 *  - sx, sy: how far the actions spread around that centre
 *  - rates: average actions per full match
 *  - minutes: share of the match played (substitutes play less)
 */
const ROLES = [
  {
    role: 'GK',
    position: 'GK',
    x: 7,
    y: 50,
    sx: 4,
    sy: 9,
    rates: { pass: 26, touch: 6, tackle: 0.1, shot: 0 },
  },
  {
    role: 'CB',
    position: 'DEF',
    x: 24,
    y: 34,
    sx: 9,
    sy: 10,
    rates: { pass: 46, touch: 10, tackle: 2.2, shot: 0.3 },
  },
  {
    role: 'CB',
    position: 'DEF',
    x: 24,
    y: 66,
    sx: 9,
    sy: 10,
    rates: { pass: 46, touch: 10, tackle: 2.2, shot: 0.3 },
  },
  {
    role: 'LB',
    position: 'DEF',
    x: 42,
    y: 11,
    sx: 18,
    sy: 7,
    rates: { pass: 38, touch: 18, tackle: 2.4, shot: 0.4 },
  },
  {
    role: 'RB',
    position: 'DEF',
    x: 42,
    y: 89,
    sx: 18,
    sy: 7,
    rates: { pass: 38, touch: 18, tackle: 2.4, shot: 0.4 },
  },
  {
    role: 'DM',
    position: 'MID',
    x: 40,
    y: 50,
    sx: 12,
    sy: 14,
    rates: { pass: 52, touch: 14, tackle: 3.2, shot: 0.6 },
  },
  {
    role: 'CM',
    position: 'MID',
    x: 54,
    y: 36,
    sx: 14,
    sy: 14,
    rates: { pass: 45, touch: 18, tackle: 2.0, shot: 1.1 },
  },
  {
    role: 'AM',
    position: 'MID',
    x: 68,
    y: 52,
    sx: 12,
    sy: 16,
    rates: { pass: 36, touch: 22, tackle: 1.0, shot: 1.9 },
  },
  {
    role: 'LW',
    position: 'FWD',
    x: 72,
    y: 14,
    sx: 15,
    sy: 9,
    rates: { pass: 25, touch: 26, tackle: 0.8, shot: 2.1 },
  },
  {
    role: 'RW',
    position: 'FWD',
    x: 72,
    y: 86,
    sx: 15,
    sy: 9,
    rates: { pass: 25, touch: 26, tackle: 0.8, shot: 2.1 },
  },
  {
    role: 'ST',
    position: 'FWD',
    x: 83,
    y: 50,
    sx: 9,
    sy: 12,
    rates: { pass: 16, touch: 18, tackle: 0.5, shot: 3.2 },
  },
  {
    role: 'CM',
    position: 'MID',
    x: 54,
    y: 64,
    sx: 14,
    sy: 14,
    rates: { pass: 45, touch: 18, tackle: 2.0, shot: 1.1 },
    minutes: 0.35,
  },
  {
    role: 'CB',
    position: 'DEF',
    x: 24,
    y: 50,
    sx: 9,
    sy: 12,
    rates: { pass: 46, touch: 10, tackle: 2.2, shot: 0.3 },
    minutes: 0.3,
  },
  {
    role: 'ST',
    position: 'FWD',
    x: 83,
    y: 50,
    sx: 9,
    sy: 12,
    rates: { pass: 16, touch: 18, tackle: 0.5, shot: 3.2 },
    minutes: 0.35,
  },
];

/** Mulberry32: tiny, fast, seedable pseudo-random generator returning floats in [0, 1). */
export function createRandom(seed) {
  let a = seed >>> 0;
  return function random() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Normally distributed number (Box-Muller transform). */
function gaussian(random, mean, sd) {
  const u = 1 - random();
  const v = random();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Poisson-distributed count with the given average (Knuth's method; fine for small means). */
function poisson(random, mean) {
  if (mean <= 0) return 0;
  const limit = Math.exp(-mean);
  let k = 0;
  let p = 1;
  do {
    k += 1;
    p *= random();
  } while (p > limit);
  return k - 1;
}

/** Counts above ~30 are faster and accurate enough with a normal approximation. */
function countFor(random, mean) {
  return mean > 30
    ? Math.max(0, Math.round(gaussian(random, mean, Math.sqrt(mean))))
    : poisson(random, mean);
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const round1 = (value) => Math.round(value * 10) / 10;

/** Builds 14 fictional players per club, with unique names across the league. */
function buildPlayers(random) {
  const used = new Set();
  const players = [];

  for (const team of TEAMS) {
    ROLES.forEach((template, index) => {
      let name;
      do {
        name = `${FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)]} ${
          SURNAMES[Math.floor(random() * SURNAMES.length)]
        }`;
      } while (used.has(name));
      used.add(name);

      players.push({
        id: `${team.id}-${String(index + 1).padStart(2, '0')}`,
        name,
        teamId: team.id,
        position: template.position,
        role: template.role,
      });
    });
  }
  return players;
}

/**
 * Round-robin fixtures with the "circle method": team 0 stays fixed while the
 * others rotate one place per round, so every team plays exactly once per round.
 */
function buildMatches() {
  const ids = TEAMS.map((team) => team.id);
  const matches = [];
  let rotating = ids.slice(1);

  for (let round = 1; round <= ROUNDS; round += 1) {
    const lineup = [ids[0], ...rotating];
    const date = new Date(FIRST_MATCH_DATE + (round - 1) * 7 * 86400000).toISOString().slice(0, 10);

    for (let i = 0; i < lineup.length / 2; i += 1) {
      const a = lineup[i];
      const b = lineup[lineup.length - 1 - i];
      // Alternate home and away between rounds
      const [homeTeamId, awayTeamId] = (round + i) % 2 === 0 ? [a, b] : [b, a];
      matches.push({ id: matches.length + 1, round, date, homeTeamId, awayTeamId });
    }
    rotating = [rotating.at(-1), ...rotating.slice(0, -1)];
  }
  return matches;
}

/** Where on the pitch one action happens, based on the player's role and the action type. */
function placeEvent(random, template, type) {
  let x = gaussian(random, template.x, template.sx);
  let y = gaussian(random, template.y, template.sy);

  if (type === 'shot') {
    // Shots come from the attacking third, pulled towards the centre of the goal
    x = gaussian(random, 86, 6);
    y = gaussian(random, 50 + (template.y - 50) * 0.35, 11);
  } else if (type === 'tackle') {
    // Players defend slightly deeper than they attack
    x -= 10;
  }
  return { x: round1(clamp(x, 0, 100)), y: round1(clamp(y, 0, 100)) };
}

/** Did the action succeed? Passes get harder further up the pitch. */
function successOf(random, type, x) {
  if (type === 'pass') return random() < 0.93 - x / 400 ? 1 : 0;
  if (type === 'shot') return random() < 0.35 ? 1 : 0; // on target
  if (type === 'tackle') return random() < 0.62 ? 1 : 0; // won the ball
  return 1; // touches always "succeed"
}

/** Generates the whole dataset in memory. Same seed → same output. */
export function generateSeed(seed = SEED) {
  const random = createRandom(seed);
  const players = buildPlayers(random);
  const matches = buildMatches();

  // Some clubs and players are simply busier than others, which creates clear zone leaders
  const teamForm = new Map(TEAMS.map((team) => [team.id, 0.85 + random() * 0.3]));
  const playerForm = new Map(players.map((player) => [player.id, 0.7 + random() * 0.65]));
  const rows = [];

  for (const match of matches) {
    for (const teamId of [match.homeTeamId, match.awayTeamId]) {
      players
        .filter((player) => player.teamId === teamId)
        .forEach((player, index) => {
          const template = ROLES[index];
          const factor = (template.minutes ?? 1) * teamForm.get(teamId) * playerForm.get(player.id);

          for (const type of ['pass', 'touch', 'tackle', 'shot']) {
            const count = countFor(random, template.rates[type] * factor);
            for (let n = 0; n < count; n += 1) {
              const { x, y } = placeEvent(random, template, type);
              rows.push([match.id, player.id, type, x, y, successOf(random, type, x)]);
            }
          }
        });
    }
  }

  return {
    teams: TEAMS,
    players,
    matches,
    events: { columns: ['matchId', 'playerId', 'type', 'x', 'y', 'success'], rows },
  };
}

/** JSON with one event row per line: compact, but still readable in diffs. */
function eventsToJson(events) {
  const rows = events.rows.map((row) => `    ${JSON.stringify(row)}`).join(',\n');
  return `{\n  "columns": ${JSON.stringify(events.columns)},\n  "rows": [\n${rows}\n  ]\n}\n`;
}

/** Writes the dataset to server/data/seed/. */
export function writeSeed(outDir) {
  const data = generateSeed();
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'teams.json'), `${JSON.stringify(data.teams, null, 2)}\n`);
  writeFileSync(join(outDir, 'players.json'), `${JSON.stringify(data.players, null, 2)}\n`);
  writeFileSync(join(outDir, 'matches.json'), `${JSON.stringify(data.matches, null, 2)}\n`);
  writeFileSync(join(outDir, 'events.json'), eventsToJson(data.events));
  return data;
}

// Run only when executed directly (node scripts/generate-seed.js), not when imported by tests
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'seed');
  const data = writeSeed(outDir);
  console.log(
    `Wrote ${data.teams.length} teams, ${data.players.length} players, ` +
      `${data.matches.length} matches and ${data.events.rows.length} events to ${outDir}`,
  );
}
