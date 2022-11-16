export function noop() {}

export function intBetween(min, max, val) {
  return Math.floor(Math.min(max, Math.max(min, val)));
}

export function getCoords(evt) {
  if (evt.type === 'touchmove') {
    return { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
  }

  return { x: evt.clientX, y: evt.clientY };
}
