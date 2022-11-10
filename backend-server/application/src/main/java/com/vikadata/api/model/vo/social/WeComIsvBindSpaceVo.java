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
 * Space information bound by WeCom third-party applications
 * </p>
 */
@ApiModel("Space information bound by WeCom third-party applications")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
public class WeComIsvBindSpaceVo {

    /**
     * Whether you have logged in. 0: No; 1: Yes
     */
    @ApiModelProperty("Whether you have logged in. 0: No; 1: Yes")
    private Integer logined;

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

}
