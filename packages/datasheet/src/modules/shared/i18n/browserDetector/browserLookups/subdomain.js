/* eslint-disable */
export default {
  name: "subdomain",

  lookup(options) {
    let found;
    if (typeof window !== "undefined") {
      // const language = window.location.href.match(/(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/gi);
      const language = window.location.href.match(/(?:http[s]*\/\/)*(.*?)\.(?=[^/]*\..{2,5})/gi);
      if (language instanceof Array) {
        if (typeof options.lookupFromSubdomainIndex === "number") {
          found = language[options.lookupFromSubdomainIndex].replace("http://", "").replace("https://", "").replace(".", "");
        } else {
          found = language[0].replace("http://", "").replace("https://", "").replace(".", "");
        }
      }
    }
    return found;
  },
};
