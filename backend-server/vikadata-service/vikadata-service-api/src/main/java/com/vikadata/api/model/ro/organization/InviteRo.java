package com.vikadata.api.model.ro.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * <p>
 * 邮件邀请成员请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/11 10:23
 */
@Data
@ApiModel("邮件邀请成员请求参数")
public class InviteRo {

    @Valid
    @NotEmpty
    @Size(max = 50, message = "邀请成员数量最多50个人")
    @ApiModelProperty(value = "邀请成员列表", required = true, position = 3)
    private List<InviteMemberRo> invite;

    @ApiModelProperty(value = "节点ID", example = "dst10", position = 4)
    private String nodeId;

    @ApiModelProperty(value = "密码登录人机验证，前端获取getNVCVal函数的值（未登录状态下会进行人机验证）", example = "FutureIsComing", position = 5)
    private String data;
}
