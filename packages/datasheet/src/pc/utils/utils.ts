// @ts-ignore
export function runInTimeSlicing(gen, frameDelta: number = 25) {
  if (typeof gen === 'function') gen = gen();
  if (!gen || typeof gen.next !== 'function') return;

  return function next() {
    const start = performance.now();
    let res: any = null;
    do {
      res = gen.next();
    } while (!res.done && performance.now() - start < frameDelta);

    if (res.done) {
      return;
    }
    setTimeout(next);
  };
}
