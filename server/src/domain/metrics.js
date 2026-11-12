/**
 * Metric aggregators, created through a Factory (design pattern #1).
 *
 * Every metric answers one question: "does this event count?". Passes count only
 * completed passes, shots count every attempt, and later metrics (tackles, touches)
 * will add their own rule. Keeping each rule in its own class, created by the factory
 * from a registry, means adding a metric = one new class + one registry line, with no
 * if/else chains in the services that use them.
 */

/** Base class: describes a metric and decides which events it counts. */
export class MetricAggregator {
  constructor({ id, label, unit }) {
    this.id = id;
    this.label = label;
    this.unit = unit;
  }

  /** @param {{ type: string, success: number }} _event @returns {boolean} */
  // eslint-disable-next-line no-unused-vars
  counts(_event) {
    throw new Error(`${this.constructor.name} must implement counts(event)`);
  }

  /** Plain description sent to the client. */
  describe() {
    return { id: this.id, label: this.label, unit: this.unit };
  }
}

/** Completed passes only: a misplaced pass does not show who controls a zone. */
export class PassAggregator extends MetricAggregator {
  constructor() {
    super({ id: 'passes', label: 'Completed passes', unit: 'passes' });
  }

  counts(event) {
    return event.type === 'pass' && event.success === 1;
  }
}

/** Every shot attempt, on target or not. */
export class ShotAggregator extends MetricAggregator {
  constructor() {
    super({ id: 'shots', label: 'Shots', unit: 'shots' });
  }

  counts(event) {
    return event.type === 'shot';
  }
}

/** Registry of available metrics, in the order the UI lists them. */
const registry = new Map([
  ['passes', PassAggregator],
  ['shots', ShotAggregator],
]);

export const MetricAggregatorFactory = {
  /** Creates the aggregator for a metric id. Throws for unknown ids. */
  create(id) {
    const Aggregator = registry.get(id);
    if (!Aggregator) throw new Error(`Unknown metric "${id}"`);
    return new Aggregator();
  },

  /** True when the factory knows how to build this metric. */
  has(id) {
    return registry.has(id);
  },

  /** Ids of every registered metric. */
  ids() {
    return [...registry.keys()];
  },

  /** Descriptions of every registered metric, for GET /api/metrics. */
  list() {
    return this.ids().map((id) => this.create(id).describe());
  },
};
