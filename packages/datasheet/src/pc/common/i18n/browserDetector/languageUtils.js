/* eslint-disable */
// import baseLogger from './logger.js';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

class LanguageUtil {
  constructor(options) {
    this.options = options;

    this.whitelist = this.options.whitelist || false;
    // this.logger = baseLogger.create('languageUtils');
  }

  getScriptPartFromCode(code) {
    if (!code || code.indexOf("-") < 0) {
      return null;
    }

    const p = code.split("-");
    if (p.length === 2) {
      return null;
    }
    p.pop();
    return this.formatLanguageCode(p.join("-"));
  }

  getLanguagePartFromCode(code) {
    if (!code || code.indexOf("-") < 0) {
      return code;
    }

    const p = code.split("-");
    return this.formatLanguageCode(p[0]);
  }

  formatLanguageCode(code) {
    // http://www.iana.org/assignments/language-tags/language-tags.xhtml
    if (typeof code === "string" && code.indexOf("-") > -1) {
      const specialCases = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"];
      let p = code.split("-");

      if (this.options.lowerCaseLng) {
        p = p.map(part => part.toLowerCase());
      } else if (p.length === 2) {
        p[0] = p[0].toLowerCase();
        p[1] = p[1].toUpperCase();

        if (specialCases.indexOf(p[1].toLowerCase()) > -1) {
          p[1] = capitalize(p[1].toLowerCase());
        }
      } else if (p.length === 3) {
        p[0] = p[0].toLowerCase();

        if (specialCases.indexOf(p[1].toLowerCase()) > -1) {
          // p[1] = capitalize(p[1].toLowerCase());

          // 移除 special cases (如 zh-Hans-CN转成zh_CN)
          p[1] = p[2];
          p.pop();
        }

        // if lenght 2 guess it's a country
        if (p[1].length === 2) {
          p[1] = p[1].toUpperCase();
        }
        // if (p[0] !== "sgn" && p[2].length === 2) {
        //   p[2] = p[2].toUpperCase();
        // }
        // if (specialCases.indexOf(p[2].toLowerCase()) > -1) {
        //   p[2] = capitalize(p[2].toLowerCase());
        // }

      }

      return p.join("_");
    }

    return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
  }

  isWhitelisted(code) {
    if (this.options.load === "languageOnly" || this.options.nonExplicitWhitelist) {
      code = this.getLanguagePartFromCode(code);
    }
    return !this.whitelist || !this.whitelist.length || this.whitelist.indexOf(code) > -1;
  }

  getFallbackCodes(fallbacks, code) {
    if (!fallbacks) {
      return [];
    }
    if (typeof fallbacks === "string") {
      fallbacks = [fallbacks];
    }
    if (Object.prototype.toString.apply(fallbacks) === "[object Array]") {
      return fallbacks;
    }

    if (!code) {
      return fallbacks.default || [];
    }

    // asume we have an object defining fallbacks
    let found = fallbacks[code];
    if (!found) {
      found = fallbacks[this.getScriptPartFromCode(code)];
    }
    if (!found) {
      found = fallbacks[this.formatLanguageCode(code)];
    }
    if (!found) {
      found = fallbacks.default;
    }

    return found || [];
  }

  toResolveHierarchy(code, fallbackCode) {
    const fallbackCodes = this.getFallbackCodes(
      fallbackCode || this.options.fallbackLng || [],
      code,
    );

    const codes = [];
    const addCode = c => {
      if (!c) {
        return;
      }
      if (this.isWhitelisted(c)) {
        codes.push(c);
      } else {
        // this.logger.warn(`rejecting non-whitelisted language code: ${c}`);
        // console.log(`rejecting non-whitelisted language code: ${c}`);
        throw new Error(`rejecting non-whitelisted language code: ${c}`);
      }
    };

    if (typeof code === "string" && code.indexOf("-") > -1) {
      if (this.options.load !== "languageOnly") {
        addCode(this.formatLanguageCode(code));
      }
      if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") {
        addCode(this.getScriptPartFromCode(code));
      }
      if (this.options.load !== "currentOnly") {
        addCode(this.getLanguagePartFromCode(code));
      }
    } else if (typeof code === "string") {
      addCode(this.formatLanguageCode(code));
    }

    fallbackCodes.forEach(fc => {
      if (codes.indexOf(fc) < 0) {
        addCode(this.formatLanguageCode(fc));
      }
    });

    return codes;
  }
}

export default LanguageUtil;
