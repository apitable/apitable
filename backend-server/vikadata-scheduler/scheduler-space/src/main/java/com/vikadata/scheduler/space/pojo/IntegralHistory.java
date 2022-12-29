package com.vikadata.scheduler.space.pojo;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class IntegralHistory {

    private Long id;

    private Long userId;

    private String actionCode;

    private Integer originIntegral;

    private Integer alterType;

    private Integer alterIntegral;

    private Integer totalIntegral;

    private String parameter;

    private Long createdBy;

    private Long updatedBy;

    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

}
