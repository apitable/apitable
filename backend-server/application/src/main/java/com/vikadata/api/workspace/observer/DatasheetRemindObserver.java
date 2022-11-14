package com.vikadata.api.workspace.observer;

import com.vikadata.api.workspace.observer.remind.NotifyDataSheetMeta;
import com.vikadata.api.workspace.observer.remind.RemindSubjectType.RemindSubjectEnum;

public interface DatasheetRemindObserver extends DatasheetObserver {

    RemindSubjectEnum getRemindType();

    void notifyMemberAction(NotifyDataSheetMeta meta);

    void notifyCommentAction(NotifyDataSheetMeta meta);

}
