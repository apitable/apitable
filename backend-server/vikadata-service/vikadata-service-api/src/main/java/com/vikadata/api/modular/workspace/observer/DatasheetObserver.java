package com.vikadata.api.modular.workspace.observer;

import com.vikadata.api.modular.workspace.observer.remind.NotifyDataSheetMeta;

/**
 * <p>
 * 数表观察者
 * </p>
 *
 * @author Pengap
 * @date 2021/10/9 10:56:24
 */
public interface DatasheetObserver {

    void sendNotify(NotifyDataSheetMeta meta);

}
