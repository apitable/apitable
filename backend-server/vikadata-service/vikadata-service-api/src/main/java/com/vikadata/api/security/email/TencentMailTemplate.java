package com.vikadata.api.security.email;

import java.util.Locale;

import lombok.AllArgsConstructor;
import lombok.Getter;

import static com.vikadata.api.constants.MailPropConstants.SUBJECT_ADD_RECORD_LIMITED;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_ADD_RECORD_SOON_LIMITED;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_CAPACITY_FULL;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_CHANGE_ADMIN;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_DATASHEET_REMIND;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_INVITE_NOTIFY;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_PAI_SUCCESS;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_PUBLISH_NOTIFY;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_RECORD_COMMENT;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_REGISTER;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_REMOVE_MEMBER;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_SPACE_APPLY;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_TASK_REMINDER;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_VERIFY_CODE;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_WARN_NOTIFY;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_WIDGET_QUALIFICATION_AUTH_FAIL;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_WIDGET_QUALIFICATION_AUTH_SUCCESS;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_WIDGET_SUBMIT_FAIL;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_WIDGET_SUBMIT_SUCCESS;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_WIDGET_TRANSFER_NOTIFY;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_WIDGET_UNPUBLISH_GLOBAL_NOTIFY;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_WIDGET_UNPUBLISH_NOTIFY;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_SUBSCRIBED_RECORD_CELL_UPDATED;
import static com.vikadata.api.constants.MailPropConstants.SUBJECT_SUBSCRIBED_RECORD_COMMENTED;

/**
 * <p>
 * 腾讯云邮件模板
 * </p>
 *
 * @author Chambers
 * @date 2022/2/17
 */
public class TencentMailTemplate {

    public static Long getTemplateId(String lang, String subject) {
        if (Locale.US.toLanguageTag().equals(lang)) {
            return USMailTemplate.getTemplateIdBySubject(subject);
        }
        return ChineseMailTemplate.getTemplateIdBySubject(subject);
    }


    @AllArgsConstructor
    @Getter
    public enum ChineseMailTemplate {

        /**
         * 邮件验证码
         */
        VERIFY_CODE(SUBJECT_VERIFY_CODE, 27395L),

        /**
         * 主管理员转移通知
         */
        CHANGE_ADMIN(SUBJECT_CHANGE_ADMIN, 26507L),

        /**
         * 支付成功
         */
        PAI_SUCCESS(SUBJECT_PAI_SUCCESS, 23462L),

        /**
         * 注册验证码
         */
        REGISTER(SUBJECT_REGISTER, 27395L),

        /**
         * 空间邀请通知
         */
        INVITE_NOTIFY(SUBJECT_INVITE_NOTIFY, 26497L),

        /**
         * 空间容量到达上限通知
         */
        CAPACITY_FULL(SUBJECT_CAPACITY_FULL, 23465L),

        /**
         * 记录评论提及
         */
        RECORD_COMMENT(SUBJECT_RECORD_COMMENT, 23466L),

        /**
         * 成员字段通知
         */
        DATASHEET_REMIND(SUBJECT_DATASHEET_REMIND, 23467L),

        /**
         * 小程序发布权转移
         */
        WIDGET_TRANSFER_NOTIFY(SUBJECT_WIDGET_TRANSFER_NOTIFY, 23468L),

        /**
         * 小程序下架通知
         */
        WIDGET_UNPUBLISH_NOTIFY(SUBJECT_WIDGET_UNPUBLISH_NOTIFY, 23469L),

        /**
         * 空间站加入申请
         */
        SPACE_APPLY(SUBJECT_SPACE_APPLY, 26509L),

        /**
         * 移出空间站通知
         */
        REMOVE_MEMBER(SUBJECT_REMOVE_MEMBER, 23471L),

        /**
         * 告警邮件
         */
        WARN_NOTIFY(SUBJECT_WARN_NOTIFY, 23533L),

        /**
         * 发版通知
         */
        PUBLISH_NOTIFY(SUBJECT_PUBLISH_NOTIFY, 23534L),

        /**
         * 添加记录即将超限
         */
        ADD_RECORD_SOON_LIMITED(SUBJECT_ADD_RECORD_SOON_LIMITED, 23956L),

        /**
         * 添加记录超限
         */
        ADD_RECORD_LIMITED(SUBJECT_ADD_RECORD_LIMITED, 24007L),

        /**
         * 小程序上架成功
         */
        WIDGET_SUBMIT_SUCCESS(SUBJECT_WIDGET_SUBMIT_SUCCESS, 24533L),

        /**
         * 小程序上架失败
         */
        WIDGET_SUBMIT_FAIL(SUBJECT_WIDGET_SUBMIT_FAIL, 24534L),

        /**
         * 小程序开发者主体资质认证成功
         */
        WIDGET_QUALIFICATION_AUTH_SUCCESS(SUBJECT_WIDGET_QUALIFICATION_AUTH_SUCCESS, 24532L),

        /**
         * 小程序开发者主体资质认证失败
         */
        WIDGET_QUALIFICATION_AUTH_FAIL(SUBJECT_WIDGET_QUALIFICATION_AUTH_FAIL, 24531L),

        /**
         * 全局下架小程序通知
         */
        WIDGET_UNPUBLISH_GLOBAL_NOTIFY(SUBJECT_WIDGET_UNPUBLISH_GLOBAL_NOTIFY, 25076L),

        /**
         * 任务提醒
         */
        TASK_REMINDER(SUBJECT_TASK_REMINDER, 25038L),

        /**
         * 关注记录变更通知
         */
        SUBSCRIBED_RECORD_CELL_UPDATED(SUBJECT_SUBSCRIBED_RECORD_CELL_UPDATED, 25336L),

        /**
         * 关注记录被评论通知
         */
        SUBSCRIBED_RECORD_COMMENTED(SUBJECT_SUBSCRIBED_RECORD_COMMENTED, 25334L),

        ;

        private final String subject;

        private final Long templateId;

        public static Long getTemplateIdBySubject(String subject) {
            Long templateId = null;
            for (ChineseMailTemplate ele : ChineseMailTemplate.values()) {
                if (subject.equals(ele.getSubject())) {
                    templateId = ele.getTemplateId();
                    break;
                }
            }
            return templateId;
        }

    }


    @AllArgsConstructor
    @Getter
    public enum USMailTemplate {

        /**
         * 邮件验证码
         */
        VERIFY_CODE(SUBJECT_VERIFY_CODE, 23612L),

        /**
         * 主管理员转移通知
         */
        CHANGE_ADMIN(SUBJECT_CHANGE_ADMIN, 26508L),

        /**
         * 支付成功（暂无英文版模板。23462 是中文模板）
         */
        PAI_SUCCESS(SUBJECT_PAI_SUCCESS, 23462L),

        /**
         * 注册验证码
         */
        REGISTER(SUBJECT_REGISTER, 23612L),

        /**
         * 空间邀请通知
         */
        INVITE_NOTIFY(SUBJECT_INVITE_NOTIFY, 26498L),

        /**
         * 空间容量到达上限通知
         */
        CAPACITY_FULL(SUBJECT_CAPACITY_FULL, 23616L),

        /**
         * 记录评论提及
         */
        RECORD_COMMENT(SUBJECT_RECORD_COMMENT, 23617L),

        /**
         * 成员字段通知
         */
        DATASHEET_REMIND(SUBJECT_DATASHEET_REMIND, 23618L),

        /**
         * 小程序发布权转移
         */
        TRANSFER_WIDGET_NOTIFY(SUBJECT_WIDGET_TRANSFER_NOTIFY, 23619L),

        /**
         * 小程序下架通知
         */
        UNPUBLISH_WIDGET_NOTIFY(SUBJECT_WIDGET_UNPUBLISH_NOTIFY, 23620L),

        /**
         * 空间站加入申请
         */
        SPACE_APPLY(SUBJECT_SPACE_APPLY, 26510L),

        /**
         * 移出空间站通知
         */
        REMOVE_MEMBER(SUBJECT_REMOVE_MEMBER, 23622L),

        /**
         * 添加记录即将超限
         */
        ADD_RECORD_SOON_LIMITED(SUBJECT_ADD_RECORD_SOON_LIMITED, 23957L),

        /**
         * 添加记录超限
         */
        ADD_RECORD_LIMITED(SUBJECT_ADD_RECORD_LIMITED, 24008L),

        /**
         * 小程序上架成功
         */
        WIDGET_SUBMIT_SUCCESS(SUBJECT_WIDGET_SUBMIT_SUCCESS, 25083L),

        /**
         * 小程序上架失败
         */
        WIDGET_SUBMIT_FAIL(SUBJECT_WIDGET_SUBMIT_FAIL, 25084L),

        /**
         * 全局下架小程序通知
         */
        WIDGET_UNPUBLISH_GLOBAL_NOTIFY(SUBJECT_WIDGET_UNPUBLISH_GLOBAL_NOTIFY, 25082L),

        /**
         * 任务提醒
         */
        TASK_REMINDER(SUBJECT_TASK_REMINDER, 25039L),

        /**
         * 关注记录变更通知
         */
        SUBSCRIBED_RECORD_CELL_UPDATED(SUBJECT_SUBSCRIBED_RECORD_CELL_UPDATED, 25337L),

        /**
         * 关注记录被评论通知
         */
        SUBSCRIBED_RECORD_COMMENTED(SUBJECT_SUBSCRIBED_RECORD_COMMENTED, 25335L),

        ;

        private final String subject;

        private final Long templateId;

        public static Long getTemplateIdBySubject(String subject) {
            Long templateId = null;
            for (USMailTemplate ele : USMailTemplate.values()) {
                if (subject.equals(ele.getSubject())) {
                    templateId = ele.getTemplateId();
                    break;
                }
            }
            return templateId;
        }

    }

}
