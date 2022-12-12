package com.vikadata.api.shared.captcha.sms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import cn.hutool.core.util.StrUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;

import org.springframework.util.StringUtils;

/**
 * <p>
 * Tencent Cloud Constants
 * </p>
 *
 * @author Shawn Deng
 */
public class TencentConstants {

    /**
     * Sms Template
     */
    @AllArgsConstructor
    @Getter
    public enum SmsTemplate {

        /**
         * Register
         */
        REGISTER("430107"),

        /**
         * Login
         */
        LOGIN("525692"),

        /**
         * Update Login Password
         */
        UPDATE_PASSWORD("525694"),

        /**
         * Update Password success
         */
        UPDATE_PASSWORD_SUCCESS_NOTICE( "525695"),

        /**
         * Bind Mobile
         */
        BIND_MOBILE_PHONE("525698"),

        /**
         * unbind mobile
         */
        REMOVE_MOBILE_PHONE_BINDING( "525699"),

        /**
         * update bind mail
         */
        UPDATE_EMAIL_BINDING( "525700"),

        /**
         * delete space
         */
        DELETE_SPACE( "525701"),

        /**
         * change space main admin
         */
        UPDATE_MAIN_ADMIN( "525704"),

        /**
         * bind dingtalk
         */
        DING_TALK_BINDING( "525705"),

        /**
         * normal verification
         */
        GENERAL_VERIFICATION("533747"),

        /**
         * reset api key
         */
        RESET_API_KEY( "617895"),

        /**
         * bind user
         */
        SOCIAL_USER_BIND("800128"),;

        private final String templateCode;

        /**
         * is sms template
         */
        public static boolean isSmsTemplate(String templateCode) {
            if (StrUtil.isEmpty(templateCode)) {
                throw new BusinessException("sms template is not exist");
            }
            List<String> templateCodeList = getTemplateCodeList();
            return templateCodeList.contains(templateCode);
        }

        /**
         * get sms template list
         */
        public static List<SmsTemplate> getList() {
            return Arrays.asList(SmsTemplate.values());
        }

        /**
         * get sms template code list
         */
        public static List<String> getTemplateCodeList() {
            List<String> templateCodeList = new ArrayList<>();
            List<SmsTemplate> list = getList();
            for (SmsTemplate template : list) {
                if (StringUtils.isEmpty(template.getTemplateCode())) {
                    continue;
                }
                templateCodeList.add(template.getTemplateCode());
            }
            return templateCodeList;
        }
    }
}
