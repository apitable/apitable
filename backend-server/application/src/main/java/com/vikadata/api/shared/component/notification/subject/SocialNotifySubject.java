package com.vikadata.api.shared.component.notification.subject;

import com.vikadata.api.player.ro.NotificationCreateRo;

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
