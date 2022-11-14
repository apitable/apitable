package com.vikadata.api.shared.security.email;

import java.util.Locale;

import lombok.AllArgsConstructor;
import lombok.Getter;

import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_ADD_RECORD_LIMITED;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_ADD_RECORD_SOON_LIMITED;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_CAPACITY_FULL;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_CHANGE_ADMIN;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_DATASHEET_REMIND;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_INVITE_NOTIFY;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_PAI_SUCCESS;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_PUBLISH_NOTIFY;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_RECORD_COMMENT;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_REGISTER;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_REMOVE_MEMBER;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SPACE_APPLY;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_TASK_REMINDER;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_VERIFY_CODE;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_WARN_NOTIFY;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_WIDGET_QUALIFICATION_AUTH_FAIL;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_WIDGET_QUALIFICATION_AUTH_SUCCESS;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_WIDGET_SUBMIT_FAIL;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_WIDGET_SUBMIT_SUCCESS;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_WIDGET_TRANSFER_NOTIFY;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_WIDGET_UNPUBLISH_GLOBAL_NOTIFY;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_WIDGET_UNPUBLISH_NOTIFY;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_RECORD_CELL_UPDATED;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_RECORD_COMMENTED;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_DATASHEET_LIMIT;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_DATASHEET_RECORD_LIMIT;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_CAPACITY_LIMIT;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_SEATS_LIMIT;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_RECORD_LIMIT;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_API_LIMIT;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_CALENDAR_LIMIT;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_FORM_LIMIT;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_MIRROR_LIMIT;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_GANNT_LIMIT;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_FIELD_PERMISSION_LIMIT;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_FILE_PERMISSION_LIMIT;
import static com.vikadata.api.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_ADMIN_LIMIT;

/**
 * <p>
 * tencent cloud email template
 * </p>
 *
 * @author Chambers
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
         * email verification code
         */
        VERIFY_CODE(SUBJECT_VERIFY_CODE, 27395L),

        /**
         * primary admin transfer notification
         */
        CHANGE_ADMIN(SUBJECT_CHANGE_ADMIN, 26507L),

        /**
         * payment successful
         */
        PAI_SUCCESS(SUBJECT_PAI_SUCCESS, 23462L),

        /**
         * registration verification code
         */
        REGISTER(SUBJECT_REGISTER, 27395L),

        /**
         * space invitation notice
         */
        INVITE_NOTIFY(SUBJECT_INVITE_NOTIFY, 26497L),

        /**
         * Notice that the space capacity has reached the upper limit
         */
        CAPACITY_FULL(SUBJECT_CAPACITY_FULL, 23465L),

        /**
         * log comment mentions
         */
        RECORD_COMMENT(SUBJECT_RECORD_COMMENT, 23466L),

        /**
         * member field notification
         */
        DATASHEET_REMIND(SUBJECT_DATASHEET_REMIND, 23467L),

        /**
         * transfer of mini program publishing rights
         */
        WIDGET_TRANSFER_NOTIFY(SUBJECT_WIDGET_TRANSFER_NOTIFY, 23468L),

        /**
         * small program takedown notice
         */
        WIDGET_UNPUBLISH_NOTIFY(SUBJECT_WIDGET_UNPUBLISH_NOTIFY, 23469L),

        /**
         * space station join application
         */
        SPACE_APPLY(SUBJECT_SPACE_APPLY, 26509L),

        /**
         * move out of space station notification
         */
        REMOVE_MEMBER(SUBJECT_REMOVE_MEMBER, 23471L),

        /**
         * alert email
         */
        WARN_NOTIFY(SUBJECT_WARN_NOTIFY, 23533L),

        /**
         * release notice
         */
        PUBLISH_NOTIFY(SUBJECT_PUBLISH_NOTIFY, 23534L),

        /**
         * adding records is about to exceed the limit
         */
        ADD_RECORD_SOON_LIMITED(SUBJECT_ADD_RECORD_SOON_LIMITED, 23956L),

        /**
         * add record overrun
         */
        ADD_RECORD_LIMITED(SUBJECT_ADD_RECORD_LIMITED, 24007L),

        /**
         * the applet was successfully launched
         */
        WIDGET_SUBMIT_SUCCESS(SUBJECT_WIDGET_SUBMIT_SUCCESS, 24533L),

        /**
         * failed to launch the applet
         */
        WIDGET_SUBMIT_FAIL(SUBJECT_WIDGET_SUBMIT_FAIL, 24534L),

        /**
         * Mini Program Developer Qualification Certification Successfully
         */
        WIDGET_QUALIFICATION_AUTH_SUCCESS(SUBJECT_WIDGET_QUALIFICATION_AUTH_SUCCESS, 24532L),

        /**
         * The qualification authentication of the Mini Program developer failed
         */
        WIDGET_QUALIFICATION_AUTH_FAIL(SUBJECT_WIDGET_QUALIFICATION_AUTH_FAIL, 24531L),

        /**
         * notification of global removal of applet
         */
        WIDGET_UNPUBLISH_GLOBAL_NOTIFY(SUBJECT_WIDGET_UNPUBLISH_GLOBAL_NOTIFY, 25076L),

        /**
         * task reminder
         */
        TASK_REMINDER(SUBJECT_TASK_REMINDER, 25038L),

        /**
         * follow record change notifications
         */
        SUBSCRIBED_RECORD_CELL_UPDATED(SUBJECT_SUBSCRIBED_RECORD_CELL_UPDATED, 25336L),

        /**
         * follow records are notified by comments
         */
        SUBSCRIBED_RECORD_COMMENTED(SUBJECT_SUBSCRIBED_RECORD_COMMENTED, 25334L),

        SUBSCRIBED_DATASHEET_LIMIT(SUBJECT_SUBSCRIBED_DATASHEET_LIMIT, 52372L),

        SUBSCRIBED_DATASHEET_RECORD_LIMIT(SUBJECT_SUBSCRIBED_DATASHEET_RECORD_LIMIT, 52375L),

        SUBSCRIBED_CAPACITY_LIMIT(SUBJECT_SUBSCRIBED_CAPACITY_LIMIT, 52378L),

        SUBSCRIBED_SEATS_LIMIT(SUBJECT_SUBSCRIBED_SEATS_LIMIT, 52379L),

        SUBSCRIBED_RECORD_LIMIT(SUBJECT_SUBSCRIBED_RECORD_LIMIT, 52382L),

        SUBSCRIBED_API_LIMIT(SUBJECT_SUBSCRIBED_API_LIMIT, 52383L),

        SUBSCRIBED_CALENDAR_LIMIT(SUBJECT_SUBSCRIBED_CALENDAR_LIMIT, 52386L),

        SUBSCRIBED_FORM_LIMIT(SUBJECT_SUBSCRIBED_FORM_LIMIT, 52387L),

        SUBSCRIBED_MIRROR_LIMIT(SUBJECT_SUBSCRIBED_MIRROR_LIMIT, 52390L),

        SUBSCRIBED_GANNT_LIMIT(SUBJECT_SUBSCRIBED_GANNT_LIMIT, 52391L),

        SUBSCRIBED_FIELD_PERMISSION_LIMIT(SUBJECT_SUBSCRIBED_FIELD_PERMISSION_LIMIT, 52394L),

        SUBSCRIBED_FILE_PERMISSION_LIMIT(SUBJECT_SUBSCRIBED_FILE_PERMISSION_LIMIT, 52395L),

        SUBSCRIBED_ADMIN_LIMIT(SUBJECT_SUBSCRIBED_ADMIN_LIMIT, 52398L);

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
         * email verification code
         */
        VERIFY_CODE(SUBJECT_VERIFY_CODE, 23612L),

        /**
         * primary admin transfer notification
         */
        CHANGE_ADMIN(SUBJECT_CHANGE_ADMIN, 26508L),

        /**
         * The payment is successful (there is no English version template. 23462 is a Chinese template)
         */
        PAI_SUCCESS(SUBJECT_PAI_SUCCESS, 23462L),

        /**
         * registration verification code
         */
        REGISTER(SUBJECT_REGISTER, 23612L),

        /**
         * space invitation notice
         */
        INVITE_NOTIFY(SUBJECT_INVITE_NOTIFY, 26498L),

        /**
         * Notice that the space capacity has reached the upper limit
         */
        CAPACITY_FULL(SUBJECT_CAPACITY_FULL, 23616L),

        /**
         * record comment mentions
         */
        RECORD_COMMENT(SUBJECT_RECORD_COMMENT, 23617L),

        /**
         * member field notification
         */
        DATASHEET_REMIND(SUBJECT_DATASHEET_REMIND, 23618L),

        /**
         * transfer of mini program publishing rights
         */
        TRANSFER_WIDGET_NOTIFY(SUBJECT_WIDGET_TRANSFER_NOTIFY, 23619L),

        /**
         * small program takedown notice
         */
        UNPUBLISH_WIDGET_NOTIFY(SUBJECT_WIDGET_UNPUBLISH_NOTIFY, 23620L),

        /**
         * space station join application
         */
        SPACE_APPLY(SUBJECT_SPACE_APPLY, 26510L),

        /**
         * move out of space station notification
         */
        REMOVE_MEMBER(SUBJECT_REMOVE_MEMBER, 23622L),

        /**
         * adding records is about to exceed the limit
         */
        ADD_RECORD_SOON_LIMITED(SUBJECT_ADD_RECORD_SOON_LIMITED, 23957L),

        /**
         * add record overrun
         */
        ADD_RECORD_LIMITED(SUBJECT_ADD_RECORD_LIMITED, 24008L),

        /**
         * the applet was successfully launched
         */
        WIDGET_SUBMIT_SUCCESS(SUBJECT_WIDGET_SUBMIT_SUCCESS, 25083L),

        /**
         * failed to launch the applet
         */
        WIDGET_SUBMIT_FAIL(SUBJECT_WIDGET_SUBMIT_FAIL, 25084L),

        /**
         * notification of global removal of applet
         */
        WIDGET_UNPUBLISH_GLOBAL_NOTIFY(SUBJECT_WIDGET_UNPUBLISH_GLOBAL_NOTIFY, 25082L),

        /**
         * task reminder
         */
        TASK_REMINDER(SUBJECT_TASK_REMINDER, 25039L),

        /**
         * follow record change notifications
         */
        SUBSCRIBED_RECORD_CELL_UPDATED(SUBJECT_SUBSCRIBED_RECORD_CELL_UPDATED, 25337L),

        /**
         * follow records are notified by comments
         */
        SUBSCRIBED_RECORD_COMMENTED(SUBJECT_SUBSCRIBED_RECORD_COMMENTED, 25335L),

        SUBSCRIBED_DATASHEET_LIMIT(SUBJECT_SUBSCRIBED_DATASHEET_LIMIT, 52373L),

        SUBSCRIBED_DATASHEET_RECORD_LIMIT(SUBJECT_SUBSCRIBED_DATASHEET_RECORD_LIMIT, 52376L),

        SUBSCRIBED_CAPACITY_LIMIT(SUBJECT_SUBSCRIBED_CAPACITY_LIMIT, 52377L),

        SUBSCRIBED_SEATS_LIMIT(SUBJECT_SUBSCRIBED_SEATS_LIMIT, 52380L),

        SUBSCRIBED_RECORD_LIMIT(SUBJECT_SUBSCRIBED_RECORD_LIMIT, 52381L),

        SUBSCRIBED_API_LIMIT(SUBJECT_SUBSCRIBED_API_LIMIT, 52384L),

        SUBSCRIBED_CALENDAR_LIMIT(SUBJECT_SUBSCRIBED_CALENDAR_LIMIT, 52385L),

        SUBSCRIBED_FORM_LIMIT(SUBJECT_SUBSCRIBED_FORM_LIMIT, 52388L),

        SUBSCRIBED_MIRROR_LIMIT(SUBJECT_SUBSCRIBED_MIRROR_LIMIT, 52389L),

        SUBSCRIBED_GANNT_LIMIT(SUBJECT_SUBSCRIBED_GANNT_LIMIT, 52392L),

        SUBSCRIBED_FIELD_PERMISSION_LIMIT(SUBJECT_SUBSCRIBED_FIELD_PERMISSION_LIMIT, 52393L),

        SUBSCRIBED_FILE_PERMISSION_LIMIT(SUBJECT_SUBSCRIBED_FILE_PERMISSION_LIMIT, 52396L),

        SUBSCRIBED_ADMIN_LIMIT(SUBJECT_SUBSCRIBED_ADMIN_LIMIT, 52397L);

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
