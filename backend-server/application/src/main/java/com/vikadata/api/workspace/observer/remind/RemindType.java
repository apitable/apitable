package com.vikadata.api.workspace.observer.remind;

/**
 * <p>
 * remind type
 * </p>
 *
 * @author zoe zheng
 */
public enum RemindType {

    MEMBER(1),

    COMMENT(2);

    private final int remindType;

    RemindType(int remindType) {
        this.remindType = remindType;
    }

    public int getRemindType() {
        return remindType;
    }

    public static RemindType of(int remindType) {
        for (RemindType value : RemindType.values()) {
            if (value.getRemindType() == remindType) {
                return value;
            }
        }
        throw new IllegalStateException("Remind Type Can not parse");
    }
}
