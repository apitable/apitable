package com.vikadata.social.feishu.model.v3;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 用户状态
 * 新版通讯录事件
 *
 * @author Shawn Deng
 * @date 2020-12-24 12:08:15
 */
@Setter
@Getter
public class UserStatus {

    @JsonProperty("is_activated")
    private boolean isActivated;

    @JsonProperty("is_frozen")
    private boolean isFrozen;

    @JsonProperty("is_resigned")
    private boolean isResigned;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserStatus that = (UserStatus) o;
        return isActivated == that.isActivated && isFrozen == that.isFrozen && isResigned == that.isResigned;
    }

    @Override
    public int hashCode() {
        return Objects.hash(isActivated, isFrozen, isResigned);
    }
}
