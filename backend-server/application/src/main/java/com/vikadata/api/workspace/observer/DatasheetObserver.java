package com.vikadata.api.workspace.observer;

import com.vikadata.api.workspace.observer.remind.NotifyDataSheetMeta;

public interface DatasheetObserver {

    void sendNotify(NotifyDataSheetMeta meta);

}
