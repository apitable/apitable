package com.vikadata.api.enterprise.social.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * Information of WeCom third-party application after login
 * </p>
 */
@ApiModel("Information of WeCom third-party application after login")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
public class WeComIsvUserLoginVo {

    /**
     * Whether you have logged in. 0: No; 1: Yes
     */
    @ApiModelProperty("Whether you have logged in. 0: No; 1: Yes")
    private Integer logined;

    /**
     * App Suite ID
     */
    @ApiModelProperty("App Suite ID")
    private String suiteId;

    /**
     * Authorized enterprise ID
     */
    @ApiModelProperty("Authorized enterprise ID")
    private String authCorpId;

    /**
     * Space ID bound by the application
     */
    @ApiModelProperty("Space ID bound by the application")
    private String spaceId;

    /**
     * Whether the address book is being synchronized. 0: No; 1: Yes
     */
    @ApiModelProperty("Whether the address book is being synchronized. 0: No; 1: Yes")
    private Integer contactSyncing;

    /**
     * User's default member name
     */
    @ApiModelProperty("User's default member name")
    private String defaultName;

    /**
     * Whether the default name needs to be changed. 0: No; 1: Yes
     */
    @ApiModelProperty("Whether the default name needs to be changed. 0: No; 1: Yes")
    private Integer shouldRename;

    /**
     * Whether manual authorization is required again. 0: No; 1: Yes
     */
    @ApiModelProperty("Whether manual authorization is required again. 0: No; 1: Yes")
    private Integer shouldReAuth;

}
