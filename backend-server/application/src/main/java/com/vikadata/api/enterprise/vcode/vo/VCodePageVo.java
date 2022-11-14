package com.vikadata.api.enterprise.vcode.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

import static com.vikadata.api.shared.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

/**
 * <p>
 * V code paging view
 * </p>
 */
@Data
@ApiModel("V code paging view")
public class VCodePageVo {

    @ApiModelProperty(value = "Activity Name", dataType = "java.lang.String", example = "XX Channel promotion", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String activityName;

    @ApiModelProperty(value = "Type of V code (0: official invitation code; 2: exchange code)", dataType = "java.lang.Integer", example = "0", position = 2)
    private Integer type;

    @ApiModelProperty(value = "V code", dataType = "java.lang.String", example = "2Mecwhid", position = 3)
    private String code;

    @ApiModelProperty(value = "Remarks on exchange code exchange template", dataType = "java.lang.String", example = "2Mecwhid", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String templateComment;

    @ApiModelProperty(value = "The total number of times a single V code can be used (- 1 represents an unlimited number of times)", dataType = "java.lang.Integer", example = "-1", position = 5)
    private Integer availableTimes;

    @ApiModelProperty(value = "Remaining times", dataType = "java.lang.Integer", example = "-1", position = 5)
    private Integer remainTimes;

    @ApiModelProperty(value = "Single person limited use times (- 1 represents unlimited times)", dataType = "java.lang.Integer", example = "1", position = 5)
    private Integer limitTimes;

    @ApiModelProperty(value = "Expiration time", example = "yyyy-MM-dd HH:mm:ss", position = 6)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime expireTime;

    @ApiModelProperty(value = "Specified user", dataType = "java.lang.String", example = "A pretty boy", position = 7)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String assignUser;

    @ApiModelProperty(value = "Creator", dataType = "java.lang.String", example = "Zhang San", position = 8)
    private String creator;

    @ApiModelProperty(value = "Create time", example = "2019-01-01 10:12:13", position = 8)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "Last Modified By", dataType = "java.lang.String", example = "Li Si", position = 9)
    private String updater;

    @ApiModelProperty(value = "Last modified", example = "2019-01-01 10:12:13", position = 9)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime updatedAt;
}
