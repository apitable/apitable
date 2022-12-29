package com.vikadata.scheduler.space.model;

import lombok.Data;

/**
 * <p>
 * SpaceApiUsageDto
 * </p>
 */
@Data
public class SpaceApiUsageDto {

    private String statisticsTime;

    private String spaceId;

    /**
     * total number of calls
     */
    private Long totalCount;

    /**
     * number of successful requests
     */
    private Long successCount;
}
