package com.vikadata.api.model.vo.wechat;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

import static com.vikadata.api.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

/**
 * <p>
 * Official account QR code page vo
 * </p>
 */
@Data
@ApiModel("Official account QR code page vo")
@EqualsAndHashCode(callSuper = true)
public class QrCodePageVo extends QrCodeBaseInfo {

    @ApiModelProperty(value = "Scene Values", dataType = "java.lang.String", example = "XX_channel_popularize", position = 5)
    private String scene;

    @ApiModelProperty(value = "Creator", dataType = "java.lang.String", example = "Zhang San", position = 6)
    private String creator;

    @ApiModelProperty(value = "Create time", example = "2019-01-01 10:12:13", position = 6)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "Statistical data", position = 7)
    private QrCodeStatisticsVo statistics;
}
