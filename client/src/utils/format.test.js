import { describeZone, formatNumber, percentOf, shortName } from './format.js';

describe('format helpers', () => {
  it('shortens names to initial + surname', () => {
    expect(shortName('Bruno Lima')).toBe('B. Lima');
    expect(shortName('João Pedro Souza')).toBe('J. Souza');
    expect(shortName('Hulk')).toBe('Hulk');
  });

  it('formats numbers with thousands separators', () => {
    expect(formatNumber(3273)).toBe('3,273');
  });

  it('computes whole percentages and handles a zero total', () => {
    expect(percentOf(172, 3273)).toBe(5);
    expect(percentOf(1, 0)).toBe(0);
  });

  it('describes zones in football terms', () => {
    expect(describeZone(0, 0, 6, 4)).toBe('Defensive third, left flank');
    expect(describeZone(2, 1, 6, 4)).toBe('Middle third, left centre');
    expect(describeZone(5, 3, 6, 4)).toBe('Attacking third, right flank');
    expect(describeZone(0, 0, 1, 1)).toBe('Middle third, right centre');
  });
});
