package com.vikadata.scheduler.space.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Space Api Statistics Dto
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpaceApiStatisticsDto {
    
    private LocalDateTime beginDate;
    
    private Long beginTableId;
}
