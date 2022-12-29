package com.vikadata.api.shared.component.notification.subject;

import com.vikadata.api.player.ro.NotificationCreateRo;

public class CenterNotifySubject extends NotifySubject<Object> {

    @Override
    public void setContext(Object context) {
        this.context = context;
    }

    @Override
    public void send(NotificationCreateRo ro) {
        notifyObserver(ro);
    }
}
