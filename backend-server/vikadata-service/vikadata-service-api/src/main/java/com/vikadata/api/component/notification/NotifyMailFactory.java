package com.vikadata.api.component.notification;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.config.properties.EmailSendProperties;
import com.vikadata.api.security.email.TencentMailTemplate;
import com.vikadata.boot.autoconfigure.beetl.BeetlTemplate;
import com.vikadata.boot.autoconfigure.mail.EmailMessage;
import com.vikadata.boot.autoconfigure.mail.MailTemplate;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.integration.mail.CloudEmailMessage;
import com.vikadata.integration.mail.CloudMailSender;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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
import static java.util.stream.Collectors.toList;

/**
 * <p>
 * Notification Mail Factory
 * </p>
 *
 * @author Shawn Deng
 */
@Slf4j
@Component
public class NotifyMailFactory {

    @Resource
    private BeetlTemplate beetlTemplate;

    @Resource
    private EmailSendProperties properties;

    @Autowired(required = false)
    private CloudMailSender cloudMailSender;

    @Autowired(required = false)
    private MailTemplate mailTemplate;

    public static NotifyMailFactory me() {
        return SpringContextHolder.getBean(NotifyMailFactory.class);
    }

    public void sendMail(String subjectType, Dict dict, List<MailWithLang> tos) {
        this.sendMail(subjectType, null, dict, tos);
    }

    public void sendMail(String subjectType, Dict subjectDict, Dict dict, List<MailWithLang> tos) {
        if (ObjectUtil.isNotNull(tos)) {
            Map<String, List<MailWithLang>> tosGroupByLang = tos.stream()
                    .peek(to -> {
                        if (ObjectUtil.isNull(to.getLocale())) {
                            to.setLocale(StrUtil.EMPTY);
                        }
                    })
                    .collect(Collectors.groupingBy(MailWithLang::getLocale));
            tosGroupByLang.forEach((lang, mailWithLanguages) -> {
                final List<String> emails = mailWithLanguages.stream()
                        .map(MailWithLang::getTo)
                        .collect(Collectors.toList());
                sendMail(lang, subjectType, subjectDict, dict, emails);
            });
        }
    }

    public void sendMail(String lang, String subjectType, Dict dict, List<String> to) {
        this.sendMail(lang, subjectType, null, dict, to);
    }

    public void sendMail(String lang, String subjectType, Dict subjectDict, Dict dict, List<String> to) {
        MailText mailText = new MailText(subjectType, subjectDict).getTemplate(lang);

        String htmlBtl = mailText.getHtmlBtl();
        String textBtl = mailText.getTextBtl();
        String subject = mailText.getSubject();

        if (StrUtil.hasBlank(htmlBtl, textBtl, subject)) {
            log.warn("Lost parameters，please check param（htmlBtl, textBtl, subject）.");
            return;
        }
        if (cloudMailSender != null) {
            cloudMailSend(subject, lang, subjectType, dict, to);
            return;
        }
        if (mailTemplate == null) {
            log.warn("Mail service not configured");
            return;
        }
        primevalMailSend(subject, beetlTemplate.render(htmlBtl, dict), beetlTemplate.render(textBtl, dict), to);
    }

    public void notify(String subject, String textBtl) {
        this.notify(properties.getPersonal(), subject, null, null, textBtl, Collections.singletonList("devops@vikadata.com"));
    }

    public void notify(String personal, String subject, String subjectType, Dict dict, String textBtl, List<String> to) {
        if (cloudMailSender != null) {
            CloudEmailMessage message = new CloudEmailMessage();
            message.setSubject(subject);
            message.setPersonal(personal);
            message.setTo(to);
            JSONObject obj = JSONUtil.createObj();
            if (subjectType != null) {
                message.setTemplateId(TencentMailTemplate.getTemplateId(null, subjectType));
                obj.putAll(dict);
            }
            else {
                message.setTemplateId(TencentMailTemplate.getTemplateId(null, SUBJECT_WARN_NOTIFY));
                obj.putOpt("content", textBtl);
            }
            message.setTemplateData(obj.toString());
            cloudMailSender.send(message);
            return;
        }
        if (mailTemplate == null) {
            log.info("Mail service not configured");
            return;
        }
        EmailMessage emailMessage = new EmailMessage();
        emailMessage.setPersonal(personal);
        emailMessage.setSubject(subject);
        emailMessage.setTo(to);
        if (subjectType != null) {
            if (SUBJECT_PUBLISH_NOTIFY.equals(subjectType)) {
                String htmlBody = beetlTemplate.render("publish-version-notify.btl", dict);
                emailMessage.setHtmlText(htmlBody);
            }
            else {
                return;
            }
        }
        if (textBtl != null) {
            emailMessage.setPlainText(textBtl);
        }
        mailTemplate.send(emailMessage);
    }

    private void cloudMailSend(String subject, String lang, String subjectType, Dict dict, List<String> to) {
        CloudEmailMessage message = new CloudEmailMessage();
        message.setSubject(subject);
        message.setPersonal(properties.getPersonal());
        message.setTo(to);
        message.setTemplateId(TencentMailTemplate.getTemplateId(lang, subjectType));
        JSONObject obj = JSONUtil.createObj();
        obj.putAll(dict);
        message.setTemplateData(obj.toString());
        cloudMailSender.send(message);
    }

    private void primevalMailSend(String subject, String htmlBody, String plainText, List<String> to) {
        EmailMessage[] messages = new EmailMessage[to.size()];
        for (int i = 0; i < to.size(); i++) {
            EmailMessage emailMessage = new EmailMessage();
            emailMessage.setPersonal(properties.getPersonal());
            emailMessage.setSubject(subject);
            emailMessage.setTo(Collections.singletonList(to.get(i)));
            emailMessage.setPlainText(plainText);
            emailMessage.setHtmlText(htmlBody);
            messages[i] = emailMessage;
        }
        mailTemplate.send(messages);
    }

    @Data
    @NoArgsConstructor
    public static class MailWithLang {
        private String locale;

        private String to;

        public MailWithLang(String locale, String to) {
            this.locale = locale;
            this.to = to;
        }

        public static <T> List<MailWithLang> convert(List<T> data, Function<? super T, ? extends MailWithLang> mapper) {
            return Optional.ofNullable(data).orElseGet(ArrayList::new).stream().map(mapper).collect(toList());
        }

    }

    final class MailText {

        @Getter
        String htmlBtl;

        @Getter
        String textBtl;

        @Getter
        String subject;

        String subjectType;

        Dict subjectDict;

        public MailText(String subjectType, Dict subjectDict) {
            this.subjectType = subjectType;
            this.subjectDict = subjectDict;
        }

        public MailText getTemplate(String lang) {
            // switch email template
            switch (this.subjectType) {
                case SUBJECT_INVITE_NOTIFY:
                    this.htmlBtl = "invite-email-html.btl";
                    this.textBtl = "invite-email-text.btl";
                    break;
                case SUBJECT_REMOVE_MEMBER:
                    this.htmlBtl = "remove-member-html.btl";
                    this.textBtl = "remove-member-text.btl";
                    break;
                case SUBJECT_DATASHEET_REMIND:
                    this.htmlBtl = "remind-member-html.btl";
                    this.textBtl = "remind-member-text.btl";
                    break;
                case SUBJECT_SPACE_APPLY:
                    this.htmlBtl = "space-apply-html.btl";
                    this.textBtl = "space-apply-text.btl";
                    break;
                case SUBJECT_RECORD_COMMENT:
                    this.htmlBtl = "remind-comment-html.btl";
                    this.textBtl = "remind-comment-text.btl";
                    break;
                case SUBJECT_WIDGET_UNPUBLISH_NOTIFY:
                    this.htmlBtl = "widget-unpublish-notify-html.btl";
                    this.textBtl = "widget-unpublish-notify-text.btl";
                    break;
                case SUBJECT_WIDGET_UNPUBLISH_GLOBAL_NOTIFY:
                    this.htmlBtl = "widget-unpublish-global-notify-html.btl";
                    this.textBtl = "widget-unpublish-global-notify-text.btl";
                    break;
                case SUBJECT_WIDGET_TRANSFER_NOTIFY:
                    this.htmlBtl = "widget-transfer-notify-html.btl";
                    this.textBtl = "widget-transfer-notify-text.btl";
                    break;
                case SUBJECT_CHANGE_ADMIN:
                    this.htmlBtl = "admin-notify-html.btl";
                    this.textBtl = "admin-notify-text.btl";
                    break;
                case SUBJECT_VERIFY_CODE:
                    this.htmlBtl = "verification-code-html.btl";
                    this.textBtl = "verification-code-text.btl";
                    break;
                case SUBJECT_REGISTER:
                    this.htmlBtl = "register-email-html.btl";
                    this.textBtl = "register-email-text.btl";
                    break;
                case SUBJECT_CAPACITY_FULL:
                    this.htmlBtl = "capacity-full-html.btl";
                    this.textBtl = "capacity-full-text.btl";
                    break;
                case SUBJECT_PAI_SUCCESS:
                    this.htmlBtl = "pay-success-html.btl";
                    this.textBtl = "pay-success-text.btl";
                    break;
                case SUBJECT_ADD_RECORD_SOON_LIMITED:
                    this.htmlBtl = "add-record-reaching-limited-html.btl";
                    this.textBtl = "add-record-reaching-limited-text.btl";
                    break;
                case SUBJECT_ADD_RECORD_LIMITED:
                    this.htmlBtl = "add-record-reached-limited-html.btl";
                    this.textBtl = "add-record-reached-limited-text.btl";
                    break;
                case SUBJECT_WIDGET_SUBMIT_SUCCESS:
                    this.htmlBtl = "widget-submit-success-html.btl";
                    this.textBtl = "widget-submit-success-text.btl";
                    break;
                case SUBJECT_WIDGET_SUBMIT_FAIL:
                    this.htmlBtl = "widget-submit-fail-html.btl";
                    this.textBtl = "widget-submit-fail-text.btl";
                    break;
                case SUBJECT_WIDGET_QUALIFICATION_AUTH_SUCCESS:
                    this.htmlBtl = "widget-qualification-auth-success-html.btl";
                    this.textBtl = "widget-qualification-auth-success-text.btl";
                    break;
                case SUBJECT_WIDGET_QUALIFICATION_AUTH_FAIL:
                    this.htmlBtl = "widget-qualification-auth-fail-html.btl";
                    this.textBtl = "widget-qualification-auth-fail-text.btl";
                    break;
                case SUBJECT_TASK_REMINDER:
                    htmlBtl = "task-reminder-html.btl";
                    textBtl = "task-reminder-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_RECORD_CELL_UPDATED:
                    htmlBtl = "subscribed-record-cell-updated-html.btl";
                    textBtl = "subscribed-record-cell-updated-text.btl";
                    break;
                case SUBJECT_SUBSCRIBED_RECORD_COMMENTED:
                    htmlBtl = "subscribed-record-commented-html.btl";
                    textBtl = "subscribed-record-commented-text.btl";
                    break;
                default:
                    break;
            }

            String subjectUrl = null;
            if (StrUtil.isNotBlank(lang) && !Locale.SIMPLIFIED_CHINESE.toLanguageTag().equals(lang)) {
                // Mail Internationalization
                this.htmlBtl = StrUtil.format("{}/{}", lang, this.htmlBtl);
                this.textBtl = StrUtil.format("{}/{}", lang, this.textBtl);
                subjectUrl = StrUtil.format("{}.{}", this.subjectType, lang);
            }
            // mail subject
            this.subject = StrUtil.format(properties.getProperties().get(subjectUrl != null ? subjectUrl : this.subjectType), this.subjectDict);
            return this;
        }

    }

}
