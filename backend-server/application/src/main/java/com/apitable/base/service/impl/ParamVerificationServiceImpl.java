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

package com.apitable.base.service.impl;

import static com.apitable.user.enums.UserException.MOBILE_EMPTY;
import static com.apitable.user.enums.UserException.MOBILE_ERROR_FORMAT;
import static com.apitable.user.enums.UserException.PASSWORD_EMPTY;
import static com.apitable.user.enums.UserException.PASSWORD_ERROR_FORMAT;
import static com.apitable.user.enums.UserException.PASSWORD_ERROR_LENGTH;
import static com.apitable.user.enums.UserException.PASSWORD_ERROR_TYPE;

import cn.hutool.core.lang.Validator;
import com.apitable.base.service.ParamVerificationService;
import com.apitable.core.util.ExceptionUtil;
import org.springframework.stereotype.Service;

/**
 * Parameter validation service related interface implementation.
 */
@Service
public class ParamVerificationServiceImpl implements ParamVerificationService {

    @Override
    public void verifyPhone(String phone) {
        ExceptionUtil.isNotBlank(phone, MOBILE_EMPTY);
        ExceptionUtil.isTrue(Validator.isMobile(phone), MOBILE_ERROR_FORMAT);
    }

    @Override
    public void verifyPassword(String password) {
        ExceptionUtil.isNotBlank(password, PASSWORD_EMPTY);
        ExceptionUtil.isTrue(Validator.isBetween(password.length(), 8, 24), PASSWORD_ERROR_LENGTH);
        ExceptionUtil.isTrue(
            Validator.isMatchRegex("^[`~!@#$%^&*()-=+[{]}\\|;:'\",<.>/?\\w]+$", password),
            PASSWORD_ERROR_TYPE);
        ExceptionUtil.isTrue(
            Validator.isMatchRegex("^.*(?=.{8,24})(?=.*\\d)(?=.*[a-zA-Z]).*$", password),
            PASSWORD_ERROR_FORMAT);
    }
}
