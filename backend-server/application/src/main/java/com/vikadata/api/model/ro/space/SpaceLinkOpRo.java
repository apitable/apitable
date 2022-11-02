package com.vikadata.api.model.ro.space;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * 空间公开邀请链接请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/3/21
 */
@Data
@ApiModel("空间公开邀请链接请求参数")
public class SpaceLinkOpRo {

    @NotNull(message = "部门ID不能为空")
    @ApiModelProperty(value = "部门ID", dataType = "java.lang.String", example = "1254", position = 1, required = true)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;

    @ApiModelProperty(value = "nodeId", dataType = "java.lang.String", example = "dst***", position = 2)
    private String nodeId;
}
