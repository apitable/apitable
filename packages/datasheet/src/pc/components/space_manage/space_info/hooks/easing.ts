/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// Slow motion animation
// http://robertpenner.com/easing/

export const Easing = {
  linear: function (t: number) {
    return t;
  },

  easeIn: function (t: number) {
    return t * t;
  },

  easeOut: function (t: number) {
    return -t * (t - 2);
  },

  easeInOut: function (t: number) {
    if ((t /= 0.5) < 1) {
      return 0.5 * t * t;
    }
    return -0.5 * (--t * (t - 2) - 1);
  },

  easeInCubic: function (t: number) {
    return t * t * t;
  },

  easeOutCubic: function (t: number) {
    return (t = t - 1) * t * t + 1;
  },

  easeInOutCubic: function (t: number) {
    if ((t /= 0.5) < 1) {
      return 0.5 * t * t * t;
    }
    return 0.5 * ((t -= 2) * t * t + 2);
  },

  easeInQuart: function (t: number) {
    return t * t * t * t;
  },

  easeOutQuart: function (t: number) {
    return -((t = t - 1) * t * t * t - 1);
  },

  easeInOutQuart: function (t: number) {
    if ((t /= 0.5) < 1) {
      return 0.5 * t * t * t * t;
    }
    return -0.5 * ((t -= 2) * t * t * t - 2);
  },

  easeInQuint: function (t: number) {
    return t * t * t * t * t;
  },

  easeOutQuint: function (t: number) {
    return (t = t - 1) * t * t * t * t + 1;
  },

  easeInOutQuint: function (t: number) {
    if ((t /= 0.5) < 1) {
      return 0.5 * t * t * t * t * t;
    }
    return 0.5 * ((t -= 2) * t * t * t * t + 2);
  },

  easeInSine: function (t: number) {
    return -Math.cos(t * (Math.PI / 2)) + 1;
  },

  easeOutSine: function (t: number) {
    return Math.sin(t * (Math.PI / 2));
  },

  easeInOutSine: function (t: number) {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
  },

  easeInExpo: function (t: number) {
    return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
  },

  easeOutExpo: function (t: number) {
    return t === 1 ? 1 : -Math.pow(2, -10 * t) + 1;
  },

  easeInOutExpo: function (t: number) {
    if (t === 0) {
      return 0;
    }
    if (t === 1) {
      return 1;
    }
    if ((t /= 0.5) < 1) {
      return 0.5 * Math.pow(2, 10 * (t - 1));
    }
    return 0.5 * (-Math.pow(2, -10 * --t) + 2);
  },

  easeInCirc: function (t: number) {
    if (t >= 1) {
      return t;
    }
    return -(Math.sqrt(1 - t * t) - 1);
  },

  easeOutCirc: function (t: number) {
    return Math.sqrt(1 - (t = t - 1) * t);
  },

  easeInOutCirc: function (t: number) {
    if ((t /= 0.5) < 1) {
      return -0.5 * (Math.sqrt(1 - t * t) - 1);
    }
    return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
  },

  easeInElastic: function (t: number) {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (t === 0) {
      return 0;
    }
    if (t === 1) {
      return 1;
    }
    if (!p) {
      p = 0.3;
    }
    if (a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(1 / a);
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - s) * (2 * Math.PI)) / p));
  },

  easeOutElastic: function (t: number) {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (t === 0) {
      return 0;
    }
    if (t === 1) {
      return 1;
    }
    if (!p) {
      p = 0.3;
    }
    if (a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(1 / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1;
  },

  easeInOutElastic: function (t: number) {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (t === 0) {
      return 0;
    }
    if ((t /= 0.5) === 2) {
      return 1;
    }
    if (!p) {
      p = 0.45;
    }
    if (a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(1 / a);
    }
    if (t < 1) {
      return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - s) * (2 * Math.PI)) / p));
    }
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t - s) * (2 * Math.PI)) / p) * 0.5 + 1;
  },
  easeInBack: function (t: number) {
    const s = 1.70158;
    return t * t * ((s + 1) * t - s);
  },

  easeOutBack: function (t: number) {
    const s = 1.70158;
    return (t = t - 1) * t * ((s + 1) * t + s) + 1;
  },

  easeInOutBack: function (t: number) {
    let s = 1.70158;
    if ((t /= 0.5) < 1) {
      return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
    }
    return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
  },

  easeInBounce: function (t: number) {
    return 1 - Easing.easeOutBounce(1 - t);
  },

  easeOutBounce: function (t: number) {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    }
    if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    }
    if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    }
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  },

  easeInOutBounce: function (t: number) {
    if (t < 0.5) {
      return Easing.easeInBounce(t * 2) * 0.5;
    }
    return Easing.easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
  },
};
