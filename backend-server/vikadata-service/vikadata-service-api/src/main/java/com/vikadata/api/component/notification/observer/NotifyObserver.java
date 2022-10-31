package com.vikadata.api.component.notification.observer;

import java.util.List;
import java.util.Map;

import com.vikadata.api.model.ro.player.NotificationCreateRo;

public interface NotifyObserver<M, T> {

    boolean isNotify(T context);

    M getTemplate(String templateId);

    <A> A renderTemplate(T context, NotificationCreateRo ro);

    Map<String, Object> bindingMap(NotificationCreateRo ro);

    List<?> toUser(NotificationCreateRo ro);

    void notify(T context, NotificationCreateRo ro);

    void notify(T context, List<NotificationCreateRo> roList);
}
