package com.vikadata.api.model.vo.space;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullArraySerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Collection;

/**
 * <p>
 * 用户在指定空间的资源信息
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/12 02:33
 */
@Data
@ApiModel("用户在空间的资源信息视图")
public class UserSpaceVo {

    @ApiModelProperty(value = "空间名称", example = "我的工作空间", position = 1)
    private String spaceName;

    @ApiModelProperty(value = "是否主管理员", example = "true", position = 2)
    private Boolean mainAdmin;

    @ApiModelProperty(value = "权限", dataType = "List", example = "[\"MANAGE_TEAM\",\"MANAGE_MAIN_ADMIN\"]", position = 3)
    @JsonSerialize(using = NullArraySerializer.class, nullsUsing = NullArraySerializer.class)
    private Collection<String> permissions;
}
