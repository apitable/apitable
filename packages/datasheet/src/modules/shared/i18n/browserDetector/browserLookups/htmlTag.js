/* eslint-disable */
export default {
  name: "htmlTag",

  lookup(options) {
    let found;
    let htmlTag = options.htmlTag || (typeof document !== "undefined" ? document.documentElement : null);

    if (htmlTag && typeof htmlTag.getAttribute === "function") {
      found = htmlTag.getAttribute("lang");
    }

    return found;
  },
};
