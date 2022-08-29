package com.vikadata.api.component.notification;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import javax.annotation.Resource;

import cn.hutool.core.io.IoUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.model.ro.player.NotificationCreateRo;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.core.io.ClassPathResource;

/**
 * <p>
 *  单元测试--通知测试
 * </p>
 * @author zoe zheng
 * @date 2022/3/17 18:06
 */
@Slf4j
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Disabled("非必需")
public class NotificationManagerTest extends AbstractIntegrationTest {
    @Resource
    private NotificationFactory notifyFactory;

    @Test
    public void testIsvWecomTaskReminderNotify() {
        NotificationCreateRo ro = getNotifyBody("notification/task_reminder_isv_wecom.json");
        Assertions.assertNotNull(ro, "录入数据无法解析:task_reminder_isv_wecom");
        SocialNotifyContext context = notifyFactory.buildSocialNotifyContext(ro.getSpaceId());
        try {
            NotificationManager.me().socialNotify(ro, context);
        }
        catch (Exception e) {
            Assertions.fail("发送企业微信ISV通知失败" + e.getMessage());
        }
    }

    @Test
    public void testWecomTaskReminderNotify() {
        NotificationCreateRo ro = getNotifyBody("notification/task_reminder_wecom.json");
        Assertions.assertNotNull(ro, "录入数据无法解析:task_reminder_wecom");
        SocialNotifyContext context = notifyFactory.buildSocialNotifyContext(ro.getSpaceId());
        try {
            NotificationManager.me().socialNotify(ro, context);
        }
        catch (Exception e) {
            Assertions.fail("发送企业微信ISV通知失败" + e.getMessage());
        }
    }

    @Test
    public void testWecomRecordMemberReminderNotify() {
        NotificationCreateRo ro = getNotifyBody("notification/record_member_reminder_wecom.json");
        Assertions.assertNotNull(ro, "录入数据无法解析:record_member_reminder_wecom");
        SocialNotifyContext context = notifyFactory.buildSocialNotifyContext(ro.getSpaceId());
        try {
            NotificationManager.me().socialNotify(ro, context);
        }
        catch (Exception e) {
            Assertions.fail("发送企业微信ISV通知失败" + e.getMessage());
        }
    }

    @Test
    public void testLarkIsvRecordMemberReminderNotify() {
        NotificationCreateRo ro = getNotifyBody("notification/record_member_reminder_isv_lark.json");
        Assertions.assertNotNull(ro, "录入数据无法解析:record_member_reminder_isv_lark");
        SocialNotifyContext context = notifyFactory.buildSocialNotifyContext(ro.getSpaceId());
        try {
            NotificationManager.me().socialNotify(ro, context);
        }
        catch (Exception e) {
            Assertions.fail("发送飞书SV通知失败" + e.getMessage());
        }
    }

    @Test
    public void testLarkRecordMemberReminderNotify() {
        NotificationCreateRo ro = getNotifyBody("notification/record_member_reminder_lark.json");
        Assertions.assertNotNull(ro, "录入数据无法解析:record_member_reminder_lark");
        SocialNotifyContext context = notifyFactory.buildSocialNotifyContext(ro.getSpaceId());
        try {
            NotificationManager.me().socialNotify(ro, context);
        }
        catch (Exception e) {
            Assertions.fail("发送飞书SV通知失败" + e.getMessage());
        }
    }


    @Test
    public void testLarkIsvTaskReminderNotify() {
        NotificationCreateRo ro = getNotifyBody("notification/task_reminder_isv_lark.json");
        Assertions.assertNotNull(ro, "录入数据无法解析:task_reminder_isv_lark");
        SocialNotifyContext context = notifyFactory.buildSocialNotifyContext(ro.getSpaceId());
        try {
            NotificationManager.me().socialNotify(ro, context);
        }
        catch (Exception e) {
            Assertions.fail("发送飞书SV通知失败" + e.getMessage());
        }
    }

    @Test
    public void testLarkTaskReminderNotify() {
        NotificationCreateRo ro = getNotifyBody("notification/task_reminder_lark.json");
        Assertions.assertNotNull(ro, "录入数据无法解析:task_reminder_lark");
        SocialNotifyContext context = notifyFactory.buildSocialNotifyContext(ro.getSpaceId());
        try {
            NotificationManager.me().socialNotify(ro, context);
        }
        catch (Exception e) {
            Assertions.fail("发送飞书SV通知失败" + e.getMessage());
        }
    }

    @Test
    public void testCenterTaskReminderNotify() {
        NotificationCreateRo ro = getNotifyBody("notification/task_reminder_center.json");
        Assertions.assertNotNull(ro, "录入数据无法解析:task_reminder_center");
        try {
            NotificationManager.me().centerNotify(ro);
        }
        catch (Exception e) {
            Assertions.fail("发送通知中心通知失败" + e.getMessage());
        }
    }

    private NotificationCreateRo getNotifyBody(String filePath) {
        InputStream resourceAsStream = ClassPathResource.class.getClassLoader().getResourceAsStream(filePath);
        if (resourceAsStream == null) {
            return null;
        }
        String jsonString = IoUtil.read(resourceAsStream, StandardCharsets.UTF_8);
        return JSONUtil.toBean(jsonString, NotificationCreateRo.class);
    }
}
