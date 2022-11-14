package com.vikadata.api.shared.listener;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.date.DatePattern;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.socketio.core.SocketClientTemplate;
import com.vikadata.api.shared.component.notification.INotificationFactory;
import com.vikadata.api.shared.component.notification.EventType;
import com.vikadata.api.shared.listener.event.NotificationCreateEvent;
import com.vikadata.api.player.dto.NotificationModelDTO;
import com.vikadata.api.player.vo.NotificationDetailVo;
import com.vikadata.api.player.service.IPlayerNotificationService;
import com.vikadata.api.user.mapper.UserMapper;
import com.vikadata.entity.PlayerNotificationEntity;

import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import static com.vikadata.api.shared.config.AsyncTaskExecutorConfig.DEFAULT_EXECUTOR_BEAN_NAME;

/**
 * <p>
 * notification creation listener
 * </p>
 *
 * @author zoe zheng
 */
@Slf4j
@Component
public class NotificationCreateListener implements ApplicationListener<NotificationCreateEvent> {

    @Resource
    private IPlayerNotificationService notificationService;

    @Resource
    private SocketClientTemplate socketClientTemplate;

    @Resource
    private UserMapper userMapper;

    @Resource
    private INotificationFactory notificationFactory;

    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Override
    public void onApplicationEvent(NotificationCreateEvent event) {
        List<PlayerNotificationEntity> entityList = event.getEntityList();
        entityList.forEach(entity -> {
            String uuid = userMapper.selectUuidById(entity.getToUser());
            if (StrUtil.isNotBlank(uuid)) {
                NotificationModelDTO dto =
                        BeanUtil.fillBeanWithMapIgnoreCase(BeanUtil.beanToMap(entity), new NotificationModelDTO(), false);
                NotificationDetailVo detailVo = notificationService.formatDetailVos(ListUtil.toList(dto), uuid).get(0);
                detailVo.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_PATTERN)));
                detailVo.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_PATTERN)));
                detailVo.setIsRead(0);
                socketClientTemplate.emit(EventType.NOTIFY.name(), notificationFactory.getJsonObject(detailVo));
            }
        });
    }
}
