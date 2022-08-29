package com.vikadata.api.model.vo.vcode;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

import static com.vikadata.api.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

/**
 * <p>
 * V码分页视图
 * </p>
 *
 * @author Chambers
 * @date 2020/8/25
 */
@Data
@ApiModel("V码分页视图")
public class VCodePageVo {

    @ApiModelProperty(value = "活动名称", dataType = "java.lang.String", example = "XX 渠道推广", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String activityName;

    @ApiModelProperty(value = "V码类型(0:官方邀请码;2:兑换码)", dataType = "java.lang.Integer", example = "0", position = 2)
    private Integer type;

    @ApiModelProperty(value = "V码", dataType = "java.lang.String", example = "2Mecwhid", position = 3)
    private String code;

    @ApiModelProperty(value = "兑换码兑换模板备注", dataType = "java.lang.String", example = "2Mecwhid", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String templateComment;

    @ApiModelProperty(value = "单个V码可使用总数(-1 代表无限次数)", dataType = "java.lang.Integer", example = "-1", position = 5)
    private Integer availableTimes;

    @ApiModelProperty(value = "剩余次数", dataType = "java.lang.Integer", example = "-1", position = 5)
    private Integer remainTimes;

    @ApiModelProperty(value = "单人限制使用次数(-1 代表无限次数)", dataType = "java.lang.Integer", example = "1", position = 5)
    private Integer limitTimes;

    @ApiModelProperty(value = "过期时间", example = "yyyy-MM-dd HH:mm:ss", position = 6)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime expireTime;

    @ApiModelProperty(value = "指定的使用者", dataType = "java.lang.String", example = "一个靓仔", position = 7)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String assignUser;

    @ApiModelProperty(value = "创建者", dataType = "java.lang.String", example = "张三", position = 8)
    private String creator;

    @ApiModelProperty(value = "创建时间", example = "2019-01-01 10:12:13", position = 8)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "最后修改者", dataType = "java.lang.String", example = "李四", position = 9)
    private String updater;

    @ApiModelProperty(value = "最后修改时间", example = "2019-01-01 10:12:13", position = 9)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime updatedAt;
}
