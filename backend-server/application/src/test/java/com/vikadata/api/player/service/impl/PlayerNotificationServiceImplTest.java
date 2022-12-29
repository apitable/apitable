package com.vikadata.api.player.service.impl;

import java.util.Collections;
import java.util.List;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.player.dto.NotificationModelDTO;
import com.vikadata.api.player.service.IPlayerNotificationService;
import com.vikadata.api.shared.component.notification.INotificationFactory;
import com.vikadata.api.shared.component.notification.NotificationManager;
import com.vikadata.api.shared.component.notification.NotificationTemplateId;
import com.vikadata.api.shared.sysconfig.notification.NotificationTemplate;

import org.springframework.beans.factory.annotation.Autowired;

import static com.vikadata.api.shared.constants.NotificationConstants.BODY_EXTRAS;
import static com.vikadata.api.shared.constants.NotificationConstants.EXTRA_TOAST;
import static com.vikadata.api.shared.constants.NotificationConstants.EXTRA_TOAST_URL;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * user notification service test
 * </p>
 */
public class PlayerNotificationServiceImplTest extends AbstractIntegrationTest {
    @Autowired
    private IPlayerNotificationService iPlayerNotificationService;

    @Autowired
    private INotificationFactory notificationFactory;

    @Test
    public void testCreateNewUserWelcomeNotification() {
        Long userId = IdWorker.getId();
        // jump to third site
        NotificationTemplate template =
                notificationFactory.getTemplateById(NotificationTemplateId.NEW_USER_WELCOME_NOTIFY.getValue());
        Dict extras = Dict.create();
        if (StrUtil.isNotBlank(template.getUrl()) && template.getUrl().startsWith("http")) {
            Dict toast = Dict.create();
            toast.put(EXTRA_TOAST_URL, template.getUrl());
            extras.put(EXTRA_TOAST, toast);
        }
        NotificationManager.me().playerNotify(NotificationTemplateId.NEW_USER_WELCOME_NOTIFY,
                Collections.singletonList(userId), 0L, null, extras);
        List<NotificationModelDTO> notify = iPlayerNotificationService.getUserNotificationByTypeAndIsRead(userId,
                0);
        JSONObject extrasObj = JSONUtil.parseObj(notify.get(0).getNotifyBody());
        assertThat(extrasObj.getByPath(BODY_EXTRAS + "." + EXTRA_TOAST + "." + EXTRA_TOAST_URL)).isEqualTo(template.getUrl());

    }
}
