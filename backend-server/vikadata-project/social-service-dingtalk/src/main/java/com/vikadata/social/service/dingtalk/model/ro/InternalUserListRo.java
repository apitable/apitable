package com.vikadata.social.service.dingtalk.model.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Internal interface call--get the parameters of the detailed list of users in the DingTalk department
 */
@Data
@ApiModel(value = "Internal interface call--get the parameters of the detailed list of users in the DingTalk department")
public class InternalUserListRo {
    @ApiModelProperty(value = "suiteId", dataType = "java.lang.String", example = "12345", required = true)
    private String suiteId;

    @ApiModelProperty(value = "authCorpId", dataType = "java.lang.String", example = "corpdfkdaj", required = true)
    private String authCorpId;

    @ApiModelProperty(value = "deptId", dataType = "java.lang.String", example = "1234L", required = true)
    private Long deptId;

    @ApiModelProperty(value = "cursor", dataType = "java.lang.Integer", example = "0")
    private Integer cursor = 0;

    @ApiModelProperty(value = "size", dataType = "java.lang.Integer", example = "100")
    private Integer size = 100;
}
