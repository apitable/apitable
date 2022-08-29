package com.vikadata.api.component.notification.subject;

import java.util.Vector;

import com.vikadata.api.component.notification.observer.NotifyObserver;
import com.vikadata.api.model.ro.player.NotificationCreateRo;

public abstract class NotifySubject<T> {

    /**
     * 发送通知
     */
    public abstract void send(NotificationCreateRo ro);

    public abstract void setContext(T context);

    /**
     * 上下文
     */
    protected T context;

    private final Vector<NotifyObserver> observers = new Vector<>();

    public void addObserver(NotifyObserver observer) {
        if (!observers.contains(observer)) {
            observers.add(observer);
        }
    }

    public void delObserver(NotifyObserver observer) {
        observers.remove(observer);
    }

    /**
     * 通知观察者处理
     * @param ro 通知参数
     */
    protected void notifyObserver(NotificationCreateRo ro) {
        for (NotifyObserver observer : observers) {
            if (observer.isNotify(context)) {
                observer.notify(context, ro);
            }
        }
    }
}
