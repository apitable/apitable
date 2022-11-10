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
 * V code modification request parameters
 * </p>
 */
@Data
@ApiModel("V code modification request parameters")
public class VCodeUpdateRo {

    @ApiModelProperty(value = "Redemption template ID (modifiable only when the type is redemption code)", dataType = "java.lang.String", example = "1296402001573097473", position = 1)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long templateId;

    @ApiModelProperty(value = "Total Available", dataType = "java.lang.Integer", example = "100", position = 2)
    @Min(value = -1, message = "Total number available setting error")
    private Integer availableTimes;

    @ApiModelProperty(value = "Limit the number of uses per person", dataType = "java.lang.Integer", example = "5", position = 3)
    @Min(value = -1, message = "Wrong setting of single person limit")
    private Integer limitTimes;

    @ApiModelProperty(value = "Expiration time", example = "2020-03-18T15:29:59.000Z/yyyy-MM-dd( HH:mm(:ss)(.SSS))", position = 4)
    @JsonDeserialize(using = DateFormatToLocalDateTimeDeserializer.class)
    private LocalDateTime expireTime;

}
