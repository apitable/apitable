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

// import { PickerLocale } from 'antd/es/date-picker/generatePicker';
import deDE from 'antd/es/date-picker/locale/de_DE';
import esES from 'antd/es/date-picker/locale/es_ES';
import frFR from 'antd/es/date-picker/locale/fr_FR';
import itIT from 'antd/es/date-picker/locale/it_IT';
import jaJP from 'antd/es/date-picker/locale/ja_JP';
import koKR from 'antd/es/date-picker/locale/ko_KR';
import ruRU from 'antd/es/date-picker/locale/ru_RU';
import local from 'antd/es/date-picker/locale/zh_CN';
import 'dayjs/locale/zh-cn';

class LocalHelper {
  getLocal(language: string) {
    if (!language || language.startsWith('en')) {
      return undefined;
    } else if (language.startsWith('zh')) {
      return this.getDefinedChineseLocal();
    }
    return {
      'fr-FR': frFR,
      'de-DE': deDE,
      'it-IT': itIT,
      'ja-JP': jaJP,
      'ko-KR': koKR,
      'ru-RU': ruRU,
      'es-ES': esES,
    }[language];
  }

  private getDefinedChineseLocal() {
    const definedChineseLocal: any = {
      ...local,
      lang: {
        ...local.lang,
        monthFormat: 'M月',
        shortWeekDays: ['日', '一', '二', '三', '四', '五', '六'],
      },
    };
    return definedChineseLocal;
  }
}

export const LocalFormat = new LocalHelper();
