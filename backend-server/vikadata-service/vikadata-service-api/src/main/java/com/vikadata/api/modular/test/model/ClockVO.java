package com.vikadata.api.modular.test.model;

import java.time.LocalDate;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 时钟视图
 * @author Shawn Deng
 * @date 2022-05-25 16:44:04
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("时钟视图")
public class ClockVO {

    private String currentUtcTime;

    private String timeZone;

    private LocalDate localDate;
}
