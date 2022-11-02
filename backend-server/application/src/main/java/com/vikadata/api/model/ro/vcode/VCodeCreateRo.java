package com.vikadata.api.model.ro.vcode;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.api.support.deserializer.DateFormatToLocalDateTimeDeserializer;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * <p>
 * V码创建请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/8/12
 */
@Data
@ApiModel("V码创建请求参数")
public class VCodeCreateRo {

    @ApiModelProperty(value = "创建数量", dataType = "java.lang.Integer", example = "1", position = 1, required = true)
    @NotNull(message = "数量不能为空")
    @Min(value = 1, message = "数量必须大于或等于1")
    private Integer count;

    @ApiModelProperty(value = "V码类型(0:官方邀请码;2:兑换码)", dataType = "java.lang.Integer", example = "0", position = 2, required = true)
    @NotNull(message = "类型不能为空")
    private Integer type;

    @ApiModelProperty(value = "活动ID", dataType = "java.lang.String", example = "1296402001573097473", position = 3, required = true)
    @NotNull(message = "活动ID不能为空")
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long activityId;

    @ApiModelProperty(value = "兑换模板ID(类型为兑换码时必须)", dataType = "java.lang.String", example = "1296405974262652930", position = 4)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long templateId;

    @ApiModelProperty(value = "单个V码可使用总数(-1 代表无限次数，默认1次)", dataType = "java.lang.Integer", example = "-1", position = 5)
    @Min(value = -1, message = "可使用总数设置错误")
    private Integer availableTimes = 1;

    @ApiModelProperty(value = "单个V码单人限制使用次数，默认1次", dataType = "java.lang.Integer", example = "1", position = 6)
    @Min(value = -1, message = "单人限制使用次数设置错误")
    private Integer limitTimes = 1;

    @ApiModelProperty(value = "过期时间", example = "2020-03-18T15:29:59.000Z/yyyy-MM-dd( HH:mm(:ss)(.SSS))", position = 7)
    @JsonDeserialize(using = DateFormatToLocalDateTimeDeserializer.class)
    private LocalDateTime expireTime;

    @ApiModelProperty(value = "指定可使用用户的账号手机号", example = "12580", position = 8)
    private String mobile;

}
