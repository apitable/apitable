package com.vikadata.api.space.vo;

import com.vikadata.api.space.vo.InviteUserInfo;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Space Asset Capacity Detail")
public class SpaceCapacityPageVO {

    @ApiModelProperty(value = "invited user info", position = 1)
    private InviteUserInfo inviteUserInfo;

    @ApiModelProperty(value = "quota source", position = 2)
    private String quotaSource;

    @ApiModelProperty(value = "quota", position = 3)
    private String quota;

    @ApiModelProperty(value = "expire date", position = 4)
    private String expireDate;

}
