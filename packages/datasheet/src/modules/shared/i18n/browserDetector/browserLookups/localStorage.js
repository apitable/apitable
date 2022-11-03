/* eslint-disable */
let hasLocalStorageSupport;
try {
  hasLocalStorageSupport = window !== "undefined" && window.localStorage !== null;
  const testKey = "i18next.translate.boo";
  window.localStorage.setItem(testKey, "foo");
  window.localStorage.removeItem(testKey);
} catch (e) {
  hasLocalStorageSupport = false;
}

export default {
  name: "localStorage",

  lookup(options) {
    let found;

    if (options.lookupLocalStorage && hasLocalStorageSupport) {
      const lng = window.localStorage.getItem(options.lookupLocalStorage);
      if (lng) { found = lng; }
    }

    return found;
  },

  cacheUserLanguage(lng, options) {
    if (options.lookupLocalStorage && hasLocalStorageSupport) {
      window.localStorage.setItem(options.lookupLocalStorage, lng);
    }
  },
};
