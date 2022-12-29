package com.vikadata.api.interfaces.social.event;

import com.vikadata.api.player.ro.NotificationCreateRo;

import static com.vikadata.api.interfaces.social.event.CallEventType.NOTIFICATION;

/**
 *
 * @author Shawn Deng
 */
public class NotificationEvent implements SocialEvent {

    private NotificationCreateRo notificationMeta;

    public NotificationEvent(NotificationCreateRo notificationMeta) {
        this.notificationMeta = notificationMeta;
    }

    @Override
    public CallEventType getEventType() {
        return NOTIFICATION;
    }

    public NotificationCreateRo getNotificationMeta() {
        return notificationMeta;
    }
}
