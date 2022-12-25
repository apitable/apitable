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

import { ISegment, SegmentType, SymbolAlign } from 'types/field_types';
import { phone } from 'phone';
import { shim } from 'string.prototype.matchall';
shim();

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function generateRandomString(length = 20): string {
  let randomString = '';
  const size = chars.length;
  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * size);
    randomString += chars[randomNumber];
  }
  return randomString;
}

export const MAX_NAME_STRING_LENGTH = 100;

export function isValidName(name: string) {
  if (!name || (typeof name !== 'string')) {
    return false;
  }

  if (name.length > MAX_NAME_STRING_LENGTH || name.length === 0) {
    return false;
  }

  if (name.trim().length === 0) {
    return false;
  }

  // if (/[*:/?[\]\\]/.test(name)) {
  //   return false;
  // }

  return true;
}

/* eslint-disable @typescript-eslint/naming-convention */
enum EscapeMap {
  '&' = '&amp;',
  '<' = '&lt;',
  '>' = '&gt;',
  '"' = '&quot;',
  '\'' = '&#x27;',
  '`' = '&#x60;',
}
/* eslint-enable @typescript-eslint/naming-convention */

export const escapeHtml = (str: string): string => {
  const replaceReg = new RegExp('(?:&|<|>|"|\'|`)', 'g');
  return replaceReg.test(str) ? str.replace(replaceReg, m => EscapeMap[m]) : str;
};

const URL_PROTOCOL_REG = /^(https?|ftp):\/\/|mailto:/i;
const PROTOCOL = 'https?|s?ftp|ftps|nfs|ssh';
const LINK_SUFFIX = '\\b([/?#][-a-zA-Z0-9@:%_+.~#?&/=;$,!\\*\\[\\]{}^|<>]*)?';
const URL_HOST_BODY = '([\\-a-zA-Z0-9:%_+~#@]{1,256}\\.){1,50}';
const ANY_TOP_DOMAIN = '[a-z\\-]{2,15}';
/* eslint-disable */
const TOP_DOMAIN = 'com|org|net|int|edu|gov|mil|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gh|gi|gl|gm|gn|gp|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mf|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw|site|top|wtf|xxx|xyz|cloud|engineering|help|one';
const TOP_10_DOMAIN = 'com|cn|tk|de|net|org|uk|info|nl|ru';
// Since the top-level domain name is incomplete, it is changed to a url with a protocol header, ignoring the above top-level domain name and matching directly
const URL_REG = new RegExp(`(((${PROTOCOL}):\\/\\/${URL_HOST_BODY}${ANY_TOP_DOMAIN})|(${URL_HOST_BODY}(${TOP_10_DOMAIN})))(:[0-9]{2,5})?${LINK_SUFFIX}`, 'gi');
// Mailto's greedy matching will be very slow when encountering extremely long strings (English without spaces), and the length needs to be limited.
const EMAIL_URL_BODY = '[\\w.!#$%&\'*+-/=?^_\\`{|}~]{1,2000}@[A-Za-z0-9_.-]+\\.';
const LENGTH_LIMITED_EMAIL_REG = new RegExp(`^(?!data:)((mailto:${EMAIL_URL_BODY}${ANY_TOP_DOMAIN})|(${EMAIL_URL_BODY}(${TOP_DOMAIN})))\\b`, 'gi');
const LOCALHOST_REG = /localhost:[0-9]{2,5}/;
const IP_ADDRESS_REG = /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(2[0-4][0-9]|25[0-5]|1[0-9]{2}|[1-9][0-9]|[0-9])(:[0-9]{2,5})?/;
const IP_REG = new RegExp(`((https?|http|ftp)://)?((${LOCALHOST_REG.source})|(${IP_ADDRESS_REG.source}))(/[-a-zA-Z0-9@:%_+.~#?&//=]*)?`, 'gi');
export const LINK_REG = new RegExp(`(${IP_REG.source})|(${URL_REG.source})|(${LENGTH_LIMITED_EMAIL_REG.source})`, 'gi');
const EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const EMAIL_REG = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;

const VCODE_REG = /[\da-z]{8}/i;
export function isVCode(code: string): boolean{
  return new RegExp(VCODE_REG).test(code);
}
export function hasUrlProtocol(url: string): boolean {
  return new RegExp(URL_PROTOCOL_REG).test(url);
}

export function isUrl(url: string): boolean {
  return new RegExp(LINK_REG).test(url);
}

export function isEmailUrl(url: string): boolean {
  return new RegExp(`^${LENGTH_LIMITED_EMAIL_REG.source}$`, 'i').test(url);
}

export function isEmail(email: string): boolean {
  return new RegExp(EMAIL).test(email);
}

export function isPhoneNumber(phoneNumber: string, areaCode: string) {
  return phone(areaCode + ' ' + phoneNumber)?.isValid;
}

// Hide the middle 4 digits of the phone number
export function hiddenMobile(mobileNumber: string): string {
  return mobileNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

export function parseAllUrl(value: string): ISegment[] {
  const valueArray: ISegment[] = [];
  let lastEndIndex = 0;

  const regExp = new RegExp(LINK_REG);
  let execResult = regExp.exec(value);

  if (execResult == null) {
    return [{
      type: SegmentType.Text,
      text: value,
    }];
  }

  while (execResult) {
    const startIndex = execResult.index;
    const regExpMatch = execResult[0]!;

    if (startIndex !== lastEndIndex) {
      valueArray.push({
        type: SegmentType.Text,
        text: value.substring(lastEndIndex, startIndex),
      });
    }

    if (hasUrlProtocol(regExpMatch)) {
      valueArray.push({ type: SegmentType.Url, link: regExpMatch, text: regExpMatch });
    } else if (isUrl(regExpMatch)) {
      valueArray.push({ type: SegmentType.Url, link: `http://${regExpMatch}`, text: regExpMatch });
    } else if (isEmailUrl(regExpMatch)) {
      valueArray.push({ type: SegmentType.Url, link: `mailto:${regExpMatch}`, text: regExpMatch });
    }

    lastEndIndex = regExp.lastIndex;
    execResult = regExp.exec(value);
  }

  if (lastEndIndex < value.length) {
    valueArray.push({
      type: SegmentType.Text,
      text: value.substring(lastEndIndex),
    });
  }

  return valueArray;
}

export const stringHash2Number = (str: string, range: number): number => {
  /**
   * String str is mapped to a value in the specified range [0,range)
   */
  const sumOfStringCharCode = Array.from(str).map(c => c.charCodeAt(0)).reduce((a, b) => a + b);
  return Math.abs(sumOfStringCharCode % range);
};

/**
 * String is cut into segment with type by regex matching
 * @export
 * @param {string} str
 * @returns {ISegment[]}
 */
export function string2Segment(str: string): ISegment[] {
  const segmentList: ISegment[] = [];
  const urlTmp: {
    [index: number]: {
      text: string;
      hasScheme?: boolean;
      type: SegmentType.Url | SegmentType.Email;
    };
  } = {};
  // match URL
  const urlMatch = [...str.matchAll(LINK_REG)];
  const emailMatch = [...str.matchAll(EMAIL_REG)];

  // If there is no URL/Email match, return directly to reduce unnecessary calculations
  if (!urlMatch.length && !emailMatch.length) {
    segmentList.push({
      type: SegmentType.Text,
      text: str,
    });
    return segmentList;
  }

  urlMatch.forEach(element => {
    const text = element[0]!;
    const hasScheme = Boolean(element[15]);
    const index = element.index!;
    urlTmp[index] = { text, hasScheme, type: SegmentType.Url };
  });

  emailMatch.forEach(ele => {
    const text = ele[0]!;
    const index = ele.index!;
    urlTmp[index] = { text, type: SegmentType.Email };
  });

  let seg = '';
  let cur = 0;
  while (cur < str.length) {
    if (cur in urlTmp) {
      if (seg.length) {
        segmentList.push({
          type: SegmentType.Text,
          text: seg,
        });
        seg = '';
      }
      const { text, type } = urlTmp[cur]!;
      segmentList.push({
        type,
        text,
        link: text,
      });
      cur += text.length;
    } else {
      seg += str[cur];
      cur++;
    }
  }
  // After the loop is complete, add the text at the end
  if (seg.length) {
    segmentList.push({
      type: SegmentType.Text,
      text: seg,
    });
  }
  return segmentList;
}

export const dateStrReplaceCN = (str: string) => {
  if (!str) {
    return str;
  }

  return str.replace(/(\s?[年月]\s?)|(\s?[时分]\s?)|([日秒])/g, (_, p1, p2, p3) => {
    if (p1) { return '/'; }
    if (p2) { return ':'; }
    if (p3) { return ''; }
    return _;
  });
};

/**
 * Convert ordinary strings to pure numeric strings (only string combinations of "+", "-", numbers, "e" and ".")
 * @param input input string or number
 */
export function str2NumericStr(input: string | null): string | null {
  if (input == null || input === '') {
    return null;
  }

  const regNumber = /[^0-9\.e+-]/g;
  const regSymbol = /(\+|\-|\.)+/g; // try to keep numbers, compatible with cases like '--', '...'
  let tempStr: string | null = (input + '').trim();

  tempStr = tempStr.replace(regNumber, '');
  tempStr = tempStr.replace(regSymbol, '$1');

  const result = parseFloat(tempStr);

  if (!result && result !== 0) {
    return null;
  }
  return result.toString();
}

/**
 * Display in currency
 * @param input input number or string
 * @param symbol currency symbol
 * @param digits Separation digits
 * @param splitter separator
 * @param symbolAlign currency symbol position
 */
export function str2Currency(
  input: string | null,
  symbol: string = '',
  digits: number = 3,
  splitter: string = ',',
  symbolAlign = SymbolAlign.default,
): string | null {
  let tempStr = ('' + input).trim();
  let sign = '';

  if (input == null || tempStr === '') {
    return null;
  }
  if (tempStr.startsWith('-')) {
    sign = '-';
    tempStr = tempStr.substring(1);
  }
  if (tempStr.includes('e')) {
    if (symbolAlign === SymbolAlign.right) {
      return `${sign}${tempStr}${symbol}`;
    }
    return `${sign}${symbol}${tempStr}`;
  }
  if (!tempStr.includes('.')) {
    tempStr += '.';
  }

  const regExp = new RegExp(`(\\d)(?=(\\d{${digits}})+\\.)`, 'g');

  tempStr = tempStr.replace(regExp, function(_$0: string, $1: any) {
    return $1 + splitter;
  }).replace(/\.$/, '');
  if (!tempStr) {
    return null;
  }

  if (symbolAlign === SymbolAlign.right) {
    return `${sign}${tempStr}${symbol}`;
  }
  return `${sign}${symbol}${tempStr}`;
}

export function truncateText(text: string, maxLength: number = 20, postfix: string = '...') {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}${postfix}`;
}
