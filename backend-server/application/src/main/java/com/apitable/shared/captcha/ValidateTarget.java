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

package com.apitable.shared.captcha;

import static com.apitable.user.enums.UserException.MOBILE_ERROR_FORMAT;

import cn.hutool.core.lang.Validator;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.util.StringUtil;
import lombok.Data;

/**
 * <p>
 * validate the target object.
 * </p>
 *
 * @author Chambers
 */
@Data
public class ValidateTarget {

    private String target;

    private String areaCode;

    private static String mainlandAreaCode = "+86";

    private String lang;

    public ValidateTarget() {
    }

    public ValidateTarget(String target) {
        this.target = target;
    }

    public ValidateTarget(String target, String areaCode) {
        this.target = target;
        this.areaCode = areaCode;
    }

    public static ValidateTarget create(String target) {
        return new ValidateTarget(target);
    }

    /**
     * create a ValidateTarget object.
     *
     * @param target   target
     * @param areaCode areaCode
     * @return ValidateTarget
     */
    public static ValidateTarget create(String target, String areaCode) {
        ExceptionUtil.isTrue(StringUtil.isPureNumber(target), MOBILE_ERROR_FORMAT);
        ExceptionUtil.isTrue(!mainlandAreaCode.equals(areaCode)
            || (target.length() == 11 && Validator.isMobile(target)), MOBILE_ERROR_FORMAT);
        return new ValidateTarget(target, areaCode);
    }

    /**
     * get the real target.
     *
     * @return real target
     */
    public String getRealTarget() {
        if (areaCode == null) {
            return target;
        } else {
            return areaCode + target;
        }
    }

    /**
     * get the intact target.
     *
     * @return intact target
     */
    public String getIntactTarget() {
        if (Validator.isMobile(target)) {
            return mainlandAreaCode + target;
        }
        return target;
    }
}
