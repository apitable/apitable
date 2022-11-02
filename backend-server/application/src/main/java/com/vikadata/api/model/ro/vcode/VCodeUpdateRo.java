package com.vikadata.api.model.ro.vcode;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.api.support.deserializer.DateFormatToLocalDateTimeDeserializer;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Min;
import java.time.LocalDateTime;

/**
 * <p>
 * V码修改请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/8/12
 */
@Data
@ApiModel("V码修改请求参数")
public class VCodeUpdateRo {

    @ApiModelProperty(value = "兑换模板ID(仅类型为兑换码时可修改)", dataType = "java.lang.String", example = "1296402001573097473", position = 1)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long templateId;

    @ApiModelProperty(value = "可使用总数", dataType = "java.lang.Integer", example = "100", position = 2)
    @Min(value = -1, message = "可使用总数设置错误")
    private Integer availableTimes;

    @ApiModelProperty(value = "单人限制使用次数", dataType = "java.lang.Integer", example = "5", position = 3)
    @Min(value = -1, message = "单人限制使用次数设置错误")
    private Integer limitTimes;

    @ApiModelProperty(value = "过期时间", example = "2020-03-18T15:29:59.000Z/yyyy-MM-dd( HH:mm(:ss)(.SSS))", position = 4)
    @JsonDeserialize(using = DateFormatToLocalDateTimeDeserializer.class)
    private LocalDateTime expireTime;

}
