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

package com.apitable.shared.captcha.sms;

import com.apitable.base.enums.SmsCodeType;
import com.apitable.shared.captcha.ValidateTarget;

/**
 * <p>
 * sms service interface.
 * </p>
 *
 * @author Shawn Deng
 */
public interface ISmsService {

    /**
     * send sms verification code.
     *
     * @param target verification target
     * @param code   verification code
     * @param type   sms service type
     * @see SmsCodeType
     */
    void sendValidateCode(ValidateTarget target, String code, SmsCodeType type);

    /**
     * send notification sms.
     *
     * @param target verification target
     * @param type   sms service type
     */
    void sendMessage(ValidateTarget target, TencentConstants.SmsTemplate type);
}
