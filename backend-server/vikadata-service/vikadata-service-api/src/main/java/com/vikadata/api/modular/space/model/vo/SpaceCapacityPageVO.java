package com.vikadata.api.modular.space.model.vo;

import com.vikadata.api.modular.space.model.InviteUserInfo;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 空间附件容量明细VO
 * </p>
 *
 * @author liuzijing
 * @date 2022/8/12
 */
@Data
@ApiModel("空间附件容量明细")
public class SpaceCapacityPageVO {

    @ApiModelProperty(value = "被邀请用户信息", position = 1)
    private InviteUserInfo inviteUserInfo;

    @ApiModelProperty(value = "额度来源", position = 2)
    private String quotaSource;

    @ApiModelProperty(value = "额度", position = 3)
    private String quota;

    @ApiModelProperty(value = "到期时间", position = 4)
    private String expireDate;

}
