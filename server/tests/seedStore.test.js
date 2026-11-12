import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadSeedStore } from '../src/data/seedStore.js';
import { generateSeed } from '../scripts/generate-seed.js';

describe('seed dataset', () => {
  const store = loadSeedStore();

  it('covers all 20 Série A clubs with 14 players each', () => {
    expect(store.teams).toHaveLength(20);
    expect(store.players).toHaveLength(280);
  });

  it('has every club play exactly once in each round', () => {
    const rounds = new Set(store.matches.map((match) => match.round));
    for (const round of rounds) {
      const teamsInRound = store.matches
        .filter((match) => match.round === round)
        .flatMap((match) => [match.homeTeamId, match.awayTeamId]);
      expect(new Set(teamsInRound).size).toBe(20);
      expect(teamsInRound).toHaveLength(20);
    }
  });

  it('gives every event a player, team, type, coordinates and round', () => {
    expect(store.events.length).toBeGreaterThan(10000);
    for (const event of store.events.slice(0, 500)) {
      expect(store.getPlayer(event.playerId).teamId).toBe(event.teamId);
      expect(['pass', 'shot', 'tackle', 'touch']).toContain(event.type);
      expect(event.x).toBeGreaterThanOrEqual(0);
      expect(event.x).toBeLessThanOrEqual(100);
      expect(event.round).toBeGreaterThanOrEqual(1);
    }
  });

  it('is labelled as demo data', () => {
    expect(store.source).toBe('seed');
    expect(store.demo).toBe(true);
  });

  it('is generated deterministically from a fixed seed', () => {
    const first = generateSeed();
    const second = generateSeed();
    expect(second.events.rows.length).toBe(first.events.rows.length);
    expect(second.events.rows.slice(0, 50)).toEqual(first.events.rows.slice(0, 50));
    expect(generateSeed(1).events.rows[0]).not.toEqual(first.events.rows[0]);
  });
});

describe('seed validation', () => {
  let dir;
  const valid = generateSeed();

  // Writes a small dataset to a temp folder, letting a test break one file
  function writeDataset(overrides = {}) {
    const data = {
      teams: valid.teams,
      players: valid.players,
      matches: valid.matches,
      events: { columns: valid.events.columns, rows: valid.events.rows.slice(0, 10) },
      ...overrides,
    };
    for (const [name, content] of Object.entries(data)) {
      writeFileSync(join(dir, `${name}.json`), JSON.stringify(content));
    }
  }

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'seed-'));
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it('loads a valid dataset', () => {
    writeDataset();
    expect(loadSeedStore({ dir }).events).toHaveLength(10);
  });

  it('rejects an event with coordinates off the pitch', () => {
    const rows = [[1, valid.players[0].id, 'pass', 140, 20, 1]];
    writeDataset({ events: { columns: valid.events.columns, rows } });
    expect(() => loadSeedStore({ dir })).toThrow(/events\.json at "rows\.0\.3"/);
  });

  it('rejects an unknown event type', () => {
    const rows = [[1, valid.players[0].id, 'dribble', 40, 20, 1]];
    writeDataset({ events: { columns: valid.events.columns, rows } });
    expect(() => loadSeedStore({ dir })).toThrow(/events\.json/);
  });

  it('rejects a player that belongs to an unknown team', () => {
    const players = [{ ...valid.players[0], teamId: 'nowhere-fc' }];
    writeDataset({ players });
    expect(() => loadSeedStore({ dir })).toThrow(/unknown team nowhere-fc/);
  });

  it('rejects an event that points at an unknown player', () => {
    const rows = [[1, 'ghost-99', 'pass', 40, 20, 1]];
    writeDataset({ events: { columns: valid.events.columns, rows } });
    expect(() => loadSeedStore({ dir })).toThrow(/event row 0/);
  });
});
