package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 邀请信息视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/4 19:13
 */
@Data
@ApiModel("邀请信息视图")
public class InviteInfoVo {

    @ApiModelProperty(value = "空间ID", example = "spcyQkKp9XJEl", position = 1)
    private String spaceId;

    @ApiModelProperty(value = "空间名称", example = "工作空间", position = 2)
    private String spaceName;

    @ApiModelProperty(value = "邀请用户", example = "张三", position = 3)
    private String inviter;

    @ApiModelProperty(value = "受邀邮箱", example = "xxxx@vikadata.com", position = 4)
    private String inviteEmail;

    @ApiModelProperty(value = "是否在登录状态", example = "true", position = 5)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isLogin;

    @ApiModelProperty(value = "是否受邀邮箱已绑定账户", example = "true", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isBound;

    @ApiModelProperty(value = "邀请者的个人邀请码", example = "vikatest", position = 7)
    private String inviteCode;
}
