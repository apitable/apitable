/* eslint-disable */
let cookie = {
  create: function(name, value, minutes, domain) {
    let expires;
    if (minutes) {
      let date = new Date();
      date.setTime(date.getTime() + (minutes * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }
    domain = domain ? "domain=" + domain + ";" : "";
    document.cookie = name + "=" + value + expires + ";" + domain + "path=/";
  },

  read: function(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  },

  remove: function(name) {
    this.create(name, "", -1);
  },
};

export default {
  name: "cookie",

  lookup(options) {
    let found;

    if (options.lookupCookie && typeof document !== "undefined") {
      var c = cookie.read(options.lookupCookie);
      if (c) { found = c; }
    }

    return found;
  },

  cacheUserLanguage(lng, options) {
    if (options.lookupCookie && typeof document !== "undefined") {
      cookie.create(options.lookupCookie, lng, options.cookieMinutes, options.cookieDomain);
    }
  },
};
