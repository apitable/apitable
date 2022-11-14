package com.vikadata.api.enterprise.vcode.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

import static com.vikadata.api.shared.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

/**
 * <p>
 * Page view of V-code coupon template
 * </p>
 */
@Data
@ApiModel("Page view of V-code coupon template")
@EqualsAndHashCode(callSuper = true)
public class VCodeCouponPageVo extends VCodeCouponVo {

    @ApiModelProperty(value = "Creator", dataType = "java.lang.String", example = "Zhang San", position = 4)
    private String creator;

    @ApiModelProperty(value = "Create time", example = "2019-01-01 10:12:13", position = 4)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "Last Modified By", dataType = "java.lang.String", example = "Li Si", position = 5)
    private String updater;

    @ApiModelProperty(value = "Last modified", example = "2019-01-01 10:12:13", position = 5)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime updatedAt;
}
