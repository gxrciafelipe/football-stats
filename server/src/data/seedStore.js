import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

/** Default location of the generated seed files (see scripts/generate-seed.js). */
export const DEFAULT_SEED_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'data',
  'seed',
);

export const EVENT_TYPES = ['pass', 'shot', 'tackle', 'touch'];
export const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'];

const hexColour = z.string().regex(/^#[0-9a-f]{6}$/i);

// Schemas describe exactly what a valid seed file looks like. Anything else stops the server
// at start-up with a clear message, instead of failing later in the middle of a request.
const teamSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().min(1),
  code: z.string().length(3),
  primary: hexColour,
  secondary: hexColour,
});

const playerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  teamId: z.string().min(1),
  position: z.enum(POSITIONS),
  role: z.string().min(1),
});

const matchSchema = z.object({
  id: z.number().int().positive(),
  round: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  homeTeamId: z.string().min(1),
  awayTeamId: z.string().min(1),
});

const coordinate = z.number().min(0).max(100);
const eventsSchema = z.object({
  columns: z.tuple([
    z.literal('matchId'),
    z.literal('playerId'),
    z.literal('type'),
    z.literal('x'),
    z.literal('y'),
    z.literal('success'),
  ]),
  rows: z.array(
    z.tuple([
      z.number().int().positive(),
      z.string().min(1),
      z.enum(EVENT_TYPES),
      coordinate,
      coordinate,
      z.union([z.literal(0), z.literal(1)]),
    ]),
  ),
});

function readJson(dir, file) {
  return JSON.parse(readFileSync(join(dir, file), 'utf8'));
}

/** Validates one file and rewrites zod's error into a readable start-up message. */
function parse(schema, data, file) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new Error(`Seed data invalid in ${file} at "${issue.path.join('.')}": ${issue.message}`);
  }
  return result.data;
}

/**
 * Loads, validates and indexes the seed dataset, keeping it in memory.
 * Each event row is expanded into an object that already knows its team and round,
 * so services can filter without extra lookups.
 *
 * @param {{ dir?: string }} [options]
 */
export function loadSeedStore({ dir = DEFAULT_SEED_DIR } = {}) {
  const teams = parse(z.array(teamSchema), readJson(dir, 'teams.json'), 'teams.json');
  const players = parse(z.array(playerSchema), readJson(dir, 'players.json'), 'players.json');
  const matches = parse(z.array(matchSchema), readJson(dir, 'matches.json'), 'matches.json');
  const { rows } = parse(eventsSchema, readJson(dir, 'events.json'), 'events.json');

  const teamsById = new Map(teams.map((team) => [team.id, team]));
  const playersById = new Map(players.map((player) => [player.id, player]));
  const matchesById = new Map(matches.map((match) => [match.id, match]));

  // Cross-file checks: every reference must point at something that exists
  for (const player of players) {
    if (!teamsById.has(player.teamId)) {
      throw new Error(`Seed data invalid: player ${player.id} has unknown team ${player.teamId}`);
    }
  }

  const events = rows.map(([matchId, playerId, type, x, y, success], index) => {
    const player = playersById.get(playerId);
    const match = matchesById.get(matchId);
    if (!player || !match) {
      throw new Error(
        `Seed data invalid: event row ${index} references an unknown player or match`,
      );
    }
    return { matchId, round: match.round, playerId, teamId: player.teamId, type, x, y, success };
  });

  return {
    /** Where the data comes from; shown in API responses so the UI can label demo data. */
    source: 'seed',
    demo: true,
    teams,
    players,
    matches,
    events,
    getTeam: (id) => teamsById.get(id),
    getPlayer: (id) => playersById.get(id),
  };
}
