package com.vikadata.api.model.vo.social;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 企业微信第三方应用登录后的信息
 * </p>
 * @author 刘斌华
 * @date 2022-01-20 16:51:15
 */
@ApiModel("企业微信第三方应用登录后的信息")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
public class WeComIsvUserLoginVo {

    /**
     * 是否已经登录。0：否；1：是
     */
    @ApiModelProperty("是否已经登录。0：否；1：是")
    private Integer logined;

    /**
     * 应用套件 ID
     */
    @ApiModelProperty("应用套件 ID")
    private String suiteId;

    /**
     * 授权的企业 ID
     */
    @ApiModelProperty("授权的企业 ID")
    private String authCorpId;

    /**
     * 应用绑定的空间站 ID
     */
    @ApiModelProperty("应用绑定的空间站 ID")
    private String spaceId;

    /**
     * 是否正在同步通讯录。0：否；1：是
     */
    @ApiModelProperty("是否正在同步通讯录。0：否；1：是")
    private Integer contactSyncing;

    /**
     * 用户的默认成员名称
     */
    @ApiModelProperty("用户的默认成员名称")
    private String defaultName;

    /**
     * 是否需要更改默认名称。0：否；1：是
     */
    @ApiModelProperty("是否需要更改默认名称。0：否；1：是")
    private Integer shouldRename;

    /**
     * 是否需要再次手动授权。0：否；1：是
     */
    @ApiModelProperty("是否需要再次手动授权。0：否；1：是")
    private Integer shouldReAuth;

}
