package com.vikadata.api.modular.test.model;

import java.time.LocalDate;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clock View
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("Clock View")
public class ClockVO {

    private String currentUtcTime;

    private String timeZone;

    private LocalDate localDate;
}
