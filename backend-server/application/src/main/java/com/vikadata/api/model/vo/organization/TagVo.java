package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Label View
 * </p>
 */
@Data
@ApiModel("Label View")
public class TagVo {

    @ApiModelProperty(value = "Tag ID", dataType = "java.lang.String", example = "2", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long tagId;

    @ApiModelProperty(value = "Label Name", example = "Product", position = 2)
    private String tagName;
}
