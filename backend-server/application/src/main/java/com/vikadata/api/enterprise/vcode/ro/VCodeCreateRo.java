package com.vikadata.api.enterprise.vcode.ro;

import java.time.LocalDateTime;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.deserializer.DateFormatToLocalDateTimeDeserializer;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;

/**
 * <p>
 * V code creation request parameters
 * </p>
 */
@Data
@ApiModel("V code creation request parameters")
public class VCodeCreateRo {

    @ApiModelProperty(value = "Create quantity", dataType = "java.lang.Integer", example = "1", position = 1, required = true)
    @NotNull(message = "Quantity cannot be empty")
    @Min(value = 1, message = "Quantity must be greater than or equal to 1")
    private Integer count;

    @ApiModelProperty(value = "Type of V code (0: official invitation code; 2: exchange code)", dataType = "java.lang.Integer", example = "0", position = 2, required = true)
    @NotNull(message = "Type cannot be empty")
    private Integer type;

    @ApiModelProperty(value = "Activity ID", dataType = "java.lang.String", example = "1296402001573097473", position = 3, required = true)
    @NotNull(message = "Activity ID cannot be empty")
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long activityId;

    @ApiModelProperty(value = "Redemption template ID (required when the type is redemption code)", dataType = "java.lang.String", example = "1296405974262652930", position = 4)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long templateId;

    @ApiModelProperty(value = "The total number of times a single V code can be used (- 1 represents an unlimited number of times, 1 by default)", dataType = "java.lang.Integer", example = "-1", position = 5)
    @Min(value = -1, message = "Total number available setting error")
    private Integer availableTimes = 1;

    @ApiModelProperty(value = "Single V code can only be used by one person. The default is 1 time", dataType = "java.lang.Integer", example = "1", position = 6)
    @Min(value = -1, message = "Wrong setting of single person limit")
    private Integer limitTimes = 1;

    @ApiModelProperty(value = "Expiration time", example = "2020-03-18T15:29:59.000Z/yyyy-MM-dd( HH:mm(:ss)(.SSS))", position = 7)
    @JsonDeserialize(using = DateFormatToLocalDateTimeDeserializer.class)
    private LocalDateTime expireTime;

    @ApiModelProperty(value = "Specify the mobile phone number of the user's account", example = "12580", position = 8)
    private String mobile;

}
