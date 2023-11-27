/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.component.notification.subject;

import com.apitable.player.ro.NotificationCreateRo;
import com.apitable.shared.component.notification.observer.NotifyObserver;
import java.util.Vector;

/**
 * notify subject.
 *
 * @param <T> context
 */
public abstract class NotifySubject<T> {

    /**
     * send notification.
     */
    public abstract void send(NotificationCreateRo ro);

    public abstract void setContext(T context);

    protected T context;

    private final Vector<NotifyObserver> observers = new Vector<>();

    /**
     * add observer.
     *
     * @param observer observer
     */
    public void addObserver(NotifyObserver observer) {
        if (!observers.contains(observer)) {
            observers.add(observer);
        }
    }

    public void delObserver(NotifyObserver observer) {
        observers.remove(observer);
    }

    /**
     * notify observer processing.
     *
     * @param ro notification parameters
     */
    protected void notifyObserver(NotificationCreateRo ro) {
        for (NotifyObserver observer : observers) {
            if (observer.isNotify(context)) {
                observer.notify(context, ro);
            }
        }
    }
}
