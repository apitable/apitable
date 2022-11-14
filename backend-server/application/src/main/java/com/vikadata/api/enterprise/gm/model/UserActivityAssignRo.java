package com.vikadata.api.enterprise.gm.model;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;

@Data
@ApiModel("User Activity Assign Ro")
public class UserActivityAssignRo {

    @ApiModelProperty(value = "wizard id", example = "7", position = 1)
    private Integer wizardId;

    @ApiModelProperty(value = "specifies the value of the wizard id", example = "7", position = 2)
    private Integer value;

    @ApiModelProperty(value = "specifying user id list（choose one of the two phone numbers with the test）", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 3)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> userIds;

    @ApiModelProperty(value = "mobile phone number of the test account", example = "1340000", position = 4)
    private String testMobile;
}
