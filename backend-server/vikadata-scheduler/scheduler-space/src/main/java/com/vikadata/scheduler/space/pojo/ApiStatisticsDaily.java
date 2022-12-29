package com.vikadata.scheduler.space.pojo;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ApiStatisticsDaily {

    private Long id;

    private String spaceId;

    private String statisticsTime;

    private Long totalCount;

    private Long successCount;

    private Long failureCount;

    private LocalDateTime createdAt;
}
