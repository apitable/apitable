package com.vikadata.api.modular.workspace.observer;

import com.vikadata.api.modular.workspace.observer.remind.NotifyDataSheetMeta;
import com.vikadata.api.modular.workspace.observer.remind.RemindSubjectType.RemindSubjectEnum;

/**
 * <p>
 * 数表提醒观察者
 * </p>
 *
 * @author Pengap
 * @date 2021/10/9 11:21:14
 */
public interface DatasheetRemindObserver extends DatasheetObserver {

    RemindSubjectEnum getRemindType();

    void notifyMemberAction(NotifyDataSheetMeta meta);

    void notifyCommentAction(NotifyDataSheetMeta meta);

}
