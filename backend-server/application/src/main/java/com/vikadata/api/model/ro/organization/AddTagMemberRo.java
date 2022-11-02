package com.vikadata.api.model.ro.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * 添加标签成员请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/20 10:50
 */
@Data
@ApiModel("添加标签成员请求参数")
public class AddTagMemberRo {

    @ApiModelProperty(value = "标签ID", dataType = "long", example = "12032", position = 1)
    private Long tagId;

    @ApiModelProperty(value = "成员ID列表", dataType = "List", example = "[1,2,3,4]", position = 2)
    private List<Long> memberIds;
}
