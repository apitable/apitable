package com.vikadata.api.modular.workspace.observer;

import java.util.ArrayList;
import java.util.List;

import com.vikadata.api.modular.workspace.observer.remind.NotifyDataSheetMeta;

/**
 * <p>
 * 可观察者，空间站@成员、评论成员主题
 * </p>
 *
 * @author Pengap
 * @date 2021/10/9 11:41:28
 */
public class RemindMemberOpSubject implements DatasheetObservable {

    private List<DatasheetObserver> observers;

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

    public void sendNotify(NotifyDataSheetMeta meta) {
        this.meta = meta;
        // 发送消息
        this.notifyObserver();
    }

}
