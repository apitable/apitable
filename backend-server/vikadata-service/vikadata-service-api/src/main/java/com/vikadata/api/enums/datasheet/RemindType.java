package com.vikadata.api.enums.datasheet;

/**
 * <p>
 * remind接口中定义的通知的类型
 * </p>
 *
 * @author zoe zheng
 * @date 2020/11/13 10:46 上午
 */
public enum RemindType {

    /**
     * 成员通知
     */
    MEMBER(1),

    /**
     * 评论通知
     */
    COMMENT(2);

    private int remindType;

    RemindType(int remindType) {
        this.remindType = remindType;
    }

    public int getRemindType() {
        return remindType;
    }

    public void setRemindType(int remindType) {
        this.remindType = remindType;
    }

    public static RemindType of(int remindType) {
        RemindType type = null;
        for (RemindType value : RemindType.values()) {
            if (value.getRemindType() == remindType) {
                return value;
            }
        }
        throw new IllegalStateException("Remind Type Can not parse");
    }
}
