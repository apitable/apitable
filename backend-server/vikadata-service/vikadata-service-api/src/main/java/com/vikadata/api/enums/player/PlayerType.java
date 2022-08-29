package com.vikadata.api.enums.player;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 用户类型
 * </p>
 *
 * @author zoe zheng
 * @date 2020/10/13 12:16 下午
 */
@AllArgsConstructor
@Getter
public enum PlayerType {
    /**
     * 空间内用户
     */
    MEMBER(1),
    /**
     * 被删除的空间成员
     */
    MEMBER_DELETED(2),
    /**
     * 访客
     */
    VISITORS(3);

    private final Integer type;
}
