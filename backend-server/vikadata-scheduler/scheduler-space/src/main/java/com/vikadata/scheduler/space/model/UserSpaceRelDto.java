package com.vikadata.scheduler.space.model;

import lombok.Data;

/**
 * <p>
 * 用户空间关联dto
 * </p>
 *
 * @author Chambers
 * @date 2019/11/18
 */
@Data
public class UserSpaceRelDto {

    /**
     * 成员ID
     */
    private Long id;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 空间ID
     */
    private String spaceId;
}
