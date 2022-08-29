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
 * 公众号二维码分页vo
 * </p>
 *
 * @author Chambers
 * @date 2020/8/24
 */
@Data
@ApiModel("公众号二维码分页vo")
@EqualsAndHashCode(callSuper = true)
public class QrCodePageVo extends QrCodeBaseInfo {

    @ApiModelProperty(value = "场景值", dataType = "java.lang.String", example = "XX_channel_popularize", position = 5)
    private String scene;

    @ApiModelProperty(value = "创建者", dataType = "java.lang.String", example = "张三", position = 6)
    private String creator;

    @ApiModelProperty(value = "创建时间", example = "2019-01-01 10:12:13", position = 6)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "统计数据", position = 7)
    private QrCodeStatisticsVo statistics;
}
