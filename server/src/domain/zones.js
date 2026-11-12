/**
 * Pitch geometry. Coordinates run 0-100 on both axes:
 *  - x: 0 = own goal line, 100 = opponent's goal line (every team attacks left to right)
 *  - y: 0 = left touchline, 100 = right touchline
 * A grid of `cols × rows` zones is numbered row by row from the top-left corner:
 *   zoneId = row * cols + col
 */

/** Finds the zone an (x, y) point falls in. Points on the far edge (100) belong to the last zone. */
export function zoneOf(x, y, cols, rows) {
  const col = Math.min(Math.floor((x * cols) / 100), cols - 1);
  const row = Math.min(Math.floor((y * rows) / 100), rows - 1);
  return { col, row, zoneId: row * cols + col };
}

/** Lists every zone of a grid in zoneId order, with its column and row. */
export function gridZones(cols, rows) {
  return Array.from({ length: cols * rows }, (_, zoneId) => ({
    zoneId,
    col: zoneId % cols,
    row: Math.floor(zoneId / cols),
  }));
}
