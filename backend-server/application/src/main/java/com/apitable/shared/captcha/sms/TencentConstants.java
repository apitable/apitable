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

import cn.hutool.core.util.StrUtil;
import com.apitable.core.exception.BusinessException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * Tencent Cloud Constants.
 * </p>
 *
 * @author Shawn Deng
 */
public class TencentConstants {

    /**
     * Sms Template.
     */
    @AllArgsConstructor
    @Getter
    public enum SmsTemplate {

        /**
         * Register.
         */
        REGISTER("430107"),

        /**
         * Login.
         */
        LOGIN("525692"),

        /**
         * Update Login Password.
         */
        UPDATE_PASSWORD("525694"),

        /**
         * Update Password success.
         */
        UPDATE_PASSWORD_SUCCESS_NOTICE("525695"),

        /**
         * Bind Mobile.
         */
        BIND_MOBILE_PHONE("525698"),

        /**
         * unbind mobile.
         */
        REMOVE_MOBILE_PHONE_BINDING("525699"),

        /**
         * update bind mail.
         */
        UPDATE_EMAIL_BINDING("525700"),

        /**
         * delete space.
         */
        DELETE_SPACE("525701"),

        /**
         * change space main admin.
         */
        UPDATE_MAIN_ADMIN("525704"),

        /**
         * bind dingtalk.
         */
        DING_TALK_BINDING("525705"),

        /**
         * normal verification.
         */
        GENERAL_VERIFICATION("533747"),

        /**
         * reset api key.
         */
        RESET_API_KEY("617895"),

        /**
         * bind user.
         */
        SOCIAL_USER_BIND("800128"),
        ;

        private final String templateCode;

        /**
         * is sms template.
         */
        public static boolean isSmsTemplate(String templateCode) {
            if (StrUtil.isEmpty(templateCode)) {
                throw new BusinessException("sms template is not exist");
            }
            List<String> templateCodeList = getTemplateCodeList();
            return templateCodeList.contains(templateCode);
        }

        /**
         * get sms template list.
         */
        public static List<SmsTemplate> getList() {
            return Arrays.asList(SmsTemplate.values());
        }

        /**
         * get sms template code list.
         */
        public static List<String> getTemplateCodeList() {
            List<String> templateCodeList = new ArrayList<>();
            List<SmsTemplate> list = getList();
            for (SmsTemplate template : list) {
                if (StrUtil.isEmpty(template.getTemplateCode())) {
                    continue;
                }
                templateCodeList.add(template.getTemplateCode());
            }
            return templateCodeList;
        }
    }
}
