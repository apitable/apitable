package com.vikadata.api.mail;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

import cn.hutool.core.lang.Dict;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;

import com.vikadata.api.component.LanguageManager;
import com.vikadata.api.config.properties.EmailSendProperties;
import com.vikadata.api.constants.MailPropConstants;
import com.vikadata.api.component.notification.NotifyMailFactory;
import com.vikadata.api.util.IdUtil;
import com.vikadata.boot.autoconfigure.beetl.BeetlAutoConfiguration;
import com.vikadata.boot.autoconfigure.mail.CloudMailAutoConfiguration;
import com.vikadata.boot.autoconfigure.mail.MailAutoConfiguration;
import com.vikadata.boot.autoconfigure.mail.TencentMailAutoConfiguration;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;

import org.springframework.boot.autoconfigure.mail.MailSenderAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

/**
 * <p>
 * 测试邮件发送
 * </p>
 *
 * @author Pengap
 * @date 2022/3/21 23:07:44
 */
@Disabled("简单测试邮件模版样式，非必需")
@SpringJUnitConfig({
        BeetlAutoConfiguration.class,
        MailSenderAutoConfiguration.class,
        TencentMailAutoConfiguration.class,
        MailAutoConfiguration.class,
        CloudMailAutoConfiguration.class,
})
@TestPropertySource("classpath:default.properties")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, classes = {
        EmailSendProperties.class,
        SpringContextHolder.class,
        NotifyMailFactory.class
})
public class SendMailTest {

    private final Dict dict = Dict.create();

    private final static String NOTICE_EMAIL = "penganping@vikadata.com";

    @BeforeEach
    void init() {
        dict.set("YEARS", LocalDate.now().getYear());
    }

    @Test
    @Order(1)
    public void sendWidgetQualificationAuthSuccessMail() {
        String subjectType = MailPropConstants.SUBJECT_WIDGET_QUALIFICATION_AUTH_SUCCESS;

        dict.set("GLOBAL_PACKAGE_ID", IdUtil.createWidgetPackageId());

        String lang = LanguageManager.me().getDefaultLanguageTag();
        List<String> to = Collections.singletonList(NOTICE_EMAIL);

        Assertions.assertDoesNotThrow(() -> NotifyMailFactory.me().sendMail(lang, subjectType, dict, to));
    }

    @Test
    @Order(2)
    public void sendWidgetQualificationAuthFailMail() {
        String subjectType = MailPropConstants.SUBJECT_WIDGET_QUALIFICATION_AUTH_FAIL;

        dict.set("IDENTITY_VERIFY_FAIL_REASON", "小程序开发者主体资质认证失败");

        String lang = LanguageManager.me().getDefaultLanguageTag();
        List<String> to = Collections.singletonList(NOTICE_EMAIL);

        Assertions.assertDoesNotThrow(() -> NotifyMailFactory.me().sendMail(lang, subjectType, dict, to));
    }

    @Test
    @Order(3)
    public void sendWidgetSubmitSuccessMail() {
        String subjectType = MailPropConstants.SUBJECT_WIDGET_SUBMIT_SUCCESS;

        dict.set("WIDGET_NAME", "小程序A");
        dict.set("WIDGET_VERSION", "1.0.0");

        List<String> to = Collections.singletonList(NOTICE_EMAIL);

        Assertions.assertAll(
                () -> NotifyMailFactory.me().sendMail(Locale.SIMPLIFIED_CHINESE.toLanguageTag(), subjectType, dict, to),
                () -> NotifyMailFactory.me().sendMail(Locale.US.toLanguageTag(), subjectType, dict, to)
        );
    }

    @Test
    @Order(4)
    public void sendWidgetSubmitFailMail() {
        String subjectType = MailPropConstants.SUBJECT_WIDGET_SUBMIT_FAIL;

        dict.set("WIDGET_NAME", "小程序A");
        dict.set("WIDGET_VERSION", "1.0.0");
        dict.set("WIDGET_EVALUATE_FAIL_REASON", "小程序A上架失败");

        List<String> to = Collections.singletonList(NOTICE_EMAIL);

        Assertions.assertAll(
                () -> NotifyMailFactory.me().sendMail(Locale.SIMPLIFIED_CHINESE.toLanguageTag(), subjectType, dict, to),
                () -> NotifyMailFactory.me().sendMail(Locale.US.toLanguageTag(), subjectType, dict, to)
        );
    }

    @Test
    @Order(5)
    public void sendWidgetUnpublishNotifyMail() {
        String subjectType = MailPropConstants.SUBJECT_WIDGET_UNPUBLISH_NOTIFY;

        dict.set("SPACE_NAME", "空间站A");
        dict.set("WIDGET_NAME", "小程序A");

        Dict mapDict = Dict.create();
        mapDict.set("WIDGET_NAME", "小程序A");

        List<String> to = Collections.singletonList(NOTICE_EMAIL);

        Assertions.assertAll(
                () -> NotifyMailFactory.me().sendMail(Locale.SIMPLIFIED_CHINESE.toLanguageTag(), subjectType, mapDict, dict, to),
                () -> NotifyMailFactory.me().sendMail(Locale.US.toLanguageTag(), subjectType, mapDict, dict, to)
        );
    }

    @Test
    @Order(6)
    public void sendWidgetTransferNotifyMail() {
        String subjectType = MailPropConstants.SUBJECT_WIDGET_TRANSFER_NOTIFY;

        dict.set("SPACE_NAME", "空间站A");
        dict.set("WIDGET_NAME", "小程序A");
        dict.set("MEMBER_NAME", "成员A");

        Dict mapDict = Dict.create();
        mapDict.set("WIDGET_NAME", "小程序A");

        List<String> to = Collections.singletonList(NOTICE_EMAIL);

        Assertions.assertAll(
                () -> NotifyMailFactory.me().sendMail(Locale.SIMPLIFIED_CHINESE.toLanguageTag(), subjectType, mapDict, dict, to),
                () -> NotifyMailFactory.me().sendMail(Locale.US.toLanguageTag(), subjectType, mapDict, dict, to)
        );
    }

    @Test
    @Order(7)
    public void sendWidgetUnpublishGlobalNotifyMail() {
        String subjectType = MailPropConstants.SUBJECT_WIDGET_UNPUBLISH_GLOBAL_NOTIFY;

        dict.set("WIDGET_NAME", "小程序A");

        Dict mapDict = Dict.create();
        mapDict.set("WIDGET_NAME", "小程序A");

        List<String> to = Collections.singletonList(NOTICE_EMAIL);

        Assertions.assertAll(
                () -> NotifyMailFactory.me().sendMail(Locale.SIMPLIFIED_CHINESE.toLanguageTag(), subjectType, mapDict, dict, to),
                () -> NotifyMailFactory.me().sendMail(Locale.US.toLanguageTag(), subjectType, mapDict, dict, to)
        );
    }

}
