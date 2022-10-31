package com.vikadata.api.listener;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.date.DatePattern;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.notification.INotificationFactory;
import com.vikadata.api.enums.notification.EventType;
import com.vikadata.api.event.NotificationCreateEvent;
import com.vikadata.api.model.dto.player.NotificationModelDto;
import com.vikadata.api.model.vo.player.NotificationDetailVo;
import com.vikadata.api.modular.player.service.IPlayerNotificationService;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.entity.PlayerNotificationEntity;
import com.vikadata.integration.socketio.SocketClientTemplate;

import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import static com.vikadata.api.config.AsyncTaskExecutorConfig.DEFAULT_EXECUTOR_BEAN_NAME;

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
                NotificationModelDto dto =
                        BeanUtil.fillBeanWithMapIgnoreCase(BeanUtil.beanToMap(entity), new NotificationModelDto(), false);
                NotificationDetailVo detailVo = notificationService.formatDetailVos(ListUtil.toList(dto), uuid).get(0);
                detailVo.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_PATTERN)));
                detailVo.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_PATTERN)));
                detailVo.setIsRead(0);
                socketClientTemplate.emit(EventType.NOTIFY.name(), notificationFactory.getJsonObject(detailVo));
            }
        });
    }
}
