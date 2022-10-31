package com.vikadata.api.modular.workspace.observer;

import com.vikadata.api.modular.workspace.observer.remind.NotifyDataSheetMeta;

public interface DatasheetObserver {

    void sendNotify(NotifyDataSheetMeta meta);

}
