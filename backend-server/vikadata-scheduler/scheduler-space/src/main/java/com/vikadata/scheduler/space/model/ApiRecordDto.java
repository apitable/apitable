package com.vikadata.scheduler.space.model;

import lombok.Data;

/**
 * <p>
 * ApiRecordDto
 * <p>
 *
 * @author liuzijing
 * @date 2022/06/05
 */
@Data
public class ApiRecordDto {

    /**
     * 最小记录ID
     */
    private Long minId;

    /**
     * 月份
     */
    private String monthTime;
}
