// tslint:disable
/**
 * @description
 * @param {*} fn Scroll functions for table areas
 * @param {*} id The dom id to be rolled up for testing
 * @param {*} totalCount Number of calculations, also refers to the total time of test execution
 * @param {*} dps Distance scrolled in every 16s for blocking test
 * @returns
 */
export function checkFps(fn: (arg0: WheelEvent) => void, id: string, totalCount: number, dps: any) {
  return new Promise((resolve) => {
    const element = document.getElementById(id)!;

    function simulatScroll() {
      return setInterval(() => {
        dispatchScrollEvent(dps);
      }, 16);
    }

    function dispatchScrollEvent(deltaY: number) {
      const domRect = element.getBoundingClientRect();
      const evt = new WheelEvent('wheel', {
        deltaX: 0,
        deltaY: deltaY,
        wheelDeltaX: 0,
        wheelDeltaY: deltaY,
        pageX: domRect.left + 100,
        pageY: domRect.top + 100,
      } as any);
      fn(evt);
    }

    function showFps(totalCount: number) {
      window['_fpsResult'] = {
        fps: [],
        averageFps: undefined,
      };
      const result = window['_fpsResult'];

      let frame = 0;
      let count = 0; // Number of frame rate calculation nodes (about one second at a time)
      let time = Date.now();
      let rafId: any;

      const scrollTmer = simulatScroll();

      function step() {
        frame++;
        rafId = window.requestAnimationFrame(step);
      }

      rafId = window.requestAnimationFrame(step);
      const timer = setInterval(() => {
        count++;
        const timeEscape = (Date.now() - time) / 1000;
        const fps = frame / timeEscape;
        result.fps.push(fps);
        if (count >= totalCount) {
          // Remove the first and last seconds
          result.fps.shift();
          result.fps.pop();
          result.averageFps = result.fps.reduce((cur: any, prev: any) => cur + prev) / result.fps.length;
          window.clearInterval(timer);
          window.clearInterval(scrollTmer);
          window.cancelAnimationFrame(rafId);
          resolve(result);
          return;
        }
        frame = 0;
        time = Date.now();
      }, 1000);
    }

    // Scroll to the top
    // const sheet = window.spread.getActiveSheet();
    // sheet.showCell(0, 0, 0, 0);
    showFps(totalCount);
  });
}

(() => {
  if (!process.env.SSR) {
    window['checkFps'] = checkFps;
  }
})();
