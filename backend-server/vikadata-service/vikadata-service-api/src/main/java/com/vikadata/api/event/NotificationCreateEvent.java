package com.vikadata.api.event;

import java.util.List;

import com.vikadata.entity.PlayerNotificationEntity;

import org.springframework.context.ApplicationEvent;

/**
 * <p>
 * Notification Created Event
 * </p>
 *
 * @author zoe zheng
 */
public class NotificationCreateEvent extends ApplicationEvent {

    private static final long serialVersionUID = 3860684909645043466L;

    private List<PlayerNotificationEntity> entityList;

    public NotificationCreateEvent(Object source, List<PlayerNotificationEntity> entities) {
        super(source);
        this.entityList = entities;
    }

    public List<PlayerNotificationEntity> getEntityList() {
        return entityList;
    }
}
