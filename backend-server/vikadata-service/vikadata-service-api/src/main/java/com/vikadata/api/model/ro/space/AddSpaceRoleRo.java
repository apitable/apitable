package com.vikadata.api.model.ro.space;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.util.List;

/**
 * <p>
 * 添加管理员请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/12 23:58
 */
@Data
@ApiModel("添加管理员请求参数")
public class AddSpaceRoleRo {

    @NotEmpty(message = "选择成员列表不能为空")
    @ApiModelProperty(value = "成员ID", dataType = "List", example = "[1,2]", required = true, position = 2)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> memberIds;

    @NotEmpty(message = "资源不能为空")
    @ApiModelProperty(value = "操作资源集合，不分排序，自动校验", dataType = "List", required = true, example = "[\"MANAGE_TEAM\",\"MANAGE_MEMBER\"]", position = 2)
    private List<String> resourceCodes;
}
