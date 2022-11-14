package com.vikadata.api.enterprise.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * Lark Enterprise registration invitation code
 */
@Data
@ApiModel("Lark Enterprise registration invitation code")
public class FeishuTenantBindInfoVO {

    @ApiModelProperty(value = "Invitation code", example = "1263123")
    private String inviteCode;

    @ApiModelProperty(value = "List of bound spaces")
    private List<BindSpaceInfoVO> bindInfoList;

    @Setter
    @Getter
    @ToString
    public static class BindSpaceInfoVO {

        @ApiModelProperty(value = "Space ID", example = "spc12hjasd")
        private String spaceId;

        @ApiModelProperty(value = "Space name", example = "Space station")
        private String spaceName;
    }
}
