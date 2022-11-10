package com.vikadata.api.model.vo.widget;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;

/**
 * <p>
 * Widget Release Version History View
 * </p>
 */
@Data
@ApiModel("Widget Release Version History View")
public class WidgetReleaseListVo {

    @ApiModelProperty(value = "Publish this Sha value", position = 1)
    private String releaseSha;

    @ApiModelProperty(value = "EDITION", example = "1.0.0", position = 2)
    private String version;

    @ApiModelProperty(value = "Status (0: to be approved, 1: approved, 2: rejected)", example = "1", position = 3)
    private Integer status;

    @ApiModelProperty(value = "Code Address", example = "https://s1.vika.cn/code/2020/12/23/aqa", position = 4)
    @JsonSerialize(using = ImageSerializer.class)
    private String releaseCodeBundle;

    @ApiModelProperty(value = "Source code address", example = "https://s1.vika.cn/code/2020/12/23/aqa", position = 5)
    @JsonSerialize(using = ImageSerializer.class)
    private String sourceCodeBundle;

    @ApiModelProperty(value = "Current release version", position = 6)
    private Boolean currentVersion;

    @ApiModelProperty(hidden = true)
    @JsonIgnore
    private Long releaseId;

}
