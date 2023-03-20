/*
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

<<<<<<<< HEAD:apitable/backend-server/application/src/main/java/com/apitable/user/ro/EmailVerificationRo.java
package com.apitable.user.ro;

import io.swagger.v3.oas.annotations.media.Schema;
import javax.validation.constraints.NotBlank;
import lombok.Data;

/**
 * <p>
 * user email verification ro.
 * </p>
 */
@Data
@Schema(description = "verify email parameters")
public class EmailVerificationRo {

    @Schema(description = "email", example = "123456@**", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "email")
    private String email;
========
import generatePicker from 'antd/es/date-picker/generatePicker';
import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import dayjsGenerateConfig from 'rc-picker/es/generate/dayjs';
import local from 'antd/es/date-picker/locale/zh_CN';
import 'dayjs/locale/zh-cn';

dayjs.extend(weekday);
dayjs.extend(localeData);

export const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig as any);

class LocalHelper {
  getDefinedChineseLocal() {
    const definedChineseLocal: any = {
      ...local,
      lang: {
        ...local.lang,
        monthFormat: 'M月',
        shortWeekDays: ['日', '一', '二', '三', '四', '五', '六']
      }
    };
    return definedChineseLocal;
  }
>>>>>>>> 94651c7c85b44b92e4a54e263fb0c829a20cefaa:apitable/packages/widget-sdk/src/ui/filter/filter_value/filter_date/date_picker.tsx
}

export const LocalFormat = new LocalHelper();

