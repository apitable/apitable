package com.vikadata.api.enums.space;

/**
 * <p>
 * 用户的空间状态
 * </p>
 *
 * @author Chambers
 * @date 2019/12/16
 */
public enum UserSpaceStatus {

    /**
     * 非活跃
     */
    INACTIVE(0),

    /**
     * 活跃
     */
    ACTIVE(1),

    /**
     * 预删除
     */
    PRE_DEL(2);

    private int status;

    UserSpaceStatus(int status) {
        this.status = status;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
