package com.vikadata.scheduler.space.model;

import lombok.Data;

/**
 * <p>
 * 积分（V 币）统计 DTO
 * </p>
 *
 * @author Chambers
 * @date 2021/7/13
 */
@Data
public class IntegralStaticsDto {

    private Integer issuedAmount;

    private Integer consumption;
}
