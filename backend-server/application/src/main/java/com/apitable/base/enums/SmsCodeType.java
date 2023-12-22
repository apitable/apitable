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

package com.apitable.base.enums;

import com.apitable.core.support.serializer.IBaseEnum;
import com.apitable.shared.captcha.sms.TencentConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * sms verification code type.
 * </p>
 *
 * @author Shawn Deng
 */
@AllArgsConstructor
@Getter
public enum SmsCodeType implements IBaseEnum {

    REGISTER(1, TencentConstants.SmsTemplate.REGISTER),

    LOGIN(2, TencentConstants.SmsTemplate.LOGIN),

    UPDATE_PWD(3, TencentConstants.SmsTemplate.UPDATE_PASSWORD),

    BOUND_DINGTALK(4, TencentConstants.SmsTemplate.DING_TALK_BINDING),

    BOUND_MOBILE(5, TencentConstants.SmsTemplate.BIND_MOBILE_PHONE),

    UN_BOUND_MOBILE(6, TencentConstants.SmsTemplate.REMOVE_MOBILE_PHONE_BINDING),

    UPDATE_EMAIL(7, TencentConstants.SmsTemplate.UPDATE_EMAIL_BINDING),

    DEL_SPACE(8, TencentConstants.SmsTemplate.DELETE_SPACE),

    UPDATE_MAIN_ADMIN(9, TencentConstants.SmsTemplate.UPDATE_MAIN_ADMIN),

    GENERAL_VERIFICATION(10, TencentConstants.SmsTemplate.GENERAL_VERIFICATION),

    RESET_API_KEY(11, TencentConstants.SmsTemplate.RESET_API_KEY),

    SOCIAL_USER_BIND(12, TencentConstants.SmsTemplate.SOCIAL_USER_BIND);

    private final Integer value;

    private final TencentConstants.SmsTemplate template;

    /**
     * transform name to enum.
     *
     * @param name name
     * @return SmsCodeType
     */
    public static SmsCodeType fromName(Integer name) {
        for (SmsCodeType type : SmsCodeType.values()) {
            if (type.getValue().equals(name)) {
                return type;
            }
        }
        throw new IllegalArgumentException("unknown sms code type");
    }

    /**
     * transform name to enum.
     *
     * @param name name
     * @return SmsCodeType
     */
    public static SmsCodeType ofName(String name) {
        SmsCodeType type = null;
        for (SmsCodeType ele : SmsCodeType.values()) {
            if (name.equalsIgnoreCase(ele.name())) {
                type = ele;
                break;
            }
        }
        if (type == null) {
            throw new IllegalArgumentException("unknown sms code type");
        }
        return type;
    }
}
