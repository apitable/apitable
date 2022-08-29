package com.vikadata.scheduler.space.model;

import lombok.Data;

/**
 * <p>
 * SpaceApiUsageDto
 * </p>
 *
 * @author liuzijing
 * @date 2022/5/25
 */
@Data
public class SpaceApiUsageDto {

    /**
     * 统计日期
     */
    private String statisticsTime;

    /**
     * 空间ID
     */
    private String spaceId;

    /**
     * 调用总数
     */
    private Long totalCount;

    /**
     * 请求成功次数
     */
    private Long successCount;
}
