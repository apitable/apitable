/* tslint:disable */
/* eslint-disable */

import json0 from '../json0';
import otFuzzer from 'ot-fuzzer';

const clone = function (o) {
  return JSON.parse(JSON.stringify(o));
};

const randomKey = function (obj) {
  var count, key, result;
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return void 0;
    } else {
      return otFuzzer.randomInt(obj.length);
    }
  } else {
    count = 0;
    for (key in obj) {
      if (otFuzzer.randomReal() < 1 / ++count) {
        result = key;
      }
    }
    return result;
  }
};

const randomNewKey = function (obj) {
  var key;
  key = otFuzzer.randomWord();
  while (obj[key] !== void 0) {
    key = otFuzzer.randomWord();
  }
  return key;
};

const randomThing = function () {
  var i, j, obj, ref1, ref2, results;
  switch (otFuzzer.randomInt(6)) {
    case 0:
      return null;
    case 1:
      return '';
    case 2:
      return otFuzzer.randomWord();
    case 3:
      obj = {};
      for (i = 1, ref1 = otFuzzer.randomInt(5); 1 <= ref1 ? i <= ref1 : i >= ref1; 1 <= ref1 ? i++ : i--) {
        obj[randomNewKey(obj)] = randomThing();
      }
      return obj;
    case 4:
      results = [];
      for (j = 1, ref2 = otFuzzer.randomInt(5); 1 <= ref2 ? j <= ref2 : j >= ref2; 1 <= ref2 ? j++ : j--) {
        results.push(randomThing());
      }
      return results;
    case 5:
      return otFuzzer.randomInt(50);
    default:
      return null;
  }
};

const randomPath = function (data) {
  var key, path;
  path = [];
  while (otFuzzer.randomReal() > 0.85 && typeof data === 'object') {
    key = randomKey(data);
    if (key == null) {
      break;
    }
    path.push(key);
    data = data[key];
  }
  return path;
};

module.exports = function genRandomOp(data) {
  var c, container, inc, k, key, length, newIndex, newValue, obj, op, operand, p, parent, path, pct, pos, str, subOp;
  pct = 0.95;
  container = {
    data: clone(data)
  };
  op = (function () {
    var i, len, results;
    results = [];
    while (otFuzzer.randomReal() < pct) {
      pct *= 0.6;
      path = randomPath(container['data']);
      parent = container;
      key = 'data';
      for (i = 0, len = path.length; i < len; i++) {
        p = path[i];
        parent = parent[key];
        key = p;
      }
      operand = parent[key];
      if (otFuzzer.randomReal() < 0.4 && parent !== container && Array.isArray(parent)) {
        newIndex = otFuzzer.randomInt(parent.length);
        parent.splice(key, 1);
        parent.splice(newIndex, 0, operand);
        results.push({
          p: path,
          lm: newIndex
        });
      } else if (otFuzzer.randomReal() < 0.3 || operand === null) {
        newValue = randomThing();
        parent[key] = newValue;
        if (Array.isArray(parent)) {
          results.push({
            p: path,
            ld: operand,
            li: clone(newValue)
          });
        } else {
          results.push({
            p: path,
            od: operand,
            oi: clone(newValue)
          });
        }
      } else if (typeof operand === 'string') {
        if (otFuzzer.randomReal() > 0.5 || operand.length === 0) {
          pos = otFuzzer.randomInt(operand.length + 1);
          str = otFuzzer.randomWord() + ' ';
          path.push(pos);
          parent[key] = operand.slice(0, pos) + str + operand.slice(pos);
          c = {
            p: path,
            si: str
          };
        } else {
          pos = otFuzzer.randomInt(operand.length);
          length = Math.min(otFuzzer.randomInt(4), operand.length - pos);
          str = operand.slice(pos, pos + length);
          path.push(pos);
          parent[key] = operand.slice(0, pos) + operand.slice(pos + length);
          c = {
            p: path,
            sd: str
          };
        }
        if (json0._testStringSubtype) {
          subOp = {
            p: path.pop()
          };
          if (c.si != null) {
            subOp.i = c.si;
          } else {
            subOp.d = c.sd;
          }
          c = {
            p: path,
            t: 'text0',
            o: [subOp]
          };
        }
        results.push(c);
      } else if (typeof operand === 'number') {
        inc = otFuzzer.randomInt(10) - 3;
        parent[key] += inc;
        results.push({
          p: path,
          na: inc
        });
      } else if (Array.isArray(operand)) {
        if (otFuzzer.randomReal() > 0.5 || operand.length === 0) {
          pos = otFuzzer.randomInt(operand.length + 1);
          obj = randomThing();
          path.push(pos);
          operand.splice(pos, 0, obj);
          results.push({
            p: path,
            li: clone(obj)
          });
        } else {
          pos = otFuzzer.randomInt(operand.length);
          obj = operand[pos];
          path.push(pos);
          operand.splice(pos, 1);
          results.push({
            p: path,
            ld: clone(obj)
          });
        }
      } else {
        k = randomKey(operand);
        if (otFuzzer.randomReal() > 0.5 || (k == null)) {
          k = randomNewKey(operand);
          obj = randomThing();
          path.push(k);
          operand[k] = obj;
          results.push({
            p: path,
            oi: clone(obj)
          });
        } else {
          obj = operand[k];
          path.push(k);
          delete operand[k];
          results.push({
            p: path,
            od: clone(obj)
          });
        }
      }
    }
    return results;
  })();
  return [op, container.data];
};
