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

package com.apitable.shared.component.notification;

import static com.apitable.shared.constants.MailPropConstants.SUBJECT_ACCEPT_INVITE;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_ADD_RECORD_LIMITED;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_ADD_RECORD_SOON_LIMITED;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_ADD_SUB_ADMIN;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_ASSIGN_GROUP;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_ASSIGN_ROLE;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_AUTOMATION_ERROR;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_CAPACITY_FULL;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_CHANGE_ADMIN;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_DATASHEET_REMIND;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_INVITE_NOTIFY;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_MEMBER_APPLY_CLOSE_ACCOUNT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_PAI_SUCCESS;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_RECORD_COMMENT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_REGISTER;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_REMOVE_MEMBER;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_REMOVE_ROLE;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_REMOVE_SUB_ADMIN;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SPACE_APPLY;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SPACE_APPLY_APPROVE;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SPACE_APPLY_REFUSE;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SPACE_BETA_FEATURE_APPLY_SUCCESS;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SPACE_CERTIFICATION_FAIL_NOTIFY;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SPACE_CERTIFICATION_NOTIFY;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_ADMIN_LIMIT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_API_LIMIT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_CALENDAR_LIMIT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_CAPACITY_LIMIT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_DATASHEET_LIMIT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_DATASHEET_RECORD_LIMIT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_FIELD_PERMISSION_LIMIT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_FILE_PERMISSION_LIMIT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_FORM_LIMIT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_GANNT_LIMIT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_MIRROR_LIMIT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_RECORD_CELL_UPDATED;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_RECORD_COMMENTED;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_RECORD_LIMIT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SUBSCRIBED_SEATS_LIMIT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_TASK_REMINDER;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_VERIFY_CODE;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_WARN_NOTIFY;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_WIDGET_QUALIFICATION_AUTH_FAIL;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_WIDGET_QUALIFICATION_AUTH_SUCCESS;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_WIDGET_SUBMIT_FAIL;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_WIDGET_SUBMIT_SUCCESS;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_WIDGET_TRANSFER_NOTIFY;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_WIDGET_UNPUBLISH_GLOBAL_NOTIFY;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_WIDGET_UNPUBLISH_NOTIFY;
import static java.util.stream.Collectors.toList;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.interfaces.notification.facade.MailFacade;
import com.apitable.shared.clock.spring.ClockManager;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.shared.config.properties.EmailSendProperties;
import com.apitable.starter.beetl.autoconfigure.BeetlTemplate;
import com.apitable.starter.mail.autoconfigure.EmailMessage;
import com.apitable.starter.mail.autoconfigure.MailTemplate;
import com.apitable.starter.mail.core.CloudEmailMessage;
import com.apitable.starter.mail.core.CloudMailSender;
import com.google.common.base.CaseFormat;
import jakarta.annotation.Resource;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Notification Mail Factory.
 *
 * @author Shawn Deng
 */
@Slf4j
@Component
public class NotifyMailFactory {

    @Resource
    private BeetlTemplate beetlTemplate;

    @Resource
    private EmailSendProperties emailSendProperties;

    @Resource
    private MailFacade mailFacade;

    @Autowired(required = false)
    private CloudMailSender cloudMailSender;

    @Autowired(required = false)
    private MailTemplate mailTemplate;

    public static NotifyMailFactory me() {
        return SpringContextHolder.getBean(NotifyMailFactory.class);
    }

    /**
     * send mail.
     *
     * @param subjectType subjectType
     * @param subjectDict subjectDict
     * @param dict        dict
     * @param tos         tos
     */
    public void sendMail(
        final String subjectType,
        final Dict subjectDict,
        final Dict dict,
        final List<MailWithLang> tos) {
        if (ObjectUtil.isNotNull(tos)) {
            Map<String, List<MailWithLang>> tosGroupByLang =
                tos.stream()
                    .peek(
                        to -> {
                            if (ObjectUtil.isNull(to.getLocale())) {
                                to.setLocale(StrUtil.EMPTY);
                            }
                        })
                    .collect(Collectors.groupingBy(MailWithLang::getLocale));
            tosGroupByLang.forEach(
                (lang, mailWithLanguages) -> {
                    final List<String> emails =
                        mailWithLanguages.stream()
                            .map(MailWithLang::getTo).collect(Collectors.toList());
                    sendMail(lang, subjectType, subjectDict, dict, emails);
                });
        }
    }

    /**
     * send mail.
     *
     * @param lang        lang
     * @param subjectType subjectType
     * @param dict        dict
     * @param to          to
     */
    public void sendMail(
        final String lang,
        final String subjectType,
        final Dict dict,
        final List<String> to
    ) {
        this.sendMail(lang, subjectType, null, dict, to);
    }

    /**
     * send mail.
     *
     * @param language    language
     * @param subjectType subjectType
     * @param subjectDict subjectDict
     * @param dict        dict
     * @param to          to
     */
    public void sendMail(
        final String language,
        final String subjectType,
        final Dict subjectDict,
        final Dict dict,
        final List<String> to) {
        String lang = StrUtil.isNotBlank(language)
            ? language.replace("_", "-") : Locale.US.toLanguageTag();
        // load subject.properties
        Properties properties = loadSubjectProperties(lang);
        String subject =
            StrUtil.format(properties.getProperty(subjectType), subjectDict);

        if (StrUtil.isBlank(subject)) {
            log.warn("Lost mail subject.");
            return;
        }
        // Uniformly add variables
        dict.set("YEARS", ClockManager.me().getLocalDateNow().getYear());
        String contactUrl = StrUtil.format("{}/?home=1",
            SpringContextHolder.getBean(ConstProperties.class).getServerDomain());
        dict.set("CONTACT_URL", contactUrl);
        if (cloudMailSender != null) {
            cloudMailSend(subject, lang, subjectType, dict, to);
            return;
        }
        if (mailTemplate == null) {
            throw new BusinessException(
                "The SMTP server is not configured, so emails cannot be sent.");
        }

        MailText mailText = new MailText(subjectType, subjectDict).getTemplate();
        String htmlTemplateName = mailText.getHtmlTemplateName();
        String textTemplateName = mailText.getTextTemplateName();
        if (StrUtil.hasBlank(htmlTemplateName, textTemplateName)) {
            log.warn("Lost parameters，please check param(htmlBtl, textBtl).");
            return;
        }
        String htmlTemplatePath = mailFacade.loadTemplateResourcePath(lang,
            htmlTemplateName);
        String textTemplatePath = mailFacade.loadTemplateResourcePath(lang,
            textTemplateName);
        primevalMailSend(
            subject,
            beetlTemplate.render(htmlTemplatePath, dict),
            beetlTemplate.render(textTemplatePath, dict),
            to);
    }

    private Properties loadSubjectProperties(final String locale) {
        try {
            return mailFacade.getSubjectProperties(locale);
        } catch (IOException e) {
            log.error("load subject error", e);
            throw new BusinessException("Fail to Send Email");
        }
    }

    /**
     * notify.
     *
     * @param subject subject
     * @param textBtl textBtl
     */
    public void notify(final String subject, final String textBtl) {
        this.notify(
            emailSendProperties.getPersonal(),
            subject,
            null,
            null,
            textBtl,
            Collections.singletonList("devops@apitable.com"));
    }

    /**
     * notify.
     *
     * @param personal    personal
     * @param subject     subject
     * @param subjectType subjectType
     * @param dict        dict
     * @param textBtl     textBtl
     * @param to          to
     */
    public void notify(
        final String personal,
        final String subject,
        final String subjectType,
        final Dict dict,
        final String textBtl,
        final List<String> to
    ) {
        if (cloudMailSender != null) {
            CloudEmailMessage message = new CloudEmailMessage();
            message.setSubject(subject);
            message.setPersonal(personal);
            message.setTo(to);
            JSONObject obj = JSONUtil.createObj();
            if (subjectType != null) {
                message.setTemplateId(
                    mailFacade.getCloudMailTemplateId(null, subjectType));
                obj.putAll(dict);
            } else {
                message.setTemplateId(
                    mailFacade.getCloudMailTemplateId(null, SUBJECT_WARN_NOTIFY));
                obj.putOpt("content", textBtl);
            }
            message.setTemplateData(obj.toString());
            cloudMailSender.send(message);
            return;
        }
        if (mailTemplate == null) {
            throw new BusinessException(
                "The SMTP server is not configured, so emails cannot be sent.");
        }
        EmailMessage emailMessage = new EmailMessage();
        emailMessage.setPersonal(personal);
        emailMessage.setFrom(emailSendProperties.getFrom());
        emailMessage.setSubject(subject);
        emailMessage.setTo(to);
        if (subjectType != null) {
            return;
        }
        if (textBtl != null) {
            emailMessage.setPlainText(textBtl);
        }
        try {
            mailTemplate.send(emailMessage);
        } catch (Exception e) {
            throw new BusinessException(e.getMessage());
        }
    }

    private void cloudMailSend(
        final String subject,
        final String lang,
        final String subjectType,
        final Dict dict,
        final List<String> to
    ) {
        CloudEmailMessage message = new CloudEmailMessage();
        message.setSubject(subject);
        message.setPersonal(emailSendProperties.getPersonal());
        message.setTo(to);
        message.setTemplateId(mailFacade.getCloudMailTemplateId(lang, subjectType));
        JSONObject obj = JSONUtil.createObj();
        obj.putAll(dict);
        message.setTemplateData(obj.toString());
        cloudMailSender.send(message);
    }

    private void primevalMailSend(
        final String subject,
        final String htmlBody,
        final String plainText,
        final List<String> to
    ) {
        EmailMessage[] messages = new EmailMessage[to.size()];
        for (int i = 0; i < to.size(); i++) {
            EmailMessage emailMessage = new EmailMessage();
            emailMessage.setPersonal(emailSendProperties.getPersonal());
            emailMessage.setFrom(emailSendProperties.getFrom());
            emailMessage.setSubject(subject);
            emailMessage.setTo(Collections.singletonList(to.get(i)));
            emailMessage.setPlainText(plainText);
            emailMessage.setHtmlText(htmlBody);
            messages[i] = emailMessage;
        }
        try {
            mailTemplate.send(messages);
        } catch (Exception e) {
            throw new BusinessException(e.getMessage());
        }
    }

    /**
     * mail with lang.
     */
    @Data
    @NoArgsConstructor
    public static class MailWithLang {

        private String locale;

        private String to;

        /**
         * constructor.
         *
         * @param targetLocale targetLocale
         * @param email        email
         */
        public MailWithLang(final String targetLocale, final String email) {
            this.locale = targetLocale;
            this.to = email;
        }

        /**
         * convert.
         *
         * @param data   data
         * @param mapper mapper
         * @param <T>    T
         * @return list
         */
        public static <T> List<MailWithLang> convert(
            final List<T> data,
            final Function<? super T, ? extends MailWithLang> mapper
        ) {
            return Optional.ofNullable(data).orElseGet(ArrayList::new).stream()
                .map(mapper)
                .collect(toList());
        }
    }

    static final class MailText {

        @Getter
        private String htmlTemplateName;

        @Getter
        private String textTemplateName;

        @Getter
        private final String subjectType;

        @Getter
        private final Dict subjectDict;

        MailText(final String type, final Dict dict) {
            this.subjectType = type;
            this.subjectDict = dict;
        }

        public MailText getTemplate() {
            // switch email template
            switch (this.subjectType) {
                case SUBJECT_MEMBER_APPLY_CLOSE_ACCOUNT:
                    this.htmlTemplateName = "member-applied-to-close-account-html.btl";
                    this.textTemplateName = "member-applied-to-close-account-text.btl";
                    break;
                case SUBJECT_ADD_SUB_ADMIN:
                    this.htmlTemplateName = "add-sub-admin-html.btl";
                    this.textTemplateName = "add-sub-admin-text.btl";
                    break;
                case SUBJECT_REMOVE_SUB_ADMIN:
                    this.htmlTemplateName = "changed-ordinary-user-html.btl";
                    this.textTemplateName = "changed-ordinary-user-text.btl";
                    break;
                case SUBJECT_ASSIGN_GROUP:
                    this.htmlTemplateName = "assigned-to-group-html.btl";
                    this.textTemplateName = "assigned-to-group-text.btl";
                    break;
                case SUBJECT_ASSIGN_ROLE:
                    this.htmlTemplateName = "assigned-to-role-html.btl";
                    this.textTemplateName = "assigned-to-role-text.btl";
                    break;
                case SUBJECT_REMOVE_ROLE:
                    this.htmlTemplateName = "remove-from-role-html.btl";
                    this.textTemplateName = "remove-from-role-text.btl";
                    break;
                case SUBJECT_ACCEPT_INVITE:
                    this.htmlTemplateName = "accept-invite-html.btl";
                    this.textTemplateName = "accept-invite-text.btl";
                    break;
                case SUBJECT_INVITE_NOTIFY:
                    this.htmlTemplateName = "invite-email-html.btl";
                    this.textTemplateName = "invite-email-text.btl";
                    break;
                case SUBJECT_REMOVE_MEMBER:
                    this.htmlTemplateName = "remove-member-html.btl";
                    this.textTemplateName = "remove-member-text.btl";
                    break;
                case SUBJECT_DATASHEET_REMIND:
                    this.htmlTemplateName = "remind-member-html.btl";
                    this.textTemplateName = "remind-member-text.btl";
                    break;
                case SUBJECT_SPACE_APPLY:
                    this.htmlTemplateName = "space-apply-html.btl";
                    this.textTemplateName = "space-apply-text.btl";
                    break;
                case SUBJECT_SPACE_APPLY_APPROVE:
                    this.htmlTemplateName = "space-apply-approved-html.btl";
                    this.textTemplateName = "space-apply-approved-text.btl";
                    break;
                case SUBJECT_SPACE_APPLY_REFUSE:
                    this.htmlTemplateName = "space-apply-refused-html.btl";
                    this.textTemplateName = "space-apply-refused-text.btl";
                    break;
                case SUBJECT_SPACE_BETA_FEATURE_APPLY_SUCCESS:
                    this.htmlTemplateName = "apply-space-beta-feature-success-html.btl";
                    this.textTemplateName = "apply-space-beta-feature-success-text.btl";
                    break;
                case SUBJECT_SPACE_CERTIFICATION_NOTIFY:
                    this.htmlTemplateName = "space-certification-notify-html.btl";
                    this.textTemplateName = "space-certification-notify-text.btl";
                    break;
                case SUBJECT_SPACE_CERTIFICATION_FAIL_NOTIFY:
                    this.htmlTemplateName = "space-certification-fail-notify-html.btl";
                    this.textTemplateName = "space-certification-fail-notify-text.btl";
                    break;
                case SUBJECT_RECORD_COMMENT:
                    this.htmlTemplateName = "remind-comment-html.btl";
                    this.textTemplateName = "remind-comment-text.btl";
                    break;
                case SUBJECT_WIDGET_UNPUBLISH_NOTIFY:
                    this.htmlTemplateName = "widget-unpublish-notify-html.btl";
                    this.textTemplateName = "widget-unpublish-notify-text.btl";
                    break;
                case SUBJECT_WIDGET_UNPUBLISH_GLOBAL_NOTIFY:
                    this.htmlTemplateName = "widget-unpublish-global-notify-html.btl";
                    this.textTemplateName = "widget-unpublish-global-notify-text.btl";
                    break;
                case SUBJECT_WIDGET_TRANSFER_NOTIFY:
                    this.htmlTemplateName = "widget-transfer-notify-html.btl";
                    this.textTemplateName = "widget-transfer-notify-text.btl";
                    break;
                case SUBJECT_CHANGE_ADMIN:
                    this.htmlTemplateName = "admin-notify-html.btl";
                    this.textTemplateName = "admin-notify-text.btl";
                    break;
                case SUBJECT_VERIFY_CODE:
                    this.htmlTemplateName = "verification-code-html.btl";
                    this.textTemplateName = "verification-code-text.btl";
                    break;
                case SUBJECT_REGISTER:
                    this.htmlTemplateName = "register-email-html.btl";
                    this.textTemplateName = "register-email-text.btl";
                    break;
                case SUBJECT_CAPACITY_FULL:
                    this.htmlTemplateName = "capacity-full-html.btl";
                    this.textTemplateName = "capacity-full-text.btl";
                    break;
                case SUBJECT_PAI_SUCCESS:
                    this.htmlTemplateName = "pay-success-html.btl";
                    this.textTemplateName = "pay-success-text.btl";
                    break;
                case SUBJECT_ADD_RECORD_SOON_LIMITED:
                    this.htmlTemplateName = "add-record-reaching-limited-html.btl";
                    this.textTemplateName = "add-record-reaching-limited-text.btl";
                    break;
                case SUBJECT_ADD_RECORD_LIMITED:
                    this.htmlTemplateName = "add-record-reached-limited-html.btl";
                    this.textTemplateName = "add-record-reached-limited-text.btl";
                    break;
                case SUBJECT_WIDGET_SUBMIT_SUCCESS:
                    this.htmlTemplateName = "widget-submit-success-html.btl";
                    this.textTemplateName = "widget-submit-success-text.btl";
                    break;
                case SUBJECT_WIDGET_SUBMIT_FAIL:
                    this.htmlTemplateName = "widget-submit-fail-html.btl";
                    this.textTemplateName = "widget-submit-fail-text.btl";
                    break;
                case SUBJECT_WIDGET_QUALIFICATION_AUTH_SUCCESS:
                    this.htmlTemplateName = "widget-qualification-auth-success-html.btl";
                    this.textTemplateName = "widget-qualification-auth-success-text.btl";
                    break;
                case SUBJECT_WIDGET_QUALIFICATION_AUTH_FAIL:
                    this.htmlTemplateName = "widget-qualification-auth-fail-html.btl";
                    this.textTemplateName = "widget-qualification-auth-fail-text.btl";
                    break;
                case SUBJECT_TASK_REMINDER:
                    htmlTemplateName = "task-reminder-html.btl";
                    textTemplateName = "task-reminder-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_RECORD_CELL_UPDATED:
                    htmlTemplateName = "subscribed-record-cell-updated-html.btl";
                    textTemplateName = "subscribed-record-cell-updated-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_RECORD_COMMENTED:
                    htmlTemplateName = "subscribed-record-commented-html.btl";
                    textTemplateName = "subscribed-record-commented-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_DATASHEET_LIMIT:
                    htmlTemplateName = "subscribed-datasheet-limit-html.btl";
                    textTemplateName = "subscribed-datasheet-limit-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_DATASHEET_RECORD_LIMIT:
                    htmlTemplateName = "subscribed-datasheet-record-html.btl";
                    textTemplateName = "subscribed-datasheet-record-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_CAPACITY_LIMIT:
                    htmlTemplateName = "subscribed-capacity-html.btl";
                    textTemplateName = "subscribed-capacity-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_SEATS_LIMIT:
                    htmlTemplateName = "subscribed-seats-limit-html.btl";
                    textTemplateName = "subscribed-seats-limit-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_RECORD_LIMIT:
                    htmlTemplateName = "subscribed-record-limit-html.btl";
                    textTemplateName = "subscribed-record-limit-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_API_LIMIT:
                    htmlTemplateName = "subscribed-api-limit-html.btl";
                    textTemplateName = "subscribed-api-limit-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_CALENDAR_LIMIT:
                    htmlTemplateName = "subscribed-calendar-limit-html.btl";
                    textTemplateName = "subscribed-calendar-limit-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_FORM_LIMIT:
                    htmlTemplateName = "subscribed-form-limit-html.btl";
                    textTemplateName = "subscribed-form-limit-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_MIRROR_LIMIT:
                    htmlTemplateName = "subscribed-mirror-limit-html.btl";
                    textTemplateName = "subscribed-mirror-limit-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_GANNT_LIMIT:
                    htmlTemplateName = "subscribed-gannt-limit-html.btl";
                    textTemplateName = "subscribed-gannt-limit-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_FIELD_PERMISSION_LIMIT:
                    htmlTemplateName = "subscribed-field-permission-limit-html.btl";
                    textTemplateName = "subscribed-field-permission-limit-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_FILE_PERMISSION_LIMIT:
                    htmlTemplateName = "subscribed-file-permission-limit-html.btl";
                    textTemplateName = "subscribed-file-permission-limit-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_ADMIN_LIMIT:
                    htmlTemplateName = "subscribed-admin-limit-html.btl";
                    textTemplateName = "subscribed-admin-limit-text.btl";
                    break;
                case SUBJECT_AUTOMATION_ERROR:
                    htmlTemplateName = "automation-fail-html.btl";
                    textTemplateName = "automation-fail-text.btl";
                    break;
                default:
                    htmlTemplateName =
                        CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_HYPHEN, this.subjectType)
                            + "-html.btl";
                    textTemplateName =
                        CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_HYPHEN, this.subjectType)
                            + "-text.btl";
                    break;
            }
            return this;
        }
    }
}
