package com.vikadata.api.security.sms;

import com.vikadata.core.exception.BusinessException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * <p>
 * 腾讯云短信
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 16:40
 */
public class TencentConstants {

    /**
     * 短信模板
     */
    @AllArgsConstructor
    @Getter
    public enum SmsTemplate {

        /**
         * 注册
         */
        REGISTER("注册", "430107"),

        /**
         * 登录
         */
        LOGIN("登录", "525692"),

        /**
         * 修改登录密码
         */
        UPDATE_PASSWORD("修改登录密码", "525694"),

        /**
         * 修改密码成功提示
         */
        UPDATE_PASSWORD_SUCCESS_NOTICE("修改密码成功提示", "525695"),

        /**
         * 绑定手机
         */
        BIND_MOBILE_PHONE("绑定手机", "525698"),

        /**
         * 解除手机绑定
         */
        REMOVE_MOBILE_PHONE_BINDING("解除手机绑定", "525699"),

        /**
         * 修改邮箱绑定
         */
        UPDATE_EMAIL_BINDING("修改邮箱绑定", "525700"),

        /**
         * 删除空间
         */
        DELETE_SPACE("删除空间", "525701"),

        /**
         * 更换主管理员
         */
        UPDATE_MAIN_ADMIN("更换主管理员", "525704"),

        /**
         * 钉钉绑定
         */
        DING_TALK_BINDING("钉钉绑定", "525705"),

        /**
         * 普通验证
         */
        GENERAL_VERIFICATION("普通验证", "533747"),

        /**
         * 更改开发者配置
         */
        RESET_API_KEY("更改开发者配置", "617895"),

        /**
         * 第三方平台绑定
         */
        SOCIAL_USER_BIND("第三方平台绑定", "800128"),;

        private final String type;

        private final String templateCode;

        /**
         * 模板编码转换
         */
        public static SmsTemplate ofCode(String templateCode) {
            SmsTemplate smsTemplate = null;
            for (SmsTemplate ele : SmsTemplate.values()) {
                if (templateCode.equals(ele.getTemplateCode())) {
                    smsTemplate = ele;
                    break;
                }
            }
            return smsTemplate;
        }

        /**
         * 是否短信模板
         */
        public static boolean isSmsTemplate(String templateCode) {
            if (StringUtils.isEmpty(templateCode)) {
                throw new BusinessException("短信模板不存在");
            }
            List<String> templateCodeList = getTemplateCodeList();
            return templateCodeList.contains(templateCode);
        }

        /**
         * 获取短信模板列表
         */
        public static List<SmsTemplate> getList() {
            return Arrays.asList(SmsTemplate.values());
        }

        /**
         * 获取短信模板编码列表
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
