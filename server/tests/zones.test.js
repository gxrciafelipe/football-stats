import { gridZones, zoneOf } from '../src/domain/zones.js';

describe('zoneOf', () => {
  it('maps a point to its column, row and zone id on a 6 × 4 grid', () => {
    expect(zoneOf(0, 0, 6, 4)).toEqual({ col: 0, row: 0, zoneId: 0 });
    expect(zoneOf(50, 50, 6, 4)).toEqual({ col: 3, row: 2, zoneId: 15 });
    expect(zoneOf(99.9, 99.9, 6, 4)).toEqual({ col: 5, row: 3, zoneId: 23 });
  });

  it('keeps points on the far edge (x or y = 100) inside the last zone', () => {
    expect(zoneOf(100, 100, 6, 4)).toEqual({ col: 5, row: 3, zoneId: 23 });
    expect(zoneOf(100, 0, 6, 4).zoneId).toBe(5);
  });

  it('puts a point exactly on a zone border into the next zone', () => {
    // 6 columns are each 16.67 wide; 25 is in the 2nd row of 4 (rows are 25 tall)
    expect(zoneOf(33.4, 25, 6, 4)).toEqual({ col: 2, row: 1, zoneId: 8 });
  });

  it('works for other grid sizes', () => {
    expect(zoneOf(60, 10, 12, 8)).toEqual({ col: 7, row: 0, zoneId: 7 });
    expect(zoneOf(60, 10, 1, 1).zoneId).toBe(0);
  });
});

describe('gridZones', () => {
  it('lists every zone in zone id order', () => {
    const zones = gridZones(3, 2);
    expect(zones).toHaveLength(6);
    expect(zones[4]).toEqual({ zoneId: 4, col: 1, row: 1 });
  });
});
