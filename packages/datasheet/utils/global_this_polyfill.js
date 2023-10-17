(function () {
  if (typeof globalThis === 'undefined') {
    if (typeof self !== 'undefined') {
      window.globalThis = self;
    } else if (typeof window !== 'undefined') {
      window.globalThis = window;
    } else if (typeof global !== 'undefined') {
      window.globalThis = global;
    } else {
      throw new Error('Unable to locate global `this`');
    }
  }
})();
