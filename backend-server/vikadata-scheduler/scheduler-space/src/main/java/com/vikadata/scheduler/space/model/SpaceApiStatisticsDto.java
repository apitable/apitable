package com.vikadata.scheduler.space.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 空间API统计DTO
 * </p>
 *
 * @author Chambers
 * @date 2022/7/20
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpaceApiStatisticsDto {
    
    private LocalDateTime beginDate;
    
    private Long beginTableId;
}
