package com.vikadata.api.component.notification.subject;

import com.vikadata.api.model.ro.player.NotificationCreateRo;

public class SocialNotifySubject extends NotifySubject<SocialNotifyContext> {

    @Override
    public void setContext(SocialNotifyContext context) {
        this.context = context;
    }

    @Override
    public void send(NotificationCreateRo ro) {
        notifyObserver(ro);
    }
}
