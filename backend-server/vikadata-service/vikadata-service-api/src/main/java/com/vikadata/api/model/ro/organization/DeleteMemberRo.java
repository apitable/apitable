package com.vikadata.api.model.ro.organization;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 删除成员请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/21 20:27
 */
@Data
@ApiModel("删除成员请求参数")
public class DeleteMemberRo {

    @ApiModelProperty(value = "删除动作（0：本部门删除，1：彻底从组织架构删除）", example = "0", position = 1)
    private int action;

    @ApiModelProperty(value = "成员ID", dataType = "java.lang.String", example = "1", required = true, position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long memberId;

    @ApiModelProperty(value = "部门ID,如果是根部门，可不传，默认从根部门删除，与从空间内移除成员原理一致", dataType = "java.lang.String", example = "1", required = true, position = 3)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;
}
