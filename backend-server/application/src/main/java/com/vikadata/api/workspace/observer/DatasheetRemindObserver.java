package com.vikadata.api.workspace.observer;

import com.vikadata.api.workspace.observer.remind.NotifyDataSheetMeta;
import com.vikadata.api.workspace.observer.remind.RemindChannel;

public interface DatasheetRemindObserver extends DatasheetObserver {

    RemindChannel getRemindType();

    void notifyMemberAction(NotifyDataSheetMeta meta);

    void notifyCommentAction(NotifyDataSheetMeta meta);
}
