package com.vikadata.api.modular.workspace.observer.remind;

import com.vikadata.api.enums.social.SocialPlatformType;

/**
 * <p>
 * 订阅提醒类型
 * </p>
 *
 * @author Pengap
 * @date 2021/10/9 14:17:56
 */
public final class RemindSubjectType {

    public enum RemindSubjectEnum {
        EMIL(RemindSubjectType.EMIL),
        IM_FEISHU(RemindSubjectType.IM_FEISHU),
        IM_DINGTALK(RemindSubjectType.IM_DINGTALK),
        IM_WECOM(RemindSubjectType.IM_WECOM);

        RemindSubjectEnum(String subjectFlag) {
            this.subjectFlag = subjectFlag;
        }

        private String subjectFlag;

        public String getSubjectFlag() {
            return subjectFlag;
        }

        public static RemindSubjectEnum[] getImSubject() {
            return new RemindSubjectEnum[] { IM_FEISHU, IM_DINGTALK, IM_WECOM };
        }
    }

    public static String EMIL = "mailRemind";

    public static String IM_FEISHU = "IMFeishuRemind";

    public static String IM_DINGTALK = "IMDingtalkRemind";

    public static String IM_WECOM = "IMWecomRemind";

    /**
     * 集成平台类型转换为Im订阅主题类型
     */
    public static String transform2ImSubject(SocialPlatformType platform) {
        if (platform == SocialPlatformType.FEISHU) {
            return IM_FEISHU;
        }
        else if (platform == SocialPlatformType.DINGTALK) {
            return IM_DINGTALK;
        }
        else if (platform == SocialPlatformType.WECOM) {
            return IM_WECOM;
        }
        return null;
    }

}
