import {
  MetricAggregator,
  MetricAggregatorFactory,
  PassAggregator,
  ShotAggregator,
} from '../src/domain/metrics.js';

describe('MetricAggregatorFactory', () => {
  it('creates the right aggregator for each metric id', () => {
    expect(MetricAggregatorFactory.create('passes')).toBeInstanceOf(PassAggregator);
    expect(MetricAggregatorFactory.create('shots')).toBeInstanceOf(ShotAggregator);
  });

  it('throws for an unknown metric', () => {
    expect(() => MetricAggregatorFactory.create('dribbles')).toThrow('Unknown metric "dribbles"');
    expect(MetricAggregatorFactory.has('dribbles')).toBe(false);
  });

  it('lists the available metrics for the client', () => {
    expect(MetricAggregatorFactory.list()).toEqual([
      { id: 'passes', label: 'Completed passes', unit: 'passes' },
      { id: 'shots', label: 'Shots', unit: 'shots' },
    ]);
  });
});

describe('aggregators', () => {
  const pass = (success) => ({ type: 'pass', success });
  const shot = (success) => ({ type: 'shot', success });

  it('counts only completed passes', () => {
    const passes = new PassAggregator();
    expect(passes.counts(pass(1))).toBe(true);
    expect(passes.counts(pass(0))).toBe(false);
    expect(passes.counts(shot(1))).toBe(false);
  });

  it('counts every shot attempt', () => {
    const shots = new ShotAggregator();
    expect(shots.counts(shot(0))).toBe(true);
    expect(shots.counts(shot(1))).toBe(true);
    expect(shots.counts(pass(1))).toBe(false);
  });

  it('forces subclasses to implement counts()', () => {
    class Incomplete extends MetricAggregator {}
    expect(() => new Incomplete({ id: 'x' }).counts({})).toThrow(/must implement counts/);
  });
});
