package com.vikadata.api.labs.vo;

import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.shared.support.serializer.NullStringSerializer;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

/**
 * <p>
 * GM command returns the created experimental function value object
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("GM command returns the experimental function after creation")
public class GmLabFeatureVo {

    @ApiModelProperty(value = "Unique identification of laboratory function", dataType = "java.lang.String", example = "render_prompt|async_compute|robot|widget_center", position = 1)
    private String featureKey;

    @ApiModelProperty(value = "Lab Functional Scope", dataType = "java.lang.String", example = "user|space", position = 2)
    private String featureScope;

    @ApiModelProperty(value = "Laboratory function category", dataType = "java.lang.String", example = "static|review|normal", position = 3)
    private String type;

    @ApiModelProperty(value = "Address of magic form for applying for internal test function", dataType = "java.lang.String", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String url;

    @ApiModelProperty(value = "Laboratory function opening status", dataType = "java.lang.Boolean", example = "true|false", position = 5)
    private Boolean open;

    @CreatedDate
    @ApiModelProperty(value = "Create time", dataType = "java.time.LocalDateTime", example = "2021-10-26T12:34:56", position = 6)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @ApiModelProperty(value = "Update time", dataType = "java.time.LocalDateTime", example = "2021-10-26T12:34:56", position = 7)
    private LocalDateTime updatedAt;
}
