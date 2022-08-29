package com.vikadata.api.component.notification;

import java.util.List;

import cn.hutool.core.collection.ListUtil;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.component.notification.observer.DingTalkIsvNotifyObserver;
import com.vikadata.api.component.notification.observer.DingTalkNotifyObserver;
import com.vikadata.api.component.notification.observer.WecomNotifyObserver;
import com.vikadata.system.config.notification.SocialTemplate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

/**
 * <p>
 *  单元测试--第三方通知观察者测试
 * </p>
 * @author zoe zheng
 * @date 2022/3/17 18:06
 */
@Slf4j
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Disabled("非必需")
public class SocialNotifyObserverTest extends AbstractIntegrationTest {

    @Autowired(required = false)
    private WecomNotifyObserver wecomNotifyObserver;

    @Autowired(required = false)
    private DingTalkNotifyObserver dingTalkNotifyObserver;

    @Autowired(required = false)
    private DingTalkIsvNotifyObserver dingTalkIsvNotifyObserver;

    public static final List<String> notificationTemplateIds = ListUtil.toList("task_reminder");

    @Test
    public void testWecomTemplate() {
        if (wecomNotifyObserver != null) {
            notificationTemplateIds.forEach(templateId -> {
                SocialTemplate template = wecomNotifyObserver.getTemplate(templateId);
                Assertions.assertNotNull(template, "没有对应的企业微信模版:" + templateId);
                Assertions.assertNotNull(template.getTemplateString(), "企业微信模版String没有配置");
            });
        }
    }

    @Test
    public void testDingTalkTemplate() {
        if (dingTalkNotifyObserver != null) {
            notificationTemplateIds.forEach(templateId -> {
                SocialTemplate template = dingTalkNotifyObserver.getTemplate(templateId);
                Assertions.assertNotNull(template, "没有对应的钉钉自建应用模版:" + templateId);
                Assertions.assertNotNull(template.getTemplateString(), "钉钉自建应用模版String没有配置");
            });
        }
    }

    @Test
    public void testDingTalkIsvTemplate() {
        if (dingTalkIsvNotifyObserver != null) {
            notificationTemplateIds.forEach(templateId -> {
                SocialTemplate template = dingTalkIsvNotifyObserver.getTemplate(templateId);
                Assertions.assertNotNull(template, "没有对应的钉钉ISV应用模版:" + templateId);
                Assertions.assertNotNull(template.getTemplateString(), "钉钉ISV应用模版String没有配置");
            });
        }
    }
}
