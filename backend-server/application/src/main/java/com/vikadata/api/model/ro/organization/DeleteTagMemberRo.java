package com.vikadata.api.model.ro.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * <p>
 * 移除标签成员请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/21 20:27
 */
@Data
@ApiModel("移除标签成员请求参数")
public class DeleteTagMemberRo {

    @NotNull
    @ApiModelProperty(value = "成员ID", example = "1", required = true, position = 2)
    private Long tagId;

    @NotEmpty
    @Size(max = 100)
    @ApiModelProperty(value = "成员ID集合", dataType = "List", example = "[1,2,3,4]", required = true, position = 3)
    private List<Long> memberId;
}
