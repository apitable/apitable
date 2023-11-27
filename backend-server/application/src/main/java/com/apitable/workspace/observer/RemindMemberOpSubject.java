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

package com.apitable.workspace.observer;

import com.apitable.workspace.observer.remind.NotifyDataSheetMeta;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * remind observer, space @members, commenting.
 * </p>
 */
public class RemindMemberOpSubject implements DatasheetObservable {

    private final List<DatasheetObserver> observers;

    private NotifyDataSheetMeta meta;

    public RemindMemberOpSubject() {
        observers = new ArrayList<>();
    }

    @Override
    public void registerObserver(DatasheetObserver o) {
        if (null != o && !observers.contains(o)) {
            observers.add(o);
        }
    }

    @Override
    public void removeObserver(DatasheetObserver o) {
        if (null != o && !observers.isEmpty()) {
            observers.remove(o);
        }
    }

    @Override
    public void notifyObserver() {
        for (DatasheetObserver observer : observers) {
            observer.sendNotify(meta);
        }
    }

    /**
     * send notify.
     *
     * @param meta notify meta
     */
    public void sendNotify(NotifyDataSheetMeta meta) {
        this.meta = meta;
        // send message
        this.notifyObserver();
    }

}
