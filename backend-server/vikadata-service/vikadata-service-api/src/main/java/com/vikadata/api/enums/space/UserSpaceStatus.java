package com.vikadata.api.enums.space;

/**
 * <p>
 * user status in space
 * </p>
 *
 * @author Chambers
 */
public enum UserSpaceStatus {

    INACTIVE(0),

    ACTIVE(1),

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
