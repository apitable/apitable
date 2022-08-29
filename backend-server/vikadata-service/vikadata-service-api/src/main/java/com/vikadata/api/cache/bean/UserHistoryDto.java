package com.vikadata.api.cache.bean;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import com.vikadata.api.enums.user.UserOperationType;

/**
 * <p>
 * 用户历史记录 数据传输对象
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2022/1/2 21:49:33
 */
@Data
@Builder
@EqualsAndHashCode
public class UserHistoryDto {

    /**
     * 用户历史记录ID
     */
    private Long id;

    /**
     * 用户ID
     * */
    private Long userId;

    /**
     * 注销状态
     * */
    private UserOperationType userOperationType;

    /**
     * 创建者
     * */
    private Long createdBy;

    /**
     * 更新者
     * */
    private Long updatedBy;

    /**
     * 创建时间
     * */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     * */
    private LocalDateTime updatedAt;

    public boolean available() {
        return UserOperationType.CANCEL_CLOSING.equals(this.userOperationType);
    }

}
