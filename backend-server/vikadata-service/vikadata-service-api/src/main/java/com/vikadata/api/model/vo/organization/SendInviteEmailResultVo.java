package com.vikadata.api.model.vo.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 发送邀请邮件结果视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/4 19:13
 */
@Data
@ApiModel("发送邀请邮件结果视图")
public class SendInviteEmailResultVo {

    @ApiModelProperty(value = "发送总数", example = "1", position = 1)
    private int total;

    @ApiModelProperty(value = "发送成功数", example = "1", position = 1)
    private int success;

    @ApiModelProperty(value = "发送失败数", example = "1", position = 1)
    private int error;

    @ApiModelProperty(value = "是否邮箱已被绑定", example = "true", position = 4)
    private Boolean isBound;
}
