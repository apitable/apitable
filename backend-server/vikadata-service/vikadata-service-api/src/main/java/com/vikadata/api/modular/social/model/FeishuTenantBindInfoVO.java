package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * 飞书企业的注册邀请码
 *
 * @author Shawn Deng
 * @date 2020-12-09 10:49:13
 */
@Data
@ApiModel("飞书企业的注册邀请码")
public class FeishuTenantBindInfoVO {

    @ApiModelProperty(value = "邀请码", example = "1263123")
    private String inviteCode;

    @ApiModelProperty(value = "绑定空间列表")
    private List<BindSpaceInfoVO> bindInfoList;

    @Setter
    @Getter
    @ToString
    public static class BindSpaceInfoVO {

        @ApiModelProperty(value = "空间ID", example = "spc12hjasd")
        private String spaceId;

        @ApiModelProperty(value = "空间名称", example = "空间站")
        private String spaceName;
    }
}
