package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 标签视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/21 19:09
 */
@Data
@ApiModel("标签视图")
public class TagVo {

    @ApiModelProperty(value = "标签ID", dataType = "java.lang.String", example = "2", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long tagId;

    @ApiModelProperty(value = "标签名称", example = "产品", position = 2)
    private String tagName;
}
