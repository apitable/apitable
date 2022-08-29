package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 节点分享设置参数视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/24 14:00
 */
@Data
@ApiModel("节点分享设置参数视图")
public class NodeShareSettingPropsVO {

    @ApiModelProperty(value = "是否仅能查看", example = "true", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean onlyRead;

    @ApiModelProperty(value = "是否允许被编辑", example = "true", position = 2)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean canBeEdited;

    @ApiModelProperty(value = "是否允许被转存", example = "true", position = 3)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean canBeStored;
}
